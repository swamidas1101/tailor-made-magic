import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>(() => {
    const stored = localStorage.getItem("tailo_wishlist");
    return stored ? JSON.parse(stored) : [];
  });
  const [syncedUid, setSyncedUid] = useState<string | null>(null);
  const initialSyncDone = useRef(false);

  // Initial sync on mount/login
  useEffect(() => {
    const handleInitialSync = async () => {
      // Wait for auth to load
      if (authLoading) {
        return;
      }

      if (!user) {
        if (syncedUid) {
          setSyncedUid(null);
          initialSyncDone.current = false;
        }
        localStorage.setItem("tailo_wishlist", JSON.stringify(items));
        return;
      }

      if (user.uid === syncedUid && initialSyncDone.current) {
        return;
      }

      try {
        const userWishlistRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userWishlistRef);

        if (docSnap.exists() && docSnap.data().wishlist) {
          const remoteItems = docSnap.data().wishlist as WishlistItem[];
          setItems(remoteItems); // Use remote as source of truth
        } else if (items.length > 0) {
          await setDoc(userWishlistRef, { wishlist: items }, { merge: true });
        }

        localStorage.removeItem("tailo_wishlist");
        setSyncedUid(user.uid);
        initialSyncDone.current = true;
      } catch (err) {
        console.error("Wishlist sync failed:", err);
      }
    };

    handleInitialSync();
  }, [user?.uid, authLoading]);

  // Sync changes to DB when items change (only after initial sync)
  useEffect(() => {
    if (!user || !initialSyncDone.current) return;

    const syncToDb = async () => {
      try {
        const userWishlistRef = doc(db, "users", user.uid);
        await setDoc(userWishlistRef, { wishlist: items }, { merge: true });
      } catch (err) {
        console.error("Wishlist update failed:", err);
      }
    };

    syncToDb();
  }, [items, user]);

  const addToWishlist = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
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
