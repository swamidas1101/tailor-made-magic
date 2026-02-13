import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Filter, LayoutGrid, List, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { MaterialFilters, defaultMaterialFilters, MaterialFiltersState } from "@/components/materials/MaterialFilters";
import { mockMaterials } from "@/data/materialData";

type SortOption = "popular" | "price-low" | "price-high" | "newest";

export default function Materials() {
  const [filters, setFilters] = useState<MaterialFiltersState>(defaultMaterialFilters);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    let result = mockMaterials;

    // Apply filters
    if (filters.types.length > 0) {
      result = result.filter((m) => filters.types.includes(m.type));
    }
    if (filters.patterns.length > 0) {
      result = result.filter((m) => filters.patterns.includes(m.pattern));
    }
    if (filters.brands.length > 0) {
      result = result.filter((m) => filters.brands.includes(m.brand));
    }
    if (filters.gender.length > 0) {
      result = result.filter((m) => filters.gender.includes(m.gender) || m.gender === "Unisex");
    }
    if (filters.colors.length > 0) {
      result = result.filter((m) => filters.colors.includes(m.color));
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
      result = result.filter((m) => m.price >= filters.priceRange[0] && m.price <= filters.priceRange[1]);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Assuming mock data doesn't have dates, well keep as is or simulate
        break;
      default:
        break;
    }

    return result;
  }, [filters, sortBy]);

  const totalActiveFilters =
    filters.types.length +
    filters.patterns.length +
    filters.brands.length +
    filters.gender.length +
    filters.colors.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Compact Hero Section */}
        <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-rose-900 via-rose-950 to-orange-950 text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="container px-4 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-orange-200 text-[10px] font-bold tracking-widest mb-3 uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Fabric Materials</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-3 leading-tight">
                Exquisite <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-100">Fabrics</span>
              </h1>
              <p className="text-sm md:text-base text-orange-100/60 mb-6 max-w-lg leading-relaxed">
                Curated textiles sourced globally for your bespoke creations.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  className="bg-white text-orange-950 hover:bg-orange-50 font-semibold h-9"
                  onClick={() => document.getElementById('materials-grid')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm h-9">
                  Guide
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-xl p-5 border border-border/60 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-foreground/80">
                  <Filter className="w-4 h-4" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                <MaterialFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onClearAll={() => setFilters(defaultMaterialFilters)}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 bg-card/50 p-3 rounded-lg border border-border/50 backdrop-blur-sm sticky top-20 lg:static z-20">
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground font-medium hidden md:block">
                    Showing <span className="text-foreground">{filteredMaterials.length}</span> premium materials
                  </p>
                  {/* Mobile Filter Button */}
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="lg:hidden hover:bg-accent">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {totalActiveFilters > 0 && (
                          <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-[10px] flex items-center justify-center">
                            {totalActiveFilters}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-4">
                      <SheetHeader className="mb-4">
                        <SheetTitle>Filter Materials</SheetTitle>
                      </SheetHeader>
                      <MaterialFilters
                        filters={filters}
                        onFilterChange={setFilters}
                        onClearAll={() => setFilters(defaultMaterialFilters)}
                      />
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Sort by</span>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-[150px] h-9 text-sm bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">New Arrivals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Materials Grid */}
              {filteredMaterials.length > 0 ? (
                <div id="materials-grid" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredMaterials.map((material) => (
                    <MaterialCard key={material.id} {...material} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Filter className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No materials found</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <Button variant="outline" onClick={() => setFilters(defaultMaterialFilters)}>
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