import { measurementService } from "../services/measurementService";
import { categoryService } from "../services/categoryService";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";

const measurementData = [
    {
        name: "Blouse",
        icon: "👚",
        categorySlugs: ["blouse-designs"],
        fields: [
            { id: "1", name: "Bust", key: "bust", hint: "Measure around the fullest part of the bust", displayOrder: 1, isActive: true },
            { id: "2", name: "Under Bust", key: "underBust", hint: "Measure just below the bust", displayOrder: 2, isActive: true },
            { id: "3", name: "Waist", key: "waist", hint: "Natural waistline, usually above navel", displayOrder: 3, isActive: true },
            { id: "4", name: "Shoulder Width", key: "shoulderWidth", hint: "From shoulder point to point", displayOrder: 4, isActive: true },
            { id: "5", name: "Armhole", key: "armhole", hint: "Around the arm where sleeve attaches", displayOrder: 5, isActive: true },
            { id: "6", name: "Sleeve Length", key: "sleeveLength", hint: "Shoulder to desired length", displayOrder: 6, isActive: true },
            { id: "7", name: "Bicep", key: "bicep", hint: "Around the fullest part of upper arm", displayOrder: 7, isActive: true },
            { id: "8", name: "Blouse Length", key: "blouseLength", hint: "Shoulder to desired length", displayOrder: 8, isActive: true },
            { id: "9", name: "Front Neck Depth", key: "neckDepthFront", hint: "Base of neck to desired depth", displayOrder: 9, isActive: true },
            { id: "10", name: "Back Neck Depth", key: "neckDepthBack", hint: "Base of neck to desired depth", displayOrder: 10, isActive: true },
            { id: "11", name: "Neck Width", key: "neckWidth", hint: "Width of neckline", displayOrder: 11, isActive: true },
        ],
    },
    {
        name: "Kurti/Kurta",
        icon: "👗",
        categorySlugs: ["kurti-kurta"],
        fields: [
            { id: "1", name: "Bust/Chest", key: "bust", hint: "Around the fullest part", displayOrder: 1, isActive: true },
            { id: "2", name: "Waist", key: "waist", hint: "Natural waistline", displayOrder: 2, isActive: true },
            { id: "3", name: "Hips", key: "hips", hint: "Around the fullest part of hips", displayOrder: 3, isActive: true },
            { id: "4", name: "Shoulder Width", key: "shoulderWidth", hint: "From shoulder point to point", displayOrder: 4, isActive: true },
            { id: "5", name: "Armhole", key: "armhole", hint: "Around the arm opening", displayOrder: 5, isActive: true },
            { id: "6", name: "Sleeve Length", key: "sleeveLength", hint: "Shoulder to desired length", displayOrder: 6, isActive: true },
            { id: "7", name: "Bicep", key: "bicep", hint: "Fullest part of upper arm", displayOrder: 7, isActive: true },
            { id: "8", name: "Kurti Length", key: "kurtiLength", hint: "Shoulder to desired hem", displayOrder: 8, isActive: true },
            { id: "9", name: "Bottom Width", key: "bottomWidth", hint: "Width at hemline", displayOrder: 9, isActive: true },
            { id: "10", name: "Side Slit Length", key: "slitLength", hint: "Length of side slits", displayOrder: 10, isActive: true },
        ],
    },
    {
        name: "Salwar Kameez",
        icon: "👘",
        categorySlugs: ["salwar-kameez"],
        fields: [
            { id: "1", name: "Bust", key: "bust", hint: "Around fullest part", displayOrder: 1, isActive: true },
            { id: "2", name: "Waist", key: "waist", hint: "Natural waistline", displayOrder: 2, isActive: true },
            { id: "3", name: "Hips", key: "hips", hint: "Fullest part", displayOrder: 3, isActive: true },
            { id: "4", name: "Shoulder", key: "shoulder", hint: "Point to point", displayOrder: 4, isActive: true },
            { id: "5", name: "Sleeve Length", key: "sleeveLength", hint: "Shoulder to wrist", displayOrder: 5, isActive: true },
            { id: "6", name: "Salwar Length", key: "length", hint: "Waist to ankle", displayOrder: 6, isActive: true },
            { id: "7", name: "Ankle Opening", key: "ankle", hint: "Width at ankle", displayOrder: 7, isActive: true },
        ],
    },
    {
        name: "Formal Shirt",
        icon: "👔",
        categorySlugs: ["formal-shirts"],
        fields: [
            { id: "1", name: "Chest", key: "chest", hint: "Around the fullest part", displayOrder: 1, isActive: true },
            { id: "2", name: "Waist", key: "waist", hint: "Around natural waistline", displayOrder: 2, isActive: true },
            { id: "3", name: "Neck", key: "neck", hint: "Around the base of neck", displayOrder: 3, isActive: true },
            { id: "4", name: "Shoulder Width", key: "shoulderWidth", hint: "Point to point", displayOrder: 4, isActive: true },
            { id: "5", name: "Sleeve Length", key: "sleeveLength", hint: "Shoulder to wrist", displayOrder: 5, isActive: true },
            { id: "6", name: "Bicep", key: "bicep", hint: "Fullest part of upper arm", displayOrder: 6, isActive: true },
            { id: "7", name: "Wrist", key: "wrist", hint: "Around the wrist", displayOrder: 7, isActive: true },
            { id: "8", name: "Shirt Length", key: "shirtLength", hint: "Shoulder to desired hem", displayOrder: 8, isActive: true },
            { id: "9", name: "Armhole", key: "armhole", hint: "Around arm opening", displayOrder: 9, isActive: true },
            { id: "10", name: "Stomach Round", key: "stomach", hint: "Around the fullest part of stomach", displayOrder: 10, isActive: true },
        ],
    },
    {
        name: "Men's Pants",
        icon: "👖",
        categorySlugs: ["trousers-pants"],
        fields: [
            { id: "1", name: "Waist", key: "waist", hint: "Where you wear your pants", displayOrder: 1, isActive: true },
            { id: "2", name: "Hips/Seat", key: "hips", hint: "Fullest part around seat", displayOrder: 2, isActive: true },
            { id: "3", name: "Inseam", key: "inseam", hint: "Crotch to ankle", displayOrder: 3, isActive: true },
            { id: "4", name: "Outseam", key: "outseam", hint: "Waist to ankle (side)", displayOrder: 4, isActive: true },
            { id: "5", name: "Thigh Round", key: "thigh", hint: "Fullest part of thigh", displayOrder: 5, isActive: true },
            { id: "6", name: "Knee Round", key: "knee", hint: "Around the knee", displayOrder: 6, isActive: true },
            { id: "7", name: "Calf Round", key: "calf", hint: "Around the calf", displayOrder: 7, isActive: true },
            { id: "8", name: "Bottom Opening", key: "bottomOpening", hint: "Pant opening at ankle", displayOrder: 8, isActive: true },
            { id: "9", name: "Crotch Depth", key: "crotchDepth", hint: "Waist to seat when sitting", displayOrder: 9, isActive: true },
        ],
    },
    {
        name: "Shorts",
        icon: "🩳",
        categorySlugs: ["shorts"],
        fields: [
            { id: "1", name: "Waist", key: "waist", hint: "Where you wear the shorts", displayOrder: 1, isActive: true },
            { id: "2", name: "Hips", key: "hips", hint: "Fullest part", displayOrder: 2, isActive: true },
            { id: "3", name: "Inseam", key: "inseam", hint: "Crotch to desired length", displayOrder: 3, isActive: true },
            { id: "4", name: "Outseam", key: "outseam", hint: "Waist to hem (side)", displayOrder: 4, isActive: true },
            { id: "5", name: "Thigh Round", key: "thigh", hint: "Fullest part of thigh", displayOrder: 5, isActive: true },
            { id: "6", name: "Bottom Opening", key: "bottomOpening", hint: "Width at the bottom", displayOrder: 6, isActive: true },
            { id: "7", name: "Rise", key: "rise", hint: "Crotch to waist", displayOrder: 7, isActive: true },
            { id: "8", name: "Seat", key: "seat", hint: "Around the fullest part of seat", displayOrder: 8, isActive: true },
        ],
    },
    {
        name: "Lehenga",
        icon: "✨",
        categorySlugs: ["lehenga"],
        fields: [
            { id: "1", name: "Waist", key: "waist", hint: "Where you wear the lehenga", displayOrder: 1, isActive: true },
            { id: "2", name: "Hips", key: "hips", hint: "Fullest part", displayOrder: 2, isActive: true },
            { id: "3", name: "Length", key: "length", hint: "Waist to floor (with heels)", displayOrder: 3, isActive: true },
            { id: "4", name: "Flare", key: "flare", hint: "Desired flare width", displayOrder: 4, isActive: true },
        ],
    },
    {
        name: "Half Saree",
        icon: "🥻",
        categorySlugs: ["half-saree"],
        fields: [
            { id: "1", name: "Blouse Bust", key: "blouseBust", hint: "Around fullest part", displayOrder: 1, isActive: true },
            { id: "2", name: "Blouse Waist", key: "blouseWaist", hint: "Natural waistline", displayOrder: 2, isActive: true },
            { id: "3", name: "Blouse Length", key: "blouseLength", hint: "Shoulder to desired length", displayOrder: 3, isActive: true },
            { id: "4", name: "Skirt Waist", key: "skirtWaist", hint: "Where you wear the skirt", displayOrder: 4, isActive: true },
            { id: "5", name: "Skirt Hips", key: "skirtHips", hint: "Fullest part", displayOrder: 5, isActive: true },
            { id: "6", name: "Skirt Length", key: "skirtLength", hint: "Waist to floor", displayOrder: 6, isActive: true },
            { id: "7", name: "Draping Side", key: "draping", hint: "Left or Right shoulder", displayOrder: 7, isActive: true },
        ],
    },
    {
        name: "Gown",
        icon: "💃",
        categorySlugs: ["gown-evening-wear"],
        fields: [
            { id: "1", name: "Bust", key: "bust", hint: "Around fullest part", displayOrder: 1, isActive: true },
            { id: "2", name: "Under Bust", key: "underBust", hint: "Just below bust", displayOrder: 2, isActive: true },
            { id: "3", name: "Waist", key: "waist", hint: "Natural waistline", displayOrder: 3, isActive: true },
            { id: "4", name: "Hips", key: "hips", hint: "Fullest part", displayOrder: 4, isActive: true },
            { id: "5", name: "Shoulder", key: "shoulder", hint: "Point to point", displayOrder: 5, isActive: true },
            { id: "6", name: "Sleeve Length", key: "sleeveLength", hint: "If applicable", displayOrder: 6, isActive: true },
            { id: "7", name: "Total Length", key: "totalLength", hint: "Shoulder to floor", displayOrder: 7, isActive: true },
            { id: "8", name: "Neck Depth", key: "neckDepth", hint: "Front neck depth", displayOrder: 8, isActive: true },
        ],
    },
    {
        name: "Suit",
        icon: "🤵",
        categorySlugs: ["suits"],
        fields: [
            { id: "1", name: "Chest", key: "chest", hint: "Around fullest part", displayOrder: 1, isActive: true },
            { id: "2", name: "Stomach", key: "stomach", hint: "Around fullest part of stomach", displayOrder: 2, isActive: true },
            { id: "3", name: "Shoulder", key: "shoulder", hint: "Point to point", displayOrder: 3, isActive: true },
            { id: "4", name: "Sleeve Length", key: "sleeveLength", hint: "Shoulder to wrist", displayOrder: 4, isActive: true },
            { id: "5", name: "Jacket Length", key: "jacketLength", hint: "Shoulder to desired length", displayOrder: 5, isActive: true },
            { id: "6", name: "Trouser Waist", key: "trouserWaist", hint: "Where you wear your pants", displayOrder: 6, isActive: true },
            { id: "7", name: "Trouser Hips", key: "trouserHips", hint: "Fullest part of seat", displayOrder: 7, isActive: true },
            { id: "8", name: "Trouser Length", key: "trouserLength", hint: "Waist to ankle", displayOrder: 8, isActive: true },
            { id: "9", name: "Neck", key: "neck", hint: "Base of neck", displayOrder: 9, isActive: true },
        ],
    },
    {
        name: "Blazer",
        icon: "🧥",
        categorySlugs: ["blazers"],
        fields: [
            { id: "1", name: "Chest", key: "chest", hint: "Around fullest part", displayOrder: 1, isActive: true },
            { id: "2", name: "Stomach", key: "stomach", hint: "Around fullest part of stomach", displayOrder: 2, isActive: true },
            { id: "3", name: "Shoulder", key: "shoulder", hint: "Point to point", displayOrder: 3, isActive: true },
            { id: "4", name: "Sleeve Length", key: "sleeveLength", hint: "Shoulder to wrist", displayOrder: 4, isActive: true },
            { id: "5", name: "Blazer Length", key: "blazerLength", hint: "Shoulder to desired length", displayOrder: 5, isActive: true },
            { id: "6", name: "Bicep", key: "bicep", hint: "Fullest part of upper arm", displayOrder: 6, isActive: true },
            { id: "7", name: "Wrist", key: "wrist", hint: "Around the wrist", displayOrder: 7, isActive: true },
            { id: "8", name: "Neck", key: "neck", hint: "Base of neck", displayOrder: 8, isActive: true },
            { id: "9", name: "Armhole", key: "armhole", hint: "Around arm opening", displayOrder: 9, isActive: true },
        ],
    },
    {
        name: "Men's Kurta",
        icon: "👕",
        categorySlugs: ["mens-kurta"],
        fields: [
            { id: "1", name: "Neck Round", key: "neck", hint: "Around the base of neck", displayOrder: 1, isActive: true },
            { id: "2", name: "Chest", key: "chest", hint: "Around fuller part", displayOrder: 2, isActive: true },
            { id: "3", name: "Waist", key: "waist", hint: "Around stomach/waist", displayOrder: 3, isActive: true },
            { id: "4", name: "Shoulder", key: "shoulder", hint: "Point to point", displayOrder: 4, isActive: true },
            { id: "5", name: "Sleeve Length", key: "sleeveLength", hint: "Shoulder to wrist", displayOrder: 5, isActive: true },
            { id: "6", name: "Kurta Length", key: "length", hint: "Shoulder to below knee", displayOrder: 6, isActive: true },
            { id: "7", name: "Side Slit Length", key: "slit", hint: "Length of side opens", displayOrder: 7, isActive: true },
            { id: "8", name: "Bicep", key: "bicep", hint: "Upper arm round", displayOrder: 8, isActive: true },
            { id: "9", name: "Wrist Round", key: "wrist", hint: "Around the wrist", displayOrder: 9, isActive: true },
        ],
    },
    {
        name: "Sherwani",
        icon: "⭐",
        categorySlugs: ["sherwanis"],
        fields: [
            { id: "1", name: "Neck", key: "neck", hint: "Mandarin collar size", displayOrder: 1, isActive: true },
            { id: "2", name: "Chest", key: "chest", hint: "Fullest part", displayOrder: 2, isActive: true },
            { id: "3", name: "Waist", key: "waist", hint: "Stomach round", displayOrder: 3, isActive: true },
            { id: "4", name: "Hips", key: "hips", hint: "Around seat", displayOrder: 4, isActive: true },
            { id: "5", name: "Shoulder", key: "shoulder", hint: "Point to point", displayOrder: 5, isActive: true },
            { id: "6", name: "Sleeve Length", key: "sleeveLength", hint: "Shoulder to wrist", displayOrder: 6, isActive: true },
            { id: "7", name: "Sherwani Length", key: "length", hint: "Shoulder to knee", displayOrder: 7, isActive: true },
            { id: "8", name: "Bicep", key: "bicep", hint: "Upper arm", displayOrder: 8, isActive: true },
            { id: "9", name: "Armhole", key: "armhole", hint: "Around arm opening", displayOrder: 9, isActive: true },
            { id: "10", name: "Wrist", key: "wrist", hint: "Around wrist", displayOrder: 10, isActive: true },
        ],
    },
    {
        name: "Saree Alterations",
        icon: "🧵",
        categorySlugs: ["saree-alterations"],
        fields: [
            { id: "1", name: "Saree Fall", key: "sareeFall", hint: "Yes/No (Additional charges apply)", displayOrder: 1, isActive: true },
            { id: "2", name: "Pico/Zig-zag", key: "pico", hint: "Yes/No (Additional charges apply)", displayOrder: 2, isActive: true },
            { id: "3", name: "Length Adjustment", key: "lengthAdjustment", hint: "In inches (e.g., -2 or +1)", displayOrder: 3, isActive: true },
            { id: "4", name: "Tassels/Kuchu", key: "tassels", hint: "Yes/No", displayOrder: 4, isActive: true },
            { id: "5", name: "Blouse Bust", key: "blouseBust", hint: "If blouse alteration needed", displayOrder: 5, isActive: true },
            { id: "6", name: "Blouse Waist", key: "blouseWaist", hint: "If blouse alteration needed", displayOrder: 6, isActive: true },
        ],
    },
];

