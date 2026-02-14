
import { db } from "@/lib/firebase";
import { collection, getDocs, writeBatch } from "firebase/firestore";

const categoryImages = [
    { slug: "formal-shirts", image: "/assets/categories/formal-shirts.jpg" },
    { slug: "blouse-designs", image: "/assets/categories/blouse-designs.jpg" },
    { slug: "lehenga", image: "/assets/categories/lehenga.jpg" },
    { slug: "trousers-pants", image: "/assets/categories/trousers-pants.jpg" },
    { slug: "kurti-kurta", image: "/assets/categories/kurti-kurta.jpg" },
    { slug: "suits", image: "/assets/categories/suits.jpg" },
    { slug: "gown-evening-wear", image: "/assets/categories/gown-evening-wear.jpg" },
    { slug: "blazers", image: "/assets/categories/blazers.jpg" },
    { slug: "salwar-kameez", image: "/assets/categories/salwar-kameez.jpg" },
    { slug: "half-saree", image: "/assets/categories/half-saree.jpg" },
    { slug: "sherwanis", image: "/assets/categories/sherwanis.jpg" },
    { slug: "mens-kurta", image: "/assets/categories/mens-kurta.jpg" },
    { slug: "saree-alterations", image: "/assets/categories/saree-alterations.jpg" },
    { slug: "shorts", image: "/assets/categories/shorts.jpg" }
];

export const seedCategoryImages = async () => {
    console.log("🚀 Starting Category Image Update (Local Assets)...");

    const batch = writeBatch(db);
    const categoriesRef = collection(db, "categories");
    let updatedCount = 0;

    try {
        const snapshot = await getDocs(categoriesRef);

        if (snapshot.empty) {
            console.log("❌ No categories found to update.");
            return;
        }

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            const slug = data.slug;

            const targetImage = categoryImages.find(c => c.slug === slug);

            if (targetImage) {
                batch.update(docSnap.ref, { image: targetImage.image });
                console.log(`✅ Prepared update for: ${data.name} -> ${targetImage.image}`);
                updatedCount++;
            } else {
                console.log(`⚠️ No new image found for slug: ${slug}`);
            }
        }

        if (updatedCount > 0) {
            await batch.commit();
            console.log(`🎉 Successfully updated ${updatedCount} category images with local paths!`);
        } else {
            console.log("No updates were necessary.");
        }

    } catch (error) {
        console.error("❌ Error updating category images:", error);
        process.exit(1);
    }
};
