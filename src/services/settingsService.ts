import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface AppSettings {
    deliveryCharge: number;
    freeDeliveryMinimum: number;
    enableRazorpayLive: boolean;
    razorpayKey: string;
    supportEmail: string;
    supportWhatsApp: string;
    orderGracePeriod: number;
    taxPercentage: number;
}

const DEFAULT_SETTINGS: AppSettings = {
    deliveryCharge: 99,
    freeDeliveryMinimum: 1999,
    enableRazorpayLive: false,
    razorpayKey: "rzp_test_SFfMebCIIiKLI4",
    supportEmail: "support@tailor-made-magic.com",
    supportWhatsApp: "+91 9876543210",
    orderGracePeriod: 24,
    taxPercentage: 18
};

export const settingsService = {
    getSettings: async (): Promise<AppSettings> => {
        try {
            const docRef = doc(db, "app_settings", "general");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { ...DEFAULT_SETTINGS, ...docSnap.data() } as AppSettings;
            }
            return DEFAULT_SETTINGS;
        } catch (error) {
            console.error("Failed to load settings:", error);
            return DEFAULT_SETTINGS;
        }
    },

    updateSettings: async (settings: Partial<AppSettings>) => {
        const docRef = doc(db, "app_settings", "general");
        await setDoc(docRef, settings, { merge: true });
    }
};
