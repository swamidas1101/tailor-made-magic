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
    serverTimestamp,
    orderBy
} from "firebase/firestore";

export interface OrderItem {
    designId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    withMaterial: boolean;
    image: string;
}

export interface Order {
    id?: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: any;
    shippingAddress: {
        fullName: string;
        phone: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    paymentStatus: "pending" | "paid";
    paymentMethod: string;
}

export const COLLECTION_ORDERS = "orders";

export const orderService = {
    createOrder: async (order: Omit<Order, "id" | "createdAt">) => {
        return await addDoc(collection(db, COLLECTION_ORDERS), {
            ...order,
            createdAt: serverTimestamp()
        });
    },

    getOrderById: async (id: string): Promise<Order | null> => {
        const docRef = doc(db, COLLECTION_ORDERS, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Order;
        }
        return null;
    },

    getUserOrders: async (userId: string): Promise<Order[]> => {
        // Remove orderBy to avoid Firebase composite index requirement
        // We'll sort client-side instead
        const q = query(
            collection(db, COLLECTION_ORDERS),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Handle timestamp conversion if needed for UI
            createdAt: doc.data().createdAt?.toDate() || new Date()
        } as Order));

        // Sort client-side by createdAt descending
        return orders.sort((a, b) => {
            const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
            const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
            return bTime - aTime;
        });
    },

    getAllOrders: async (): Promise<Order[]> => {
        const q = query(collection(db, COLLECTION_ORDERS), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
        } as Order));
    },

    updateOrderStatus: async (id: string, status: Order["status"]) => {
        const docRef = doc(db, COLLECTION_ORDERS, id);
        await updateDoc(docRef, { status });
    }
};
