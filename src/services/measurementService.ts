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
    orderBy
} from "firebase/firestore";
import { MeasurementConfig } from "@/types/database";

const COLLECTION_NAME = "measurement_configs";

export const measurementService = {
    /**
     * Get all measurement configurations
     */
    async getMeasurementConfigs(): Promise<MeasurementConfig[]> {
        try {
            const configsRef = collection(db, COLLECTION_NAME);
            const q = query(configsRef);
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as MeasurementConfig));
        } catch (error) {
            console.error("Error fetching measurement configs:", error);
            throw error;
        }
    },

    /**
     * Get only active measurement configurations
     */
    async getActiveMeasurementConfigs(): Promise<MeasurementConfig[]> {
        try {
            const configsRef = collection(db, COLLECTION_NAME);
            const q = query(configsRef, where("isActive", "==", true));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as MeasurementConfig));
        } catch (error) {
            console.error("Error fetching active measurement configs:", error);
            throw error;
        }
    },

    /**
     * Get a single measurement configuration by ID
     */
    async getMeasurementConfigById(id: string): Promise<MeasurementConfig | null> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                } as MeasurementConfig;
            }
            return null;
        } catch (error) {
            console.error("Error fetching measurement config:", error);
            throw error;
        }
    },

    /**
     * Create a new measurement configuration
     */
    async createMeasurementConfig(data: Omit<MeasurementConfig, "id" | "createdAt" | "updatedAt">): Promise<string> {
        try {
            const now = new Date().toISOString();
            const configData = {
                ...data,
                createdAt: now,
                updatedAt: now,
            };

            const docRef = await addDoc(collection(db, COLLECTION_NAME), configData);
            return docRef.id;
        } catch (error) {
            console.error("Error creating measurement config:", error);
            throw error;
        }
    },

    /**
     * Update an existing measurement configuration
     */
    async updateMeasurementConfig(id: string, data: Partial<MeasurementConfig>): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const updateData = {
                ...data,
                updatedAt: new Date().toISOString(),
            };

            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error("Error updating measurement config:", error);
            throw error;
        }
    },

    /**
     * Delete a measurement configuration
     */
    async deleteMeasurementConfig(id: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting measurement config:", error);
            throw error;
        }
    }
};
