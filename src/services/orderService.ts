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
    orderType: 'stitching' | 'stitching_and_fabric';
    shopName?: string;
    measurementType?: 'manual' | 'pickup' | null;
    measurements?: Record<string, any> | null;
    pickupSlot?: {
        date: string;
        time: string;
    } | null;
    tailorId?: string;
    tailorNotes?: string;
    estimatedDays?: number;
}

export interface ShippingAddress {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
    label?: string;
}

export interface Order {
    id?: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    deliveryFee: number;
    discountAmount: number;
    totalFinalAmount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: any;
    shippingAddress: ShippingAddress;
    paymentStatus: "pending" | "paid";
    paymentMethod: string;
    measurementType: 'manual' | 'pickup';
    measurements?: Record<string, any>;
    pickupSlot?: {
        date: string;
        time: string;
    };
    promoCode?: string;
    tailorId?: string;
    tailorIds?: string[];
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
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

    getTailorOrders: async (tailorId: string): Promise<Order[]> => {
        // Query orders where tailorId matches (old format) or tailorIds contains tailorId (new format)
        const q1 = query(
            collection(db, COLLECTION_ORDERS),
            where("tailorId", "==", tailorId)
        );
        const q2 = query(
            collection(db, COLLECTION_ORDERS),
            where("tailorIds", "array-contains", tailorId)
        );

        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

        const orderMap = new Map<string, Order>();

        [...snap1.docs, ...snap2.docs].forEach(doc => {
            if (!orderMap.has(doc.id)) {
                orderMap.set(doc.id, {
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                } as Order);
            }
        });

        return Array.from(orderMap.values()).sort((a, b) => {
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
    },

    updateOrderItems: async (id: string, items: OrderItem[]) => {
        const docRef = doc(db, COLLECTION_ORDERS, id);
        await updateDoc(docRef, { items });
    }
};
