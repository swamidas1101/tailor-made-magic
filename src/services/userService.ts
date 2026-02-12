import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    query,
    where
} from "firebase/firestore";

export interface Address {
    id: string;
    label: string; // Home, Work, etc.
    fullName: string;
    phone: string;
    street: string;
    landmark?: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: "customer" | "tailor" | "admin";
    phoneNumber?: string;
    addresses?: Address[];
    createdAt: string;
}

const COLLECTION_USERS = "users";

export const userService = {
    getUserProfile: async (uid: string): Promise<UserProfile | null> => {
        const docRef = doc(db, COLLECTION_USERS, uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    },

    getSavedAddresses: async (uid: string): Promise<Address[]> => {
        const profile = await userService.getUserProfile(uid);
        return profile?.addresses || [];
    },

    addAddress: async (uid: string, address: Omit<Address, "id">) => {
        const docRef = doc(db, COLLECTION_USERS, uid);
        const id = Math.random().toString(36).substring(2, 9);
        const newAddress = { ...address, id };

        // If this is the first address or set as default, handle default logic
        const currentAddresses = await userService.getSavedAddresses(uid);
        if (currentAddresses.length === 0 || address.isDefault) {
            // Reset existing defaults if new one is default
            const updatedAddresses = currentAddresses.map(a => ({ ...a, isDefault: false }));
            await updateDoc(docRef, {
                addresses: [...updatedAddresses, { ...newAddress, isDefault: true }]
            });
        } else {
            await updateDoc(docRef, {
                addresses: arrayUnion(newAddress)
            });
        }
        return id;
    },

    updateAddress: async (uid: string, addressId: string, updates: Partial<Address>) => {
        const docRef = doc(db, COLLECTION_USERS, uid);
        const addresses = await userService.getSavedAddresses(uid);

        const updatedAddresses = addresses.map(addr => {
            if (addr.id === addressId) {
                return { ...addr, ...updates };
            }
            // If we are setting a new default, unset others
            if (updates.isDefault && addr.id !== addressId) {
                return { ...addr, isDefault: false };
            }
            return addr;
        });

        await updateDoc(docRef, { addresses: updatedAddresses });
    },

    deleteAddress: async (uid: string, addressId: string) => {
        const docRef = doc(db, COLLECTION_USERS, uid);
        const addresses = await userService.getSavedAddresses(uid);
        const updatedAddresses = addresses.filter(addr => addr.id !== addressId);

        // If we deleted the default address, make another one default if available
        if (addresses.find(a => a.id === addressId)?.isDefault && updatedAddresses.length > 0) {
            updatedAddresses[0].isDefault = true;
        }

        await updateDoc(docRef, { addresses: updatedAddresses });
    }
};
