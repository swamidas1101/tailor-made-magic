import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy
} from "firebase/firestore";
import { FilterGroup, FilterOption } from "@/types/database";

const GROUPS_COLLECTION = "filterGroups";
const OPTIONS_COLLECTION = "filterOptions";

// Simple in-memory cache
const cache: {
    groups: Record<string, FilterGroup[]>;
    options: Record<string, FilterOption[]>;
} = {
    groups: {},
    options: {}
};

export const filterService = {
    // ==================== Filter Groups ====================

    /**
     * Get all filter groups
     */
    async getFilterGroups(gender?: "men" | "women" | "both"): Promise<FilterGroup[]> {
        try {
            const groupsRef = collection(db, GROUPS_COLLECTION);
            let q = query(groupsRef);

            if (gender && gender !== "both") {
                q = query(
                    groupsRef,
                    where("applicableGender", "in", [gender, "both"])
                );
            }

            const snapshot = await getDocs(q);
            const groups = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as FilterGroup));

            return groups.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        } catch (error) {
            console.error("Error fetching filter groups:", error);
            throw error;
        }
    },

    /**
     * Get filter groups for a specific category and gender
     */
    async getFiltersForCategory(categoryId: string, gender: "men" | "women"): Promise<FilterGroup[]> {
        const cacheKey = `${categoryId}-${gender}`;
        if (cache.groups[cacheKey]) return cache.groups[cacheKey];

        try {
            const groupsRef = collection(db, GROUPS_COLLECTION);
            const q = query(
                groupsRef,
                where("isActive", "==", true),
                where("applicableGender", "in", [gender, "both"])
            );

            const snapshot = await getDocs(q);
            const allGroups = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as FilterGroup));

            // Return sorted and filtered groups
            const result = allGroups
                .filter(group =>
                    group.applicableCategories.length === 0 ||
                    group.applicableCategories.includes(categoryId)
                )
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

            cache.groups[cacheKey] = result;
            return result;
        } catch (error) {
            console.error("Error fetching filters for category:", error);
            throw error;
        }
    },

    /**
     * Create a new filter group (Admin only)
     */
    async createFilterGroup(data: Omit<FilterGroup, "id" | "createdAt" | "updatedAt">): Promise<string> {
        try {
            const now = new Date().toISOString();
            const groupData = {
                ...data,
                createdAt: now,
                updatedAt: now,
            };

            const docRef = await addDoc(collection(db, GROUPS_COLLECTION), groupData);
            return docRef.id;
        } catch (error) {
            console.error("Error creating filter group:", error);
            throw error;
        }
    },

    /**
     * Update a filter group (Admin only)
     */
    async updateFilterGroup(id: string, data: Partial<FilterGroup>): Promise<void> {
        try {
            const docRef = doc(db, GROUPS_COLLECTION, id);
            const updateData = {
                ...data,
                updatedAt: new Date().toISOString(),
            };

            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error("Error updating filter group:", error);
            throw error;
        }
    },

    /**
     * Delete a filter group (Admin only)
     */
    async deleteFilterGroup(id: string): Promise<void> {
        try {
            const docRef = doc(db, GROUPS_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting filter group:", error);
            throw error;
        }
    },

    // ==================== Filter Options ====================

    /**
     * Get all options for a filter group
     */
    async getFilterOptions(groupId: string): Promise<FilterOption[]> {
        if (cache.options[groupId]) return cache.options[groupId];

        try {
            const optionsRef = collection(db, OPTIONS_COLLECTION);
            const q = query(
                optionsRef,
                where("filterGroupId", "==", groupId),
                where("isActive", "==", true)
            );

            const snapshot = await getDocs(q);
            const options = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as FilterOption));

            const result = options.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
            cache.options[groupId] = result;
            return result;
        } catch (error) {
            console.error("Error fetching filter options:", error);
            throw error;
        }
    },

    /**
     * Get ALL options for a filter group (Admin)
     */
    async getAllFilterOptions(groupId: string): Promise<FilterOption[]> {
        try {
            const optionsRef = collection(db, OPTIONS_COLLECTION);
            const q = query(
                optionsRef,
                where("filterGroupId", "==", groupId)
            );

            const snapshot = await getDocs(q);
            const options = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as FilterOption));

            return options.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        } catch (error) {
            console.error("Error fetching all filter options:", error);
            throw error;
        }
    },

    /**
     * Get all options for multiple filter groups
     */
    async getOptionsForGroups(groupIds: string[]): Promise<Record<string, FilterOption[]>> {
        try {
            const result: Record<string, FilterOption[]> = {};

            await Promise.all(
                groupIds.map(async (groupId) => {
                    result[groupId] = await this.getFilterOptions(groupId);
                })
            );

            return result;
        } catch (error) {
            console.error("Error fetching options for groups:", error);
            throw error;
        }
    },

    /**
     * Create a new filter option (Admin only)
     */
    async createFilterOption(data: Omit<FilterOption, "id" | "createdAt" | "updatedAt">): Promise<string> {
        try {
            const now = new Date().toISOString();
            const optionData = {
                ...data,
                createdAt: now,
                updatedAt: now,
            };

            const docRef = await addDoc(collection(db, OPTIONS_COLLECTION), optionData);
            return docRef.id;
        } catch (error) {
            console.error("Error creating filter option:", error);
            throw error;
        }
    },

    /**
     * Update a filter option (Admin only)
     */
    async updateFilterOption(id: string, data: Partial<FilterOption>): Promise<void> {
        try {
            const docRef = doc(db, OPTIONS_COLLECTION, id);
            const updateData = {
                ...data,
                updatedAt: new Date().toISOString(),
            };

            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error("Error updating filter option:", error);
            throw error;
        }
    },

    /**
     * Delete a filter option (Admin only)
     */
    async deleteFilterOption(id: string): Promise<void> {
        try {
            const docRef = doc(db, OPTIONS_COLLECTION, id);
            await deleteDoc(docRef);
            this.invalidateCache();
        } catch (error) {
            console.error("Error deleting filter option:", error);
            throw error;
        }
    },

    invalidateCache() {
        cache.groups = {};
        cache.options = {};
    }
};
