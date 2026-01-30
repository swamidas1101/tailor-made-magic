import { Link } from "react-router-dom";
import { Shirt, ArrowRight, Ruler, Palette, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SizeChartModal } from "@/components/size-chart/SizeChartModal";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { menCategories } from "@/data/mockData";

export default function MensTailoring() {
  return (
    <Layout>
      {/* Hero - Compact */}
      <section className="py-10 md:py-16 gradient-hero">
        <div className="container px-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-gold mb-2">
              <Shirt className="w-4 h-4" />
              <span className="text-sm font-medium">Men's Tailoring</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-display font-bold text-primary-foreground mb-3">
              Bespoke Tailoring<br />for the Modern Man
            </h1>
            <p className="text-primary-foreground/80 text-sm md:text-base mb-6">
              From sharp formal shirts to elegant suits, experience expert craftsmanship.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="default">
                Explore <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="heroOutline" size="default" asChild>
                <Link to="/measurements?type=men">Get Measured</Link>
              </Button>
              <SizeChartModal
                defaultCategory="menShirt"
                trigger={
                  <Button variant="heroOutline" size="default" className="gap-2">
                    <Ruler className="w-4 h-4" />
                    Size Chart
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services - 2 columns mobile, 4 desktop */}
      <section className="py-10 md:py-16">
        <div className="container px-4">
          <div className="text-center mb-8">
            <p className="text-accent text-sm font-medium mb-1">Our Services</p>
            <h2 className="text-xl md:text-3xl font-display font-bold">Men's Collection</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {menCategories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Material Info - Compact */}
      <section className="py-10 md:py-16 bg-muted/50">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-accent text-sm font-medium mb-1">Fabric Options</p>
              <h2 className="text-xl md:text-2xl font-display font-bold mb-4">Bring Your Own Material</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Have a favorite fabric? Bring your own material or choose from our premium collection.
              </p>
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg shadow-soft">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Your Material</p>
                    <p className="text-xs text-muted-foreground">Pay only for tailoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg shadow-soft">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Palette className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Our Premium Fabrics</p>
                    <p className="text-xs text-muted-foreground">Curated imported materials</p>
                  </div>
                </div>
              </div>
              <Button variant="gold" asChild>
                <Link to="/materials">Browse Materials <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=300&fit=crop" alt="Fabric" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden mt-6">
                <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop" alt="Fabric" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
