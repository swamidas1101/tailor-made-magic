import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
  category: string;
  estimatedDays?: number;
  hasFabricOption?: boolean;
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
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    // Initial load from local storage (for guest or before auth loads)
    const stored = localStorage.getItem("tailo_cart");
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [syncedUid, setSyncedUid] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const initialSyncDone = useRef(false);

  // Initial sync on mount/login
  useEffect(() => {
    const handleInitialSync = async () => {
      // 0. WAIT FOR AUTH TO LOAD
      if (authLoading) {
        // Keep loading until we know if user is logged in or not
        return;
      }

      // 1. LOGOUT HANDLING
      if (!user) {
        if (syncedUid) {
          setSyncedUid(null);
          initialSyncDone.current = false;
        }
        localStorage.setItem("tailo_cart", JSON.stringify(items));
        setIsLoading(false);
        return;
      }

      // 2. ALREADY SYNCED THIS SESSION
      if (user.uid === syncedUid && initialSyncDone.current) {
        setIsLoading(false);
        return;
      }

      // 3. LOGIN / REFRESH SYNC
      try {
        setIsLoading(true);
        const userCartRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userCartRef);

        if (docSnap.exists() && docSnap.data().cart) {
          const remoteItems = docSnap.data().cart as CartItem[];
          setItems(remoteItems); // Use remote as source of truth on login
        } else if (items.length > 0) {
          await setDoc(userCartRef, { cart: items }, { merge: true });
        }

        localStorage.removeItem("tailo_cart");
        setSyncedUid(user.uid);
        initialSyncDone.current = true;
      } catch (err) {
        console.error("Cart sync failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    handleInitialSync();
  }, [user?.uid, authLoading]);

  // Sync changes to DB when items change (only after initial sync)
  useEffect(() => {
    if (!user || !initialSyncDone.current) return;

    const syncToDb = async () => {
      try {
        const userCartRef = doc(db, "users", user.uid);
        await setDoc(userCartRef, { cart: items }, { merge: true });
      } catch (err) {
        console.error("Cart update failed:", err);
      }
    };

    syncToDb();
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
      value={{ items, addToCart, removeFromCart, updateQuantity, updateItemDetails, clearCart, totalItems, totalPrice, justAdded, isLoading }}
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
