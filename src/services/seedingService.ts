import { db } from "@/lib/firebase";
import { collection, doc, writeBatch, setDoc } from "firebase/firestore";
import { designs, categories, menCategories } from "@/data/mockData";
import { COLLECTION_DESIGNS, COLLECTION_CATEGORIES } from "./designService";

export const seedingService = {
    seedDesigns: async () => {
        const batch = writeBatch(db);
        let count = 0;

        // Seed Designs
        designs.forEach((design) => {
            // Use design.id as doc ID to prevent duplicates on re-runs
            const docRef = doc(db, COLLECTION_DESIGNS, design.id);
            batch.set(docRef, {
                ...design,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            count++;
        });

        console.log(`Prepared ${count} designs for seeding...`);
        await batch.commit();
        console.log("Designs seeding complete!");
    },

    seedCategories: async () => {
        const batch = writeBatch(db);

        // Seed Women's Categories
        categories.forEach((cat) => {
            const docRef = doc(db, COLLECTION_CATEGORIES, cat.id);
            batch.set(docRef, {
                ...cat,
                type: "women" // add type for filtering
            });
        });

        // Seed Men's Categories
        menCategories.forEach((cat) => {
            const docRef = doc(db, COLLECTION_CATEGORIES, cat.id);
            batch.set(docRef, {
                ...cat,
                type: "men" // add type for filtering
            });
        });

        await batch.commit();
        console.log("Categories seeding complete!");
    },

    seedAdminInvite: async () => {
        try {
            await setDoc(doc(db, "invites", "ADMIN123"), {
                used: false,
                createdAt: new Date(),
                type: "admin"
            });
            console.log("Admin invite seeded: ADMIN123");
        } catch (error) {
            console.error("Error seeding admin invite:", error);
        }
    },

    seedAll: async () => {
        try {
            console.log("Starting data seeding...");
            await seedingService.seedCategories();
            await seedingService.seedDesigns();
            await seedingService.seedAdminInvite();
            console.log("All data seeded successfully!");
            return true;
        } catch (error) {
            console.error("Seeding failed:", error);
            return false;
        }
    }
};
