
import { seedCategoryImages } from "./src/scripts/seedCategoryImages";

console.log("🚀 Running Category Image Seeder...");
seedCategoryImages()
    .then(() => {
        console.log("✅ Seeding complete.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    });
