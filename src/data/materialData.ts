export interface Material {
    id: string;
    name: string;
    type: string; // e.g. Silk, Cotton
    pattern: string; // e.g. Solid, Striped
    color: string; // dominant color for filtering
    colors: string[]; // available css color classes for display
    price: number;
    image: string;
    description: string;
    brand: string;
    gender: "Men" | "Women" | "Unisex";
    rating: number;
    inStock: boolean;
}

export const brands = ["Raymond", "Linen Club", "FabIndia", "Siyaram's", "Arvind", "Reid & Taylor", "Vimal", "OCM"];

export const mockMaterials: Material[] = [
    // SILK
    {
        id: "m1",
        name: "Royal Italian Silk",
        type: "Silk",
        pattern: "Solid",
        color: "Red",
        colors: ["bg-red-600", "bg-red-800"],
        price: 2500,
        image: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?q=80&w=2000&auto=format&fit=crop", // Red Silk Texture
        description: "Premium grade Italian silk, perfect for weddings.",
        brand: "Raymond",
        gender: "Women",
        rating: 4.8,
        inStock: true
    },
    {
        id: "m2",
        name: "Banarasi Brocade",
        type: "Silk",
        pattern: "Floral",
        color: "Gold",
        colors: ["bg-yellow-500", "bg-orange-500"],
        price: 3200,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2000&auto=format&fit=crop", // Gold Fabric
        description: "Traditional Banarasi weave with gold zari work.",
        brand: "FabIndia",
        gender: "Women",
        rating: 4.9,
        inStock: true
    },

    // COTTON
    {
        id: "m3",
        name: "Egyptian Giza Cotton",
        type: "Cotton",
        pattern: "Solid",
        color: "White",
        colors: ["bg-white", "bg-blue-50"],
        price: 1200,
        image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=2000&auto=format&fit=crop", // White Fabric Texture
        description: "Breathable and crisp, ideal for formal shirts.",
        brand: "Arvind",
        gender: "Men",
        rating: 4.6,
        inStock: true
    },
    {
        id: "m4",
        name: "Printed Organdy",
        type: "Cotton",
        pattern: "Printed",
        color: "Blue",
        colors: ["bg-blue-400", "bg-cyan-300"],
        price: 850,
        image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2000&auto=format&fit=crop", // Printed Fabric
        description: "Lightweight cotton with vibrant summer prints.",
        brand: "FabIndia",
        gender: "Women",
        rating: 4.3,
        inStock: true
    },

    // LINEN
    {
        id: "m5",
        name: "Pure Irish Linen",
        type: "Linen",
        pattern: "Solid",
        color: "Beige",
        colors: ["bg-amber-100", "bg-stone-300"],
        price: 1800,
        image: "https://images.unsplash.com/photo-1594056075631-f925b686e921?q=80&w=2000&auto=format&fit=crop", // Linen Texture
        description: "Classic textured linen for summer suits.",
        brand: "Linen Club",
        gender: "Men",
        rating: 4.7,
        inStock: true
    },
    {
        id: "m6",
        name: "Striped Linen Blend",
        type: "Linen",
        pattern: "Striped",
        color: "Blue",
        colors: ["bg-blue-200", "bg-gray-300"],
        price: 1500,
        image: "https://images.unsplash.com/photo-1550920405-1a1a5b82cb97?q=80&w=2000&auto=format&fit=crop", // Striped Fabric
        description: "Soft linen blend with vertical stripes.",
        brand: "Linen Club",
        gender: "Unisex",
        rating: 4.4,
        inStock: true
    },

    // WOOL
    {
        id: "m7",
        name: "Super 120s Merino Wool",
        type: "Wool",
        pattern: "Solid",
        color: "Black",
        colors: ["bg-gray-900", "bg-blue-950"],
        price: 4500,
        image: "https://images.unsplash.com/photo-1560547012-683a4843cc1c?q=80&w=2000&auto=format&fit=crop", // Dark Wool Texture
        description: "Luxurious suiting fabric with a refined drape.",
        brand: "Raymond",
        gender: "Men",
        rating: 4.9,
        inStock: true
    },
    {
        id: "m8",
        name: "Checkered Tweed",
        type: "Wool",
        pattern: "Checkered",
        color: "Brown",
        colors: ["bg-amber-900", "bg-orange-800"],
        price: 2800,
        image: "https://images.unsplash.com/photo-1549419163-e4d0c15d0458?q=80&w=2000&auto=format&fit=crop", // Checkered Fabric
        description: "Warm and textured tweed for jackets.",
        brand: "OCM",
        gender: "Men",
        rating: 4.5,
        inStock: true
    },

    // VELVET
    {
        id: "m9",
        name: "Royal Velvet",
        type: "Velvet",
        pattern: "Solid",
        color: "Purple",
        colors: ["bg-purple-900", "bg-indigo-900"],
        price: 2200,
        image: "https://images.unsplash.com/photo-1612459800668-305886ac83b8?q=80&w=2000&auto=format&fit=crop", // Velvet Texture (Kept original if good, checking if better alt exists... actually the original is okay, keeping or swapping for diversity)
        description: "Plush velvet with deep, rich tones.",
        brand: "Reid & Taylor",
        gender: "Women",
        rating: 4.6,
        inStock: true
    },

    // DENIM
    {
        id: "m10",
        name: "Selvedge Denim",
        type: "Denim",
        pattern: "Solid",
        color: "Blue",
        colors: ["bg-blue-800", "bg-slate-900"],
        price: 1800,
        image: "https://images.unsplash.com/photo-1542272617-08f08375869d?q=80&w=2000&auto=format&fit=crop", // Denim Texture
        description: "Heavyweight raw denim for custom jeans.",
        brand: "Arvind",
        gender: "Unisex",
        rating: 4.7,
        inStock: true
    }
];
