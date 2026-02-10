import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Filter, SlidersHorizontal, X, LayoutGrid, List, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { DesignCard } from "@/components/designs/DesignCard";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Design, Category } from "@/data/mockData";
import { DesignFilters, ActiveFilters, defaultFilters } from "@/components/filters/DesignFilters";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirebaseData } from "@/hooks/useFirebaseData";

type SortOption = "popular" | "price-low" | "price-high" | "rating" | "newest";

export default function Categories() {
  const { id } = useParams();
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch data from Firebase
  const { designs, womenCategories: categories, menCategories, loading } = useFirebaseData();

  // Filter and sort designs
  const filteredDesigns = useMemo(() => {
    let result = id
      ? designs.filter((d) => {
        const category = categories.find((c) => c.id === id) || menCategories.find((c) => c.id === id);
        if (category?.filterKey) {
          return d.category === category.filterKey;
        }
        return d.category.toLowerCase() === category?.name.split(" ")[0].toLowerCase();
      })
      : designs;

    // Show only approved designs in public categories
    result = result.filter(d => d.status === 'approved');

    // Apply filters
    if (filters.neckTypes.length > 0) {
      result = result.filter((d) => d.neckType && (Array.isArray(d.neckType) ? d.neckType.some(t => filters.neckTypes.includes(t)) : filters.neckTypes.includes(d.neckType)));
    }
    if (filters.sleeveTypes.length > 0) {
      result = result.filter((d) => d.sleeveType && (Array.isArray(d.sleeveType) ? d.sleeveType.some(t => filters.sleeveTypes.includes(t)) : filters.sleeveTypes.includes(d.sleeveType)));
    }
    if (filters.backDesigns.length > 0) {
      result = result.filter((d) => d.backDesign && (Array.isArray(d.backDesign) ? d.backDesign.some(t => filters.backDesigns.includes(t)) : filters.backDesigns.includes(d.backDesign)));
    }
    if (filters.cutStyles.length > 0) {
      result = result.filter((d) => d.cutStyle && (Array.isArray(d.cutStyle) ? d.cutStyle.some(t => filters.cutStyles.includes(t)) : filters.cutStyles.includes(d.cutStyle)));
    }
    if (filters.workTypes.length > 0) {
      result = result.filter((d) => d.workType && (Array.isArray(d.workType) ? d.workType.some(t => filters.workTypes.includes(t)) : filters.workTypes.includes(d.workType)));
    }
    if (filters.occasions.length > 0) {
      result = result.filter((d) => d.occasion && (Array.isArray(d.occasion) ? d.occasion.some(t => filters.occasions.includes(t)) : filters.occasions.includes(d.occasion)));
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
      result = result.filter((d) => d.price >= filters.priceRange[0] && d.price <= filters.priceRange[1]);
    }
    if (filters.deliveryDays) {
      result = result.filter((d) => d.timeInDays <= filters.deliveryDays!);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        result = [...result].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
      default:
        break;
    }

    return result;
  }, [id, filters, sortBy, designs, categories, menCategories]);

  const totalActiveFilters =
    filters.neckTypes.length +
    filters.sleeveTypes.length +
    filters.backDesigns.length +
    filters.cutStyles.length +
    filters.workTypes.length +
    filters.occasions.length +
    filters.dupattaStyles.length +
    filters.skirtTypes.length +
    filters.blousePatterns.length +
    (filters.deliveryDays ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0);

  // If specific category selected
  if (id) {
    const category = categories.find((c) => c.id === id);

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
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">{category?.name}</h1>
                  <p className="text-sm text-muted-foreground">{category?.description}</p>
                </div>
                <p className="text-sm text-muted-foreground">{filteredDesigns.length} designs found</p>
              </div>
            </div>
          </div>

          <div className="container px-4 py-6">
            <div className="flex gap-6">
              {/* Desktop Sidebar Filters */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-20 bg-card rounded-lg p-4 border border-border shadow-soft">
                  <DesignFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearAll={() => setFilters(defaultFilters)}
                    categoryId={id}
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
                    <SheetContent side="left" className="w-[300px] p-4">
                      <SheetHeader className="mb-4">
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <DesignFilters
                        filters={filters}
                        onFilterChange={setFilters}
                        onClearAll={() => setFilters(defaultFilters)}
                        categoryId={id}
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
                {filteredDesigns.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {filteredDesigns.map((design) => (
                      <DesignCard key={design.id} {...design} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">No designs match your filters</p>
                    <Button variant="outline" onClick={() => setFilters(defaultFilters)}>
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
              {categories.map((cat) => (
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
              {menCategories.map((cat) => (
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
