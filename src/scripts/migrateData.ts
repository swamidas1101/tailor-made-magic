import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { categoryService } from "@/services/categoryService";
import { filterService } from "@/services/filterService";
import { Category, FilterGroup, FilterOption } from "@/types/database";

/**
 * Migration script to seed Firestore with categories and filters
 * Run this once to populate the database with initial data
 */

// ==================== CATEGORIES DATA ====================

const womenCategories: Omit<Category, "id" | "createdAt" | "updatedAt">[] = [
    {
        name: "Blouse Designs",
        slug: "blouse-designs",
        type: "women",
        description: "Designer blouses with perfect fit and intricate work.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
        displayOrder: 0,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Lehenga",
        slug: "lehenga",
        type: "women",
        description: "Bespoke lehenga sets for weddings and festivals.",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
        displayOrder: 1,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Kurti & Kurta",
        slug: "kurti-kurta",
        type: "women",
        description: "Custom tailored kurtis for daily and ethnic wear.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=800&fit=crop",
        displayOrder: 2,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Gown & Evening Wear",
        slug: "gown-evening-wear",
        type: "women",
        description: "Elegant gowns and long dresses.",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
        displayOrder: 3,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Salwar Kameez",
        slug: "salwar-kameez",
        type: "women",
        description: "Traditional suits including Patiala and Chudidar.",
        image: "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=600&h=800&fit=crop",
        displayOrder: 4,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Half Saree",
        slug: "half-saree",
        type: "women",
        description: "Traditional half saree sets with modern designs.",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
        displayOrder: 5,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Saree Alterations",
        slug: "saree-alterations",
        type: "women",
        description: "Expert saree fall, pico, and blouse alterations.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
        displayOrder: 6,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Western Wear",
        slug: "western-wear",
        type: "women",
        description: "Shirts, skirts, and western outfits.",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
        displayOrder: 7,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
];

const menCategories: Omit<Category, "id" | "createdAt" | "updatedAt">[] = [
    {
        name: "Formal Shirts",
        slug: "formal-shirts",
        type: "men",
        description: "Perfectly fitted formal and casual shirts.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
        displayOrder: 0,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Trousers & Pants",
        slug: "trousers-pants",
        type: "men",
        description: "Custom trousers with precise measurements.",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
        displayOrder: 1,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Suits",
        slug: "suits",
        type: "men",
        description: "Handcrafted 2-piece and 3-piece suits.",
        image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=800&fit=crop",
        displayOrder: 2,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Tuxedos",
        slug: "tuxedos",
        type: "men",
        description: "Premium formal tuxedos for special events.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
        displayOrder: 3,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Blazers",
        slug: "blazers",
        type: "men",
        description: "Smart blazers and sport coats.",
        image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=800&fit=crop",
        displayOrder: 4,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Sherwanis",
        slug: "sherwanis",
        type: "men",
        description: "Traditional festive and wedding sherwanis.",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
        displayOrder: 5,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Men's Kurta",
        slug: "mens-kurta",
        type: "men",
        description: "Ethnic kurta pajama sets for festivals.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
        displayOrder: 6,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    },
    {
        name: "Shorts",
        slug: "shorts",
        type: "men",
        description: "Custom casual shorts.",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
        displayOrder: 7,
        isActive: true,
        designCount: 0,
        createdBy: "system"
    }
];

// ==================== FILTER GROUPS DATA ====================

const filterGroups: Omit<FilterGroup, "id" | "createdAt" | "updatedAt">[] = [
    // Women's Filter Groups
    {
        name: "Neck Types",
        description: "Different neckline styles",
        applicableGender: "women",
        applicableCategories: [], // Applies to all women's categories
        displayOrder: 0,
        isActive: true,
        createdBy: "system"
    },
    {
        name: "Sleeve Types",
        description: "Different sleeve styles",
        applicableGender: "women",
        applicableCategories: [],
        displayOrder: 1,
        isActive: true,
        createdBy: "system"
    },
    {
        name: "Back Designs",
        description: "Back design variations",
        applicableGender: "women",
        applicableCategories: [],
        displayOrder: 2,
        isActive: true,
        createdBy: "system"
    },
    {
        name: "Work Types",
        description: "Embroidery and embellishment types",
        applicableGender: "both",
        applicableCategories: [],
        displayOrder: 3,
        isActive: true,
        createdBy: "system"
    },
    {
        name: "Occasions",
        description: "Suitable occasions",
        applicableGender: "both",
        applicableCategories: [],
        displayOrder: 4,
        isActive: true,
        createdBy: "system"
    },
    {
        name: "Skirt Types",
        description: "Different skirt styles",
        applicableGender: "women",
        applicableCategories: [],
        displayOrder: 5,
        isActive: true,
        createdBy: "system"
    },
    {
        name: "Dupatta Styles",
        description: "Dupatta design variations",
        applicableGender: "women",
        applicableCategories: [],
        displayOrder: 6,
        isActive: true,
        createdBy: "system"
    },
    // Men's Filter Groups
    {
        name: "Collar Types",
        description: "Different collar styles",
        applicableGender: "men",
        applicableCategories: [],
        displayOrder: 7,
        isActive: true,
        createdBy: "system"
    },
    {
        name: "Fit Types",
        description: "Garment fit variations",
        applicableGender: "men",
        applicableCategories: [],
        displayOrder: 8,
        isActive: true,
        createdBy: "system"
    },
    {
        name: "Cuff Types",
        description: "Different cuff styles",
        applicableGender: "men",
        applicableCategories: [],
        displayOrder: 9,
        isActive: true,
        createdBy: "system"
    },
    {
        name: "Pocket Styles",
        description: "Pocket design variations",
        applicableGender: "men",
        applicableCategories: [],
        displayOrder: 10,
        isActive: true,
        createdBy: "system"
    },
    {
        name: "Fabric Types",
        description: "Fabric material options",
        applicableGender: "both",
        applicableCategories: [],
        displayOrder: 11,
        isActive: true,
        createdBy: "system"
    }
];

// ==================== FILTER OPTIONS DATA ====================

interface FilterOptionData {
    groupName: string;
    options: { name: string; value: string }[];
}

const filterOptionsData: FilterOptionData[] = [
    {
        groupName: "Neck Types",
        options: [
            { name: "Round Neck", value: "round-neck" },
            { name: "V-Neck", value: "v-neck" },
            { name: "Boat Neck", value: "boat-neck" },
            { name: "Square Neck", value: "square-neck" },
            { name: "Sweetheart", value: "sweetheart" },
            { name: "Halter", value: "halter" },
            { name: "Off-Shoulder", value: "off-shoulder" },
            { name: "High Neck", value: "high-neck" },
            { name: "Collar Neck", value: "collar-neck" }
        ]
    },
    {
        groupName: "Sleeve Types",
        options: [
            { name: "Sleeveless", value: "sleeveless" },
            { name: "Short Sleeve", value: "short-sleeve" },
            { name: "3/4 Sleeve", value: "three-quarter-sleeve" },
            { name: "Full Sleeve", value: "full-sleeve" },
            { name: "Bell Sleeve", value: "bell-sleeve" },
            { name: "Puff Sleeve", value: "puff-sleeve" },
            { name: "Cap Sleeve", value: "cap-sleeve" },
            { name: "Butterfly Sleeve", value: "butterfly-sleeve" }
        ]
    },
    {
        groupName: "Back Designs",
        options: [
            { name: "Open Back", value: "open-back" },
            { name: "Closed Back", value: "closed-back" },
            { name: "Keyhole", value: "keyhole" },
            { name: "Tie-Up", value: "tie-up" },
            { name: "Zip", value: "zip" },
            { name: "Hook & Eye", value: "hook-eye" },
            { name: "Button", value: "button" },
            { name: "Lace-Up", value: "lace-up" }
        ]
    },
    {
        groupName: "Work Types",
        options: [
            { name: "Plain", value: "plain" },
            { name: "Embroidery", value: "embroidery" },
            { name: "Zari Work", value: "zari-work" },
            { name: "Stone Work", value: "stone-work" },
            { name: "Mirror Work", value: "mirror-work" },
            { name: "Sequin Work", value: "sequin-work" },
            { name: "Print", value: "print" },
            { name: "Patch Work", value: "patch-work" },
            { name: "Beadwork", value: "beadwork" }
        ]
    },
    {
        groupName: "Occasions",
        options: [
            { name: "Daily Wear", value: "daily-wear" },
            { name: "Party Wear", value: "party-wear" },
            { name: "Wedding", value: "wedding" },
            { name: "Festival", value: "festival" },
            { name: "Office Wear", value: "office-wear" },
            { name: "Casual", value: "casual" },
            { name: "Formal", value: "formal" },
            { name: "Bridal", value: "bridal" }
        ]
    },
    {
        groupName: "Skirt Types",
        options: [
            { name: "A-Line", value: "a-line" },
            { name: "Flared", value: "flared" },
            { name: "Straight", value: "straight" },
            { name: "Mermaid", value: "mermaid" },
            { name: "Circular", value: "circular" },
            { name: "Pleated", value: "pleated" },
            { name: "Layered", value: "layered" }
        ]
    },
    {
        groupName: "Dupatta Styles",
        options: [
            { name: "Plain", value: "plain" },
            { name: "Embroidered", value: "embroidered" },
            { name: "Printed", value: "printed" },
            { name: "Net", value: "net" },
            { name: "Silk", value: "silk" },
            { name: "Georgette", value: "georgette" },
            { name: "Chiffon", value: "chiffon" }
        ]
    },
    {
        groupName: "Collar Types",
        options: [
            { name: "Regular Collar", value: "regular-collar" },
            { name: "Spread Collar", value: "spread-collar" },
            { name: "Button-Down", value: "button-down" },
            { name: "Mandarin Collar", value: "mandarin-collar" },
            { name: "Band Collar", value: "band-collar" },
            { name: "Wing Collar", value: "wing-collar" },
            { name: "Cuban Collar", value: "cuban-collar" }
        ]
    },
    {
        groupName: "Fit Types",
        options: [
            { name: "Slim Fit", value: "slim-fit" },
            { name: "Regular Fit", value: "regular-fit" },
            { name: "Relaxed Fit", value: "relaxed-fit" },
            { name: "Tailored Fit", value: "tailored-fit" },
            { name: "Loose Fit", value: "loose-fit" }
        ]
    },
    {
        groupName: "Cuff Types",
        options: [
            { name: "Single Cuff", value: "single-cuff" },
            { name: "French Cuff", value: "french-cuff" },
            { name: "Convertible Cuff", value: "convertible-cuff" },
            { name: "Barrel Cuff", value: "barrel-cuff" }
        ]
    },
    {
        groupName: "Pocket Styles",
        options: [
            { name: "Patch Pocket", value: "patch-pocket" },
            { name: "Flap Pocket", value: "flap-pocket" },
            { name: "Welt Pocket", value: "welt-pocket" },
            { name: "No Pocket", value: "no-pocket" },
            { name: "Chest Pocket", value: "chest-pocket" }
        ]
    },
    {
        groupName: "Fabric Types",
        options: [
            { name: "Cotton", value: "cotton" },
            { name: "Linen", value: "linen" },
            { name: "Silk", value: "silk" },
            { name: "Wool", value: "wool" },
            { name: "Polyester", value: "polyester" },
            { name: "Georgette", value: "georgette" },
            { name: "Chiffon", value: "chiffon" },
            { name: "Net", value: "net" },
            { name: "Velvet", value: "velvet" }
        ]
    }
];

// ==================== MIGRATION FUNCTIONS ====================

// Helper to check if exists
async function exists(collectionName: string, field: string, value: string, extraField?: string, extraValue?: string): Promise<string | null> {
    const colRef = collection(db, collectionName);
    let q = query(colRef, where(field, "==", value));
    if (extraField && extraValue) {
        q = query(q, where(extraField, "==", extraValue));
    }
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].id;
}

