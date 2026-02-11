// Database Schema Interfaces for Dynamic Filter System

export interface Category {
    id: string;
    name: string;                  // "Blouse Designs"
    slug: string;                  // "blouse-designs"
    type: "men" | "women";         // Gender classification
    description: string;
    image: string;                 // Category image URL
    displayOrder: number;          // For sorting in UI
    isActive: boolean;             // Show/hide category
    measurementConfigId?: string;  // Linked measurement configuration
    createdAt: string;             // ISO timestamp
    updatedAt: string;             // ISO timestamp
    createdBy: string;             // Admin UID
}

export interface MeasurementField {
    id: string;
    name: string;
    key: string;
    hint: string;
    displayOrder: number;
    isActive: boolean;
}

export interface MeasurementConfig {
    id: string;
    name: string;                  // e.g., "Blouse"
    icon: string;                  // Emoji or icon name
    description?: string;
    categoryIds: string[];         // Linked category IDs
    fields: MeasurementField[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FilterGroup {
    id: string;                    // "neckTypes", "sleeveTypes"
    name: string;                  // "Neck Types"
    description: string;
    applicableGender: "men" | "women" | "both";
    applicableCategories: string[]; // Category IDs, empty = all
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface FilterOption {
    id: string;
    filterGroupId: string;         // Parent filter group
    name: string;                  // Display name "Round Neck"
    value: string;                 // Stored value "round-neck"
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

// Updated Design interface
export interface DesignFilters {
    [filterGroupId: string]: string[]; // e.g., { neckTypes: ["round-neck", "v-neck"] }
}

export interface DesignWithFilters {
    id: string;
    name: string;
    categoryId: string;            // Reference to category
    categoryName: string;          // Denormalized
    gender: "men" | "women";       // Denormalized
    description: string;
    price: number;
    priceWithMaterial: number;
    timeInDays: number;
    image: string;
    images?: string[];
    rating: number;
    reviewCount: number;
    isPopular?: boolean;
    features?: string[];
    status: 'pending' | 'approved' | 'rejected' | 'correction_requested';
    submittedAt: string;
    adminFeedback?: string;
    tailorId: string;
    shopName: string;

    // Dynamic filters
    filters: DesignFilters;

    createdAt: string;
    updatedAt: string;
}

// Unified Design Type
export type Design = DesignWithFilters;
