import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Filter, SlidersHorizontal, X, LayoutGrid, List, SortAsc, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { DesignCard } from "@/components/designs/DesignCard";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Design, Category } from "@/types/database"; // Use correct types
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { DynamicFilterSidebar, DynamicFiltersState } from "@/components/filters/DynamicFilterSidebar";

type SortOption = "popular" | "price-low" | "price-high" | "rating" | "newest";

export default function Categories() {
  const { id } = useParams();

  // Dynamic filter state
  const [filters, setFilters] = useState<DynamicFiltersState>({
    priceRange: [0, 10000],
    deliveryDays: null
  });

  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch data from Firebase
  const { designs, womenCategories: categories, menCategories, loading } = useFirebaseData();

  // Reset filters when category changes
  useEffect(() => {
    setFilters({
      priceRange: [0, 10000],
      deliveryDays: null
    });
  }, [id]);

  // Filter and sort designs
  const filteredDesigns = useMemo(() => {
    // 1. Filter by Category
    let result = id
      ? designs.filter((d) =>
        d.categoryId === id ||
        d.categoryName?.toLowerCase() === id.toLowerCase() || // Fallback
        // Assuming categories are loaded, we could look up the category and check match
        // But looking up in design.categoryId is most robust for new data
        (d as any).category === id // Legacy fallback
      )
      : designs;

    // 2. Filter by Status (only approved)
    result = result.filter(d => d.status === 'approved');

    // 3. Apply Dynamic Filters
    const { priceRange, deliveryDays, ...dynamicFilters } = filters;

    // Price
    if ((priceRange as [number, number])[0] > 0 || (priceRange as [number, number])[1] < 10000) {
      result = result.filter((d) => d.price >= (priceRange as [number, number])[0] && d.price <= (priceRange as [number, number])[1]);
    }

    // Delivery
    if (deliveryDays) {
      result = result.filter((d) => d.timeInDays <= (deliveryDays as number));
    }

    // Dynamic Attributes
    Object.entries(dynamicFilters).forEach(([groupId, selectedOptions]) => {
      const options = selectedOptions as string[];
      if (options.length > 0) {
        result = result.filter((d) => {
          // d.filters is Record<string, string[]> (groupId -> options)
          const designOptions = d.filters?.[groupId] || [];

          // Check if design has ANY of the selected options for this group
          return designOptions.some(opt => options.includes(opt));
        });
      }
    });

    // 4. Apply sorting
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
        result = [...result].sort((a, b) => ((b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)));
        break;
      default:
        break;
    }

    return result;
  }, [id, filters, sortBy, designs]);

  const totalActiveFilters = Object.entries(filters).reduce((acc: number, [key, val]) => {
    if (key === 'priceRange') {
      const range = val as [number, number];
      return acc + (range[0] > 0 || range[1] < 10000 ? 1 : 0);
    }
    if (key === 'deliveryDays') return acc + (val ? 1 : 0);
    return acc + (Array.isArray(val) ? (val as string[]).length : 0);
  }, 0);

  // If specific category selected
  if (id) {
    const category = categories.find((c) => c.id === id) || menCategories.find((c) => c.id === id);
    const gender = category?.type || "women";

    // If loading and we have NO data yet, show a full page loader
    if (loading && !category && designs.length === 0) {
      return (
        <Layout>
          <div className="container min-h-screen py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse">Loading collection...</p>
          </div>
        </Layout>
      );
    }
    return (
      <Layout>
        <div className="min-h-screen">
          {/* Header */}
          <div className="bg-muted/30 border-b border-border">
            <div className="container px-4 py-6">
              <Link to="/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" /> All Categories
              </Link>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  {loading && !category ? (
                    <Skeleton className="w-16 h-16 rounded-lg" />
                  ) : category?.image ? (
                    <img src={category.image} alt={category.name} className="w-16 h-16 rounded-lg object-cover shadow-sm border border-border" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <LayoutGrid className="w-8 h-8 text-muted-foreground/20" />
                    </div>
                  )}
                  <div>
                    {loading && !category ? (
                      <>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-96" />
                      </>
                    ) : (
                      <>
                        <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">{category?.name}</h1>
                        <p className="text-sm text-muted-foreground max-w-2xl">{category?.description}</p>
                      </>
                    )}
                  </div>
                </div>
                {loading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <p className="text-sm text-muted-foreground">{filteredDesigns.length} designs found</p>
                )}
              </div>
            </div>
          </div>

          <div className="container px-4 py-6">
            <div className="flex gap-6">
              {/* Desktop Sidebar Filters */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-20 bg-card rounded-lg p-4 border border-border shadow-soft">
                  <DynamicFilterSidebar
                    categoryId={id}
                    gender={gender}
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearAll={() => setFilters({ priceRange: [0, 10000], deliveryDays: null })}
                  />
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 gap-2">
                  {/* Mobile Filter Button */}
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden border-orange-300 text-orange-600 hover:bg-orange-50">
                        <Filter className="w-4 h-4 mr-1" />
                        Filters
                        {totalActiveFilters > 0 && (
                          <span className="ml-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center">
                            {totalActiveFilters}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-4 overflow-y-auto">
                      <SheetHeader className="mb-4">
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <DynamicFilterSidebar
                        categoryId={id}
                        gender={gender}
                        filters={filters}
                        onFilterChange={setFilters}
                        onClearAll={() => setFilters({ priceRange: [0, 10000], deliveryDays: null })}
                      />
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                      <SelectTrigger className="w-[140px] h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">Popular</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Top Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Design Grid */}
                {loading && filteredDesigns.length === 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="aspect-[3/4] rounded-xl bg-muted/50 animate-pulse" />
                    ))}
                  </div>
                ) : filteredDesigns.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {filteredDesigns.map((design) => (
                      <DesignCard
                        key={design.id}
                        id={design.id}
                        name={design.name}
                        category={design.categoryName || category?.name || "Unknown"}
                        image={design.image}
                        images={design.images}
                        price={design.price}
                        priceWithMaterial={design.priceWithMaterial}
                        rating={design.rating || 0}
                        reviewCount={design.reviewCount || 0}
                        timeInDays={design.timeInDays}
                        isPopular={design.isPopular}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">No designs match your filters</p>
                    <Button variant="outline" onClick={() => setFilters({ priceRange: [0, 10000], deliveryDays: null })}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // All categories view
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-rose-900 via-rose-950 to-black text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="container px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-gold text-xs font-semibold tracking-wider mb-4 uppercase">
              Premium Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-amber-200">Catalog</span>
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
              From traditional craftsmanship to contemporary elegance. Discover designs tailored to perfection for every occasion.
            </p>
          </div>
        </section>

        <div className="container px-4 py-16 -mt-10 relative z-20">
          {/* Women's Section */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-border"></div>
              <h2 className="text-3xl font-display font-bold text-foreground">Women's Collection</h2>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
              {loading && categories.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)
              ) : categories.map((cat) => (
                <CategoryCard key={cat.id} {...cat} />
              ))}
            </div>
          </div>

          {/* Men's Section */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-border"></div>
              <h2 className="text-3xl font-display font-bold text-foreground">Men's Collection</h2>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
              {loading && menCategories.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)
              ) : menCategories.map((cat) => (
                <CategoryCard key={cat.id} {...cat} />
              ))}
            </div>
          </div>

          {/* More Collections */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-border"></div>
              <h2 className="text-3xl font-display font-bold text-foreground">Specialized Services</h2>
              <div className="h-px flex-1 bg-border"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Uniforms Card - Horizontal Banner Style */}
              <Link to="/uniforms" className="group relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 block ring-1 ring-border/50">
                <div className="absolute inset-0 bg-blue-900">
                  <img
                    src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2070&auto=format&fit=crop"
                    alt="Uniforms"
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/60 to-transparent"></div>
                </div>
                <div className="absolute inset-y-0 left-0 p-6 md:p-8 flex flex-col justify-center max-w-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/10">
                      <LayoutGrid className="w-5 h-5 text-blue-200" />
                    </div>
                    <span className="text-blue-200 text-xs font-semibold tracking-wider uppercase">Institutional</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Uniforms & Bulk</h3>
                  <p className="text-blue-100/80 text-sm line-clamp-2 mb-4">Tailored solutions for schools, corporate, and healthcare. Volume pricing available.</p>

                  <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:gap-3 transition-all">
                    <span>Request Quote</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </div>
              </Link>

              {/* Materials Card - Horizontal Banner Style */}
              <Link to="/materials" className="group relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 block ring-1 ring-border/50">
                <div className="absolute inset-0 bg-orange-900">
                  <img
                    src="https://images.unsplash.com/photo-1574634534894-89d750a6f8a2?q=80&w=2000&auto=format&fit=crop"
                    alt="Materials"
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-950 via-orange-900/60 to-transparent"></div>
                </div>
                <div className="absolute inset-y-0 left-0 p-6 md:p-8 flex flex-col justify-center max-w-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/10">
                      <List className="w-5 h-5 text-orange-200" />
                    </div>
                    <span className="text-orange-200 text-xs font-semibold tracking-wider uppercase">Premium Fabrics</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Material Catalog</h3>
                  <p className="text-violet-100/80 text-sm line-clamp-2 mb-4">Explore our curated collection of high-quality fabrics, threads, and embellishments.</p>

                  <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:gap-3 transition-all">
                    <span>Browse Collection</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
