import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartItem {
  id: string;
  designId: string;
  name: string;
  image: string;
  price: number;
  withMaterial: boolean;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id"> | Omit<CartItem, "id" | "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  justAdded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("tailo_cart");
    return stored ? JSON.parse(stored) : [];
  });
  const [justAdded, setJustAdded] = useState(false);

  const saveToStorage = (newItems: CartItem[]) => {
    localStorage.setItem("tailo_cart", JSON.stringify(newItems));
  };

  const triggerAddAnimation = useCallback(() => {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  }, []);

  const addToCart = (item: Omit<CartItem, "id"> | Omit<CartItem, "id" | "quantity">) => {
    const quantity = "quantity" in item ? item.quantity : 1;
    const id = `${item.designId}-${item.size}-${item.withMaterial}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        newItems = [...prev, { ...item, id, quantity }];
      }
      saveToStorage(newItems);
      return newItems;
    });
    triggerAddAnimation();
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.id !== id);
      saveToStorage(newItems);
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => {
      const newItems = prev.map((i) => (i.id === id ? { ...i, quantity } : i));
      saveToStorage(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("tailo_cart");
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, justAdded }}
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
