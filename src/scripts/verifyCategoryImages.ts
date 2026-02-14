
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const verifyCategoryImages = async () => {
    console.log("🔍 Verifying Category Images...");

    const categoriesRef = collection(db, "categories");

    try {
        const snapshot = await getDocs(categoriesRef);

        if (snapshot.empty) {
            console.log("❌ No categories found.");
            return;
        }

        console.log(`Found ${snapshot.size} categories. Listing images:`);
        console.log("---------------------------------------------------");

        snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            console.log(`Resource: ${data.name} (${data.slug})`);
            console.log(`   Image: ${data.image}`);
            console.log("---------------------------------------------------");
        });

    } catch (error) {
        console.error("❌ Error verifying category images:", error);
        process.exit(1);
    }
};

verifyCategoryImages().then(() => process.exit(0));
