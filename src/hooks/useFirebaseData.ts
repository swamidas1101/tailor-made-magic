import { useState, useEffect, useMemo } from "react";
import { Design, Category } from "@/types/database";
import { designService } from "@/services/designService";
import { categoryService } from "@/services/categoryService";

export interface EnrichedCategory extends Category {
  designCount: number;
  firstDesignImage?: string;
}

interface UseFirebaseDataReturn {
  designs: Design[];
  allCategories: Category[];
  womenCategories: EnrichedCategory[];
  menCategories: EnrichedCategory[];
  loading: boolean;
  error: string | null;
}

// Cache to avoid refetching on every component mount (simple in-memory cache)
let cachedDesigns: Design[] | null = null;
let cachedCategories: Category[] | null = null;
let fetchPromise: Promise<void> | null = null;

export function useFirebaseData(): UseFirebaseDataReturn {
  const [designs, setDesigns] = useState<Design[]>(cachedDesigns || []);
  const [allCategories, setAllCategories] = useState<Category[]>(cachedCategories || []);
  const [loading, setLoading] = useState(!cachedDesigns || !cachedCategories);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedDesigns && cachedCategories) {
      setDesigns(cachedDesigns);
      setAllCategories(cachedCategories);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      // Deduplicate concurrent fetches
      if (!fetchPromise) {
        fetchPromise = (async () => {
          try {
            const [fetchedDesigns, fetchedCategories] = await Promise.all([
              designService.getAllDesigns(),
              categoryService.getCategories(),
            ]);
            cachedDesigns = fetchedDesigns;
            cachedCategories = fetchedCategories;
          } catch (err) {
            console.error("Error fetching Firebase data:", err);
            throw err;
          } finally {
            fetchPromise = null;
          }
        })();
      }

      try {
        await fetchPromise;
        setDesigns(cachedDesigns || []);
        setAllCategories(cachedCategories || []);
      } catch (err) {
        setError("Failed to load data from database");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group categories by type dynamically
  const womenCategories = useMemo(() => {
    return allCategories.filter((c) => c.type === "women");
  }, [allCategories]);

  const menCategories = useMemo(() => {
    return allCategories.filter((c) => c.type === "men");
  }, [allCategories]);

  // Enrich categories with dynamic design counts and first design image
  const enrichedWomenCategories = useMemo(() => {
    return womenCategories
      .map((cat) => {
        // Find all designs for this category
        const categoryDesigns = designs.filter(
          (d) => d.categoryId === cat.id
        );

        // Get the first design's image (prefer images[0] if available, fallback to image)
        const firstDesign = categoryDesigns[0];
        const firstDesignImage = firstDesign
          ? (firstDesign.images && firstDesign.images.length > 0 ? firstDesign.images[0] : firstDesign.image)
          : cat.image;

        return {
          ...cat,
          designCount: categoryDesigns.length,
          firstDesignImage,
        };
      })
      .filter((cat) => true); // Show all categories even empty ones for now? Or keep filtering? 
    // Keeping filter to hide empty categories might be better for UX, but for admin visibility, maybe show all. 
    // User requested "dynamic category", normally we show what exists. 
    // Let's SHOW all for now so seeded categories appear even if empty.
  }, [womenCategories, designs]);

  const enrichedMenCategories = useMemo(() => {
    return menCategories
      .map((cat) => {
        // Find all designs for this category
        const categoryDesigns = designs.filter(
          (d) => d.categoryId === cat.id
        );

        // Get the first design's image (prefer images[0] if available, fallback to image)
        const firstDesign = categoryDesigns[0];
        const firstDesignImage = firstDesign
          ? (firstDesign.images && firstDesign.images.length > 0 ? firstDesign.images[0] : firstDesign.image)
          : cat.image;

        return {
          ...cat,
          designCount: categoryDesigns.length,
          firstDesignImage,
        };
      })
      .filter((cat) => true);
  }, [menCategories, designs]);

  return {
    designs,
    allCategories,
    womenCategories: enrichedWomenCategories,
    menCategories: enrichedMenCategories,
    loading,
    error,
  };
}

// Force refresh cache (useful after seeding)
export function invalidateFirebaseCache() {
  cachedDesigns = null;
  cachedCategories = null;
}
