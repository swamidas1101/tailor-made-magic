import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    query,
    where
} from "firebase/firestore";

export interface TailorProfile {
    id: string; // Same as User UID
    name: string;
    email: string;
    phone?: string;
    specialty?: string;
    status: "pending" | "approved" | "blocked";
    joinDate: string;
    designsCount?: number;
    ordersCount?: number;
    rating?: number;
}

// Tailors are users with role="tailor", but we might want a separate profile collection
// or just query users with role="tailor". 
// For simplicity and scalability, let's query the 'users' collection for now.

export const tailorService = {
    getAllTailors: async (): Promise<TailorProfile[]> => {
        const q = query(
            collection(db, "users"),
            where("role", "==", "tailor")
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || "Unknown",
                email: data.email || "",
                phone: data.phone || "",
                specialty: data.specialty || "General",
                status: data.status || "pending", // Default to pending if field missing
                joinDate: data.createdAt || new Date().toISOString(),
                designsCount: data.designsCount || 0,
                ordersCount: data.ordersCount || 0,
                rating: data.rating || 0
            } as TailorProfile;
        });
    },

    updateTailorStatus: async (id: string, status: "approved" | "blocked") => {
        const docRef = doc(db, "users", id);
        await updateDoc(docRef, { status });
    }
};
