import { createContext, useContext, useState, ReactNode } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  tailorId?: string;
  shopName?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    const stored = localStorage.getItem("tailo_wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  const saveToStorage = (newItems: WishlistItem[]) => {
    localStorage.setItem("tailo_wishlist", JSON.stringify(newItems));
  };

  const addToWishlist = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      const newItems = [...prev, item];
      saveToStorage(newItems);
      return newItems;
    });
  };

  const removeFromWishlist = (id: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.id !== id);
      saveToStorage(newItems);
      return newItems;
    });
  };

  const isInWishlist = (id: string) => items.some((i) => i.id === id);

  return (
    <WishlistContext.Provider
      value={{ items, addToWishlist, removeFromWishlist, isInWishlist, totalItems: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
