import { useState, useEffect, useMemo } from "react";
import { Design, Category } from "@/data/mockData";
import { designService, categoryService } from "@/services/designService";

interface UseFirebaseDataReturn {
  designs: Design[];
  allCategories: Category[];
  womenCategories: Category[];
  menCategories: Category[];
  loading: boolean;
  error: string | null;
}

// Cache to avoid refetching on every component mount
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
              categoryService.getAllCategories(),
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

  // Enrich categories with dynamic design counts
  const enrichedWomenCategories = useMemo(() => {
    return womenCategories.map((cat) => ({
      ...cat,
      designCount: designs.filter(
        (d) => d.category === cat.id || d.category === cat.name || d.category === cat.filterKey
      ).length,
    }));
  }, [womenCategories, designs]);

  const enrichedMenCategories = useMemo(() => {
    return menCategories.map((cat) => ({
      ...cat,
      designCount: designs.filter(
        (d) => d.category === cat.id || d.category === cat.name || d.category === cat.filterKey
      ).length,
    }));
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