export const seedMeasurements = async () => {
    try {
        console.log("🧹 Starting absolute measurement cleanup...");

        // 1. Delete all existing measurement configurations in batches
        const configsRef = collection(db, "measurement_configs");
        const configsSnapshot = await getDocs(configsRef);
        console.log(`Found ${configsSnapshot.size} total configs to purge.`);

        const purgeBatch = writeBatch(db);
        configsSnapshot.docs.forEach((d) => purgeBatch.delete(d.ref));
        await purgeBatch.commit();
        console.log("✅ All old measurement configs purged from database.");

        // 2. Clear AND verify category unlinking
        const categoriesRef = collection(db, "categories");
        const categoriesSnapshot = await getDocs(categoriesRef);
        console.log(`Total categories found: ${categoriesSnapshot.size}. Resetting links...`);

        const resetBatch = writeBatch(db);
        categoriesSnapshot.docs.forEach((d) => {
            resetBatch.update(d.ref, { measurementConfigId: null });
        });
        await resetBatch.commit();
        console.log("✅ All categories links reset in database.");

        // 3. Perform fresh seeding
        console.log("🚀 Initializing 1:1 unique measurement seeding...");
        const categories = await categoryService.getCategories();

        for (const data of measurementData) {
            const { categorySlugs, ...config } = data;

            // Strict matching to ensure no accidental duplication
            const matchingCategories = categories.filter(c =>
                categorySlugs.includes(c.slug) ||
                categorySlugs.includes(c.id) ||
                categorySlugs.includes(c.name)
            );

            if (matchingCategories.length === 0) {
                console.warn(`⚠️ Warning: No matching category found for ${config.name} using slugs: ${categorySlugs.join(", ")}`);
                continue;
            }

            const matchingCategoryIds = matchingCategories.map(c => c.id);

            const configId = await measurementService.createMeasurementConfig({
                ...config,
                categoryIds: matchingCategoryIds,
                isActive: true
            });

            console.log(`✨ Created UNIQUE config [${config.icon} ${config.name}] with ID: ${configId}`);

            // Direct update to ensure persistence
            const updateBatch = writeBatch(db);
            for (const catId of matchingCategoryIds) {
                const catRef = doc(db, "categories", catId);
                updateBatch.update(catRef, { measurementConfigId: configId });
                console.log(`   - Linked category [${catId}] to this config.`);
            }
            await updateBatch.commit();
        }

        console.log("\n🎊 Measurement system successfully deduplicated and reseeded!");
    } catch (error) {
        console.error("❌ CRITICAL ERROR during measurement seeding:", error);
        throw error;
    }
};
