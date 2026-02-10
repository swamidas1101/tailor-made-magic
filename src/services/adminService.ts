import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
    updateDoc,
    orderBy,
    limit,
    getCountFromServer
} from "firebase/firestore";
import { Design } from "@/data/mockData";
import { COLLECTION_DESIGNS } from "./designService";

export const adminService = {
    getAdminStats: async () => {
        const tailorsQuery = query(collection(db, "users"), where("roles", "array-contains", "tailor"));
        const designsQuery = query(collection(db, COLLECTION_DESIGNS));
        const ordersQuery = query(collection(db, "orders")); // Assuming orders collection exists

        const [tailorsSnap, designsSnap, ordersSnap] = await Promise.all([
            getCountFromServer(tailorsQuery),
            getCountFromServer(designsQuery),
            getCountFromServer(ordersQuery)
        ]);

        return {
            totalTailors: tailorsSnap.data().count,
            totalDesigns: designsSnap.data().count,
            totalOrders: ordersSnap.data().count,
            revenueMTD: 0 // Placeholder until order/revenue logic is implementation
        };
    },

    getAllTailorsWithStats: async () => {
        const q = query(collection(db, "users"), where("roles", "array-contains", "tailor"));
        const querySnapshot = await getDocs(q);

        // For each tailor, we also want their design count
        const tailors = await Promise.all(querySnapshot.docs.map(async (tailorDoc) => {
            const data = tailorDoc.data();

            // Get actual design count
            const designsQuery = query(collection(db, COLLECTION_DESIGNS), where("tailorId", "==", tailorDoc.id));
            const designsSnap = await getCountFromServer(designsQuery);

            return {
                id: tailorDoc.id,
                name: data.name || "Unknown",
                email: data.email,
                phone: data.tailorProfile?.phone || data.phoneNumber || "N/A",
                status: data.kytStatus || 'pending',
                designs: designsSnap.data().count,
                orders: data.ordersCount || 0,
                rating: data.rating || 0,
                joinDate: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : "N/A",
                specialty: data.tailorProfile?.specialization?.join(", ") || "N/A",
                kytData: data.kytData,
                approved: data.kytStatus === 'approved'
            };
        }));

        return tailors;
    },

    getModerationDesigns: async () => {
        const q = query(
            collection(db, COLLECTION_DESIGNS),
            orderBy("submittedAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        // Fetch tailor names in parallel
        const designs = await Promise.all(querySnapshot.docs.map(async (designDoc) => {
            const designData = designDoc.data();
            let tailorName = "Unknown Tailor";

            if (designData.tailorId) {
                const tailorDoc = await getDoc(doc(db, "users", designData.tailorId));
                if (tailorDoc.exists()) {
                    tailorName = tailorDoc.data().name || "Unknown Tailor";
                }
            }

            return {
                id: designDoc.id,
                ...designData,
                name: designData.name || "Untitled Design",
                price: Number(designData.price) || 0,
                priceWithMaterial: Number(designData.priceWithMaterial) || 0,
                image: designData.image || "/placeholder.svg",
                status: designData.status || "pending",
                tailor: tailorName || "Unknown Tailor"
            } as any;
        }));

        return designs;
    },

    updateDesignStatus: async (designId: string, status: string, feedback?: string) => {
        const docRef = doc(db, COLLECTION_DESIGNS, designId);
        const updateData: any = { status };
        if (feedback !== undefined) {
            updateData.adminFeedback = feedback;
        }
        await updateDoc(docRef, updateData);
    },

    updateTailorStatus: async (tailorId: string, status: string) => {
        const docRef = doc(db, "users", tailorId);
        await updateDoc(docRef, {
            kytStatus: status,
            roles: status === 'approved' ? ['tailor'] : ['customer'] // profound effect: actually grant/revoke role
        });
    },

    getAllOrders: async () => {
        try {
            const q = query(collection(db, "orders"));
            const querySnapshot = await getDocs(q);
            const orders = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    customerName: data.customerName || "Guest Customer",
                    items: data.items || [],
                    status: data.status || "pending",
                    total: Number(data.total) || 0,
                    createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
                    date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()
                };
            });
            return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } catch (error) {
            console.error("Error fetching orders from DB:", error);
            // Fallback to empty array or mock if needed, but strictly returning empty for now to avoid crash
            return [];
        }
    },

    getAnalyticsData: async () => {
        const tailorsQuery = query(collection(db, "users"), where("roles", "array-contains", "tailor"));
        const designsQuery = query(collection(db, COLLECTION_DESIGNS));
        const ordersQuery = query(collection(db, "orders"));

        const [tailorsSnap, designsSnap, ordersSnap] = await Promise.all([
            getCountFromServer(tailorsQuery),
            getCountFromServer(designsQuery),
            getCountFromServer(ordersQuery)
        ]);

        return {
            totalTailors: tailorsSnap.data().count,
            totalDesigns: designsSnap.data().count,
            totalOrders: ordersSnap.data().count,
            revenue: 154000,
            revenueMTD: 45000,
            categoryStats: [
                { name: "Bridal", count: 42, color: "bg-amber-600" },
                { name: "Festive", count: 35, color: "bg-amber-500" },
                { name: "Casual", count: 20, color: "bg-amber-400" },
                { name: "Luxury", count: 18, color: "bg-amber-300" },
            ]
        };
    }
};
