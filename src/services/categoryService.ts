import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from "firebase/firestore";
import { Category } from "@/types/database";

const COLLECTION_NAME = "categories";

export const categoryService = {
    /**
     * Get all categories, optionally filtered by gender
     */
    async getCategories(gender?: "men" | "women"): Promise<Category[]> {
        try {
            const categoriesRef = collection(db, COLLECTION_NAME);
            let q = query(categoriesRef);

            if (gender) {
                q = query(categoriesRef, where("type", "==", gender));
            }

            const snapshot = await getDocs(q);
            const categories = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Category));

            return categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    },

    /**
     * Get only active categories
     */
    async getActiveCategories(gender?: "men" | "women"): Promise<Category[]> {
        try {
            const categoriesRef = collection(db, COLLECTION_NAME);
            let q = query(
                categoriesRef,
                where("isActive", "==", true)
            );

            if (gender) {
                q = query(
                    categoriesRef,
                    where("type", "==", gender),
                    where("isActive", "==", true)
                );
            }

            const snapshot = await getDocs(q);
            const categories = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Category));

            return categories.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        } catch (error) {
            console.error("Error fetching active categories:", error);
            throw error;
        }
    },

    /**
     * Get a single category by ID
     */
    async getCategoryById(id: string): Promise<Category | null> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                } as Category;
            }
            return null;
        } catch (error) {
            console.error("Error fetching category:", error);
            throw error;
        }
    },

    /**
     * Create a new category (Admin only)
     */
    async createCategory(data: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<string> {
        try {
            const now = new Date().toISOString();
            const categoryData = {
                ...data,
                createdAt: now,
                updatedAt: now,
            };

            const docRef = await addDoc(collection(db, COLLECTION_NAME), categoryData);
            return docRef.id;
        } catch (error) {
            console.error("Error creating category:", error);
            throw error;
        }
    },

    /**
     * Update an existing category (Admin only)
     */
    async updateCategory(id: string, data: Partial<Category>): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const updateData = {
                ...data,
                updatedAt: new Date().toISOString(),
            };

            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error("Error updating category:", error);
            throw error;
        }
    },

    /**
     * Delete a category (Admin only)
     */
    async deleteCategory(id: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    },

    /**
     * Toggle category active status
     */
    async toggleCategoryStatus(id: string, isActive: boolean): Promise<void> {
        try {
            await this.updateCategory(id, { isActive });
        } catch (error) {
            console.error("Error toggling category status:", error);
            throw error;
        }
    },

    /**
     * Reorder categories by updating display order
     */
    async reorderCategories(categoryIds: string[]): Promise<void> {
        try {
            const promises = categoryIds.map((id, index) =>
                this.updateCategory(id, { displayOrder: index })
            );
            await Promise.all(promises);
        } catch (error) {
            console.error("Error reordering categories:", error);
            throw error;
        }
    }
};
