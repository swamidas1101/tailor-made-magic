import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Filter, SortAsc, X, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { DesignCard } from "@/components/designs/DesignCard";
import { DesignFilters, ActiveFilters, defaultFilters } from "@/components/filters/DesignFilters";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, designs } from "@/data/mockData";

type SortOption = "popular" | "price-low" | "price-high" | "rating" | "newest";

export default function Categories() {
  const { id } = useParams();
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Filter and sort designs
  const filteredDesigns = useMemo(() => {
    let result = id
      ? designs.filter((d) => d.category.toLowerCase() === categories.find((c) => c.id === id)?.name.split(" ")[0].toLowerCase())
      : designs;

    // Apply filters
    if (filters.neckTypes.length > 0) {
      result = result.filter((d) => d.neckType && filters.neckTypes.includes(d.neckType));
    }
    if (filters.sleeveTypes.length > 0) {
      result = result.filter((d) => d.sleeveType && filters.sleeveTypes.includes(d.sleeveType));
    }
    if (filters.backDesigns.length > 0) {
      result = result.filter((d) => d.backDesign && filters.backDesigns.includes(d.backDesign));
    }
    if (filters.cutStyles.length > 0) {
      result = result.filter((d) => d.cutStyle && filters.cutStyles.includes(d.cutStyle));
    }
    if (filters.workTypes.length > 0) {
      result = result.filter((d) => d.workType && filters.workTypes.includes(d.workType));
    }
    if (filters.occasions.length > 0) {
      result = result.filter((d) => d.occasion && filters.occasions.includes(d.occasion));
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
  }, [id, filters, sortBy]);

  const totalActiveFilters =
    filters.neckTypes.length +
    filters.sleeveTypes.length +
    filters.backDesigns.length +
    filters.cutStyles.length +
    filters.workTypes.length +
    filters.occasions.length +
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
                <div className="sticky top-20 bg-card rounded-lg p-4 border border-border">
                  <DesignFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearAll={() => setFilters(defaultFilters)}
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
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-1" />
                        Filters
                        {totalActiveFilters > 0 && (
                          <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-[10px] flex items-center justify-center">
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
      <div className="container px-4 py-8">
        <div className="text-center mb-12">
          <p className="text-accent font-medium mb-2">Explore Our Collection</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">All Categories</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From traditional blouses to modern kurtis, find the perfect design for every occasion. 
            Expert tailoring with premium quality materials.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} {...cat} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
