import { measurementService } from "../services/measurementService";
import { categoryService } from "../services/categoryService";

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
        categorySlugs: ["kurti-kurta", "salwar-kameez"],
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
        name: "Men's Shirt",
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
            { id: "5", name: "Thigh", key: "thigh", hint: "Fullest part of thigh", displayOrder: 5, isActive: true },
            { id: "6", name: "Knee", key: "knee", hint: "Around the knee", displayOrder: 6, isActive: true },
            { id: "7", name: "Calf", key: "calf", hint: "Fullest part of calf", displayOrder: 7, isActive: true },
            { id: "8", name: "Bottom Opening", key: "bottomOpening", hint: "Pant opening at ankle", displayOrder: 8, isActive: true },
            { id: "9", name: "Crotch Depth", key: "crotchDepth", hint: "Waist to seat when sitting", displayOrder: 9, isActive: true },
        ],
    },
    {
        name: "Lehenga",
        icon: "👗",
        categorySlugs: ["lehenga"],
        fields: [
            { id: "1", name: "Waist", key: "waist", hint: "Where you wear the lehenga", displayOrder: 1, isActive: true },
            { id: "2", name: "Hips", key: "hips", hint: "Fullest part", displayOrder: 2, isActive: true },
            { id: "3", name: "Lehenga Length", key: "length", hint: "Waist to floor (with heels)", displayOrder: 3, isActive: true },
            { id: "4", name: "Flare", key: "flare", hint: "Desired bottom width", displayOrder: 4, isActive: true },
        ],
    },
    {
        name: "Salwar",
        icon: "👖",
        categorySlugs: ["salwar-kameez"],
        fields: [
            { id: "1", name: "Waist", key: "waist", hint: "Where you wear the salwar", displayOrder: 1, isActive: true },
            { id: "2", name: "Hips", key: "hips", hint: "Fullest part", displayOrder: 2, isActive: true },
            { id: "3", name: "Thigh", key: "thigh", hint: "Fullest part", displayOrder: 3, isActive: true },
            { id: "4", name: "Knee", key: "knee", hint: "Around knee", displayOrder: 4, isActive: true },
            { id: "5", name: "Calf", key: "calf", hint: "Fullest part", displayOrder: 5, isActive: true },
            { id: "6", name: "Ankle", key: "ankle", hint: "Around ankle", displayOrder: 6, isActive: true },
            { id: "7", name: "Length", key: "length", hint: "Waist to ankle", displayOrder: 7, isActive: true },
        ],
    },
    {
        name: "Gown",
        icon: "👗",
        categorySlugs: ["gown-evening-wear"],
        fields: [
            { id: "1", name: "Bust", key: "bust", hint: "Around fullest part", displayOrder: 1, isActive: true },
            { id: "2", name: "Under Bust", key: "underBust", hint: "Just below bust", displayOrder: 2, isActive: true },
            { id: "3", name: "Waist", key: "waist", hint: "Natural waistline", displayOrder: 3, isActive: true },
            { id: "4", name: "Hips", key: "hips", hint: "Fullest part", displayOrder: 4, isActive: true },
            { id: "5", name: "Shoulder", key: "shoulder", hint: "Point to point", displayOrder: 5, isActive: true },
            { id: "6", name: "Sleeve Length", key: "sleeveLength", hint: "If applicable", displayOrder: 6, isActive: true },
            { id: "7", name: "Total Length", key: "totalLength", hint: "Shoulder to floor", displayOrder: 7, isActive: true },
            { id: "8", name: "Armpit to Floor", key: "armpitToFloor", hint: "For strapless/off-shoulder", displayOrder: 8, isActive: true },
        ],
    },
];

export const seedMeasurements = async () => {
    try {
        console.log("Starting measurement seeding...");
        const categories = await categoryService.getCategories();

        for (const data of measurementData) {
            const { categorySlugs, ...config } = data;

            // Find matching categories
            const matchingCategoryIds = categories
                .filter(c => categorySlugs.includes(c.slug))
                .map(c => c.id);

            const configId = await measurementService.createMeasurementConfig({
                ...config,
                categoryIds: matchingCategoryIds,
                isActive: true
            });

            console.log(`Created config for ${config.name} with ID: ${configId}`);

            // Update categories with measurementConfigId
            for (const catId of matchingCategoryIds) {
                await categoryService.updateCategory(catId, { measurementConfigId: configId });
                console.log(`Linked category ${catId} to config ${configId}`);
            }
        }

        console.log("Measurement seeding completed successfully!");
    } catch (error) {
        console.error("Error during measurement seeding:", error);
    }
};