export async function migrateCategories() {
    console.log("Starting category migration...");

    try {
        // Migrate women's categories
        for (const category of womenCategories) {
            const existingId = await exists("categories", "slug", category.slug);
            if (existingId) {
                console.log(`- Skipped existing category: ${category.name}`);
                continue;
            }
            const id = await categoryService.createCategory(category);
            console.log(`✓ Created women's category: ${category.name} (${id})`);
        }

        // Migrate men's categories
        for (const category of menCategories) {
            const existingId = await exists("categories", "slug", category.slug);
            if (existingId) {
                console.log(`- Skipped existing category: ${category.name}`);
                continue;
            }
            const id = await categoryService.createCategory(category);
            console.log(`✓ Created men's category: ${category.name} (${id})`);
        }

        console.log("✅ Category migration completed!");
    } catch (error) {
        console.error("❌ Category migration failed:", error);
        throw error;
    }
}

export async function migrateFilters() {
    console.log("Starting filter migration...");

    try {
        const groupIdMap: Record<string, string> = {};

        // 1. Create/Get Groups
        for (const group of filterGroups) {
            let id = await exists("filterGroups", "name", group.name);
            if (!id) {
                id = await filterService.createFilterGroup(group);
                console.log(`✓ Created filter group: ${group.name} (${id})`);
            } else {
                console.log(`- Using existing filter group: ${group.name}`);
            }
            groupIdMap[group.name] = id;
        }

        // 2. Create Options
        for (const { groupName, options } of filterOptionsData) {
            const groupId = groupIdMap[groupName];
            if (!groupId) {
                console.warn(`⚠️  Group not found for options: ${groupName}`);
                continue;
            }

            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                // Check if option exists for this group
                const existingOptionId = await exists("filterOptions", "value", option.value, "filterGroupId", groupId);

                if (existingOptionId) {
                    console.log(`  - Skipped existing option: ${option.name}`);
                    continue;
                }

                await filterService.createFilterOption({
                    filterGroupId: groupId,
                    name: option.name,
                    value: option.value,
                    displayOrder: i,
                    isActive: true,
                    createdBy: "system"
                });
                console.log(`  ✓ Created option: ${option.name}`);
            }
        }

        console.log("✅ Filter migration completed!");
    } catch (error) {
        console.error("❌ Filter migration failed:", error);
        throw error;
    }
}

export async function runFullMigration() {
    console.log("🚀 Starting safe database migration (skipping duplicates)...\n");

    try {
        await migrateCategories();
        console.log("");
        await migrateFilters();
        console.log("\n✅ Database check/update completed!");
    } catch (error) {
        console.error("\n❌ Migration failed:", error);
        throw error;
    }
}
