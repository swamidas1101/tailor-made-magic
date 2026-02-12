import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { Design, Category } from "@/types/database";

export const COLLECTION_DESIGNS = "designs";
export const COLLECTION_CATEGORIES = "categories";

// Designs
export const designService = {
  getAllDesigns: async (): Promise<Design[]> => {
    const querySnapshot = await getDocs(collection(db, COLLECTION_DESIGNS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Design));
  },

  getDesignById: async (id: string): Promise<Design | null> => {
    const docRef = doc(db, COLLECTION_DESIGNS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Design;
    }
    return null;
  },

  getDesignsByCategory: async (categoryId: string): Promise<Design[]> => {
    const q = query(
      collection(db, COLLECTION_DESIGNS),
      where("categoryId", "==", categoryId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Design));
  },

  getFeaturedDesigns: async (limitCount: number = 8): Promise<Design[]> => {
    const q = query(
      collection(db, COLLECTION_DESIGNS),
      where("isPopular", "==", true),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Design));
  },

  createDesign: async (design: Omit<Design, "id" | "createdAt" | "updatedAt">) => {
    return await addDoc(collection(db, COLLECTION_DESIGNS), {
      ...design,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  updateDesign: async (id: string, data: Partial<Design>) => {
    const docRef = doc(db, COLLECTION_DESIGNS, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  deleteDesign: async (id: string) => {
    await deleteDoc(doc(db, COLLECTION_DESIGNS, id));
  },

  getTailorDesigns: async (tailorId: string): Promise<Design[]> => {
    try {
      const q = query(
        collection(db, COLLECTION_DESIGNS),
        where("tailorId", "==", tailorId)
      );
      const querySnapshot = await getDocs(q);
      const designs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Design));

      return designs.sort((a, b) => {
        // Robust sort handling if createdAt is missing or not yet a Timestamp object
        const aTime = (a as any).createdAt?.toMillis?.() || 0;
        const bTime = (b as any).createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

    } catch (error) {
      console.error("Error fetching tailor designs:", error);
      return [];
    }
  }
};

// Categories
export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const querySnapshot = await getDocs(collection(db, COLLECTION_CATEGORIES));
    const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));

    // Sort or filter if needed? 
    // To distinguish men vs women, we might add a 'type' field later. 
    // For now, let's assume all are fetched and we filter client side if structure allows, 
    // OR we just assume the 'categories' collection has everything.
    return categories;
  },

  // Helper to distinguish men's categories if stored in same collection
  getMenCategories: async (): Promise<Category[]> => {
    // This presumes we add a 'gender' or 'type' field to categories in Firestore
    // For initial seeding, we might need to handle this.
    const q = query(collection(db, COLLECTION_CATEGORIES), where("type", "==", "men"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  }
};
