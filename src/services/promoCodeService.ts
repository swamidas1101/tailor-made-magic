import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from "firebase/firestore";

export interface PromoCode {
    id?: string;
    code: string;
    discountType: "fixed" | "percentage" | "free_delivery";
    value: number; // For fixed or percentage
    minOrderAmount: number;
    expiryDate: string;
    isActive: boolean;
    usageLimit?: number;
    usedCount: number;
    description: string;
}

const COLLECTION_PROMOS = "promo_codes";

export const promoCodeService = {
    getAllPromos: async (): Promise<PromoCode[]> => {
        const q = query(collection(db, COLLECTION_PROMOS));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoCode));
    },

    getActivePromos: async (): Promise<PromoCode[]> => {
        const q = query(
            collection(db, COLLECTION_PROMOS),
            where("isActive", "==", true)
        );
        const snapshot = await getDocs(q);
        const now = new Date();
        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as PromoCode))
            .filter(promo => new Date(promo.expiryDate) > now);
    },

    validatePromo: async (code: string, orderAmount: number): Promise<{ valid: boolean; message?: string; promo?: PromoCode }> => {
        const q = query(
            collection(db, COLLECTION_PROMOS),
            where("code", "==", code.toUpperCase()),
            where("isActive", "==", true)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return { valid: false, message: "Invalid promo code." };
        }

        const promo = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as PromoCode;

        if (new Date(promo.expiryDate) < new Date()) {
            return { valid: false, message: "This promo code has expired." };
        }

        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
            return { valid: false, message: "This promo code has reached its usage limit." };
        }

        if (orderAmount < promo.minOrderAmount) {
            return { valid: false, message: `Minimum order amount for this code is ₹${promo.minOrderAmount}.` };
        }

        return { valid: true, promo };
    },

    createPromo: async (promo: Omit<PromoCode, "id" | "usedCount">) => {
        return await addDoc(collection(db, COLLECTION_PROMOS), {
            ...promo,
            code: promo.code.toUpperCase(),
            usedCount: 0,
            createdAt: serverTimestamp()
        });
    },

    updatePromo: async (id: string, updates: Partial<PromoCode>) => {
        const docRef = doc(db, COLLECTION_PROMOS, id);
        await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
    },

    deletePromo: async (id: string) => {
        const docRef = doc(db, COLLECTION_PROMOS, id);
        await deleteDoc(docRef);
    }
};
