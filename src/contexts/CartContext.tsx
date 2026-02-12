import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

export interface CartItem {
  id: string;
  designId: string;
  name: string;
  image: string;
  price: number;
  withMaterial: boolean;
  size: string;
  quantity: number;
  orderType?: 'stitching' | 'stitching_and_fabric';
  measurementType?: 'manual' | 'pickup' | null;
  measurements?: Record<string, any> | null;
  pickupSlot?: {
    date: string;
    time: string;
  } | null;
  tailorId?: string;
  shopName?: string;
  estimatedDays?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id"> | Omit<CartItem, "id" | "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemDetails: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  justAdded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    // Initial load from local storage (for guest or before auth loads)
    const stored = localStorage.getItem("tailo_cart");
    return stored ? JSON.parse(stored) : [];
  });
  const [justAdded, setJustAdded] = useState(false);

  // Sync from Firestore when user logs in
  useEffect(() => {
    if (!user) return;

    const userCartRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userCartRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().cart) {
        // Determine if we should replace local items. 
        // For simplicity here, we prioritize Firestore if it exists.
        // A more complex strategy might merge.
        setItems(docSnap.data().cart as CartItem[]);
      } else if (items.length > 0) {
        // If remote is empty but we have local items (just signed up or first login), sync local -> remote
        setDoc(userCartRef, { cart: items }, { merge: true });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Sync to Storage (Local or Firestore) when items change
  useEffect(() => {
    if (user) {
      const userCartRef = doc(db, "users", user.uid);
      // We wrap this in a timeout or check to avoid rapid writes? 
      // Firestore writes are cheap enough for this scale.
      setDoc(userCartRef, { cart: items }, { merge: true }).catch(console.error);
    } else {
      localStorage.setItem("tailo_cart", JSON.stringify(items));
    }
  }, [items, user]);

  const triggerAddAnimation = useCallback(() => {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  }, []);

  const addToCart = (item: Omit<CartItem, "id"> | Omit<CartItem, "id" | "quantity">) => {
    const quantity = "quantity" in item ? item.quantity : 1;

    // Generate a unique ID that includes tailoring details to distinguish between different measurements/configs
    const tailoringRef = item.measurementType === 'manual'
      ? JSON.stringify(item.measurements || {})
      : (item.pickupSlot?.time || 'none');

    const id = `${item.designId}-${item.size}-${item.withMaterial}-${tailoringRef}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        return [...prev, { ...item, id: id.substring(0, 100), quantity }]; // Clamp ID length
      }
    });
    triggerAddAnimation();
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const updateItemDetails = (id: string, updates: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // If measurementType or other tailoring info changes, we might need a new ID
          // But for simple in-cart editing, keeping the same ID is easier if we don't want to re-generate everything.
          // However, addToCart uses these fields to distinguish items.
          // Let's just update the fields for now.
          return { ...item, ...updates };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("tailo_cart"); // Should we also clear firestore? Yes via useEffect
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, updateItemDetails, clearCart, totalItems, totalPrice, justAdded }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
