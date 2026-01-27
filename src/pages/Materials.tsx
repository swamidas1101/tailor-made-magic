import { useState } from "react";
import { Link } from "react-router-dom";
import { Palette, ShoppingCart, Check, Filter, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Material {
  id: string;
  name: string;
  type: string;
  category: string;
  pricePerMeter: number;
  image: string;
  colors: string[];
  inStock: boolean;
  rating: number;
  bestFor: string[];
}

const materials: Material[] = [
  {
    id: "m1",
    name: "Premium Cotton",
    type: "Cotton",
    category: "blouse",
    pricePerMeter: 450,
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop",
    colors: ["#FFFFFF", "#000000", "#F5F5DC", "#FFC0CB", "#ADD8E6"],
    inStock: true,
    rating: 4.8,
    bestFor: ["Blouses", "Shirts", "Kurtis"],
  },
  {
    id: "m2",
    name: "Silk Brocade",
    type: "Silk",
    category: "blouse",
    pricePerMeter: 1200,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
    colors: ["#FFD700", "#800020", "#006400", "#4B0082"],
    inStock: true,
    rating: 4.9,
    bestFor: ["Wedding Blouses", "Sarees"],
  },
  {
    id: "m3",
    name: "Linen Blend",
    type: "Linen",
    category: "kurti",
    pricePerMeter: 650,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop",
    colors: ["#F5F5DC", "#D2B48C", "#FFFFFF", "#808080"],
    inStock: true,
    rating: 4.6,
    bestFor: ["Kurtis", "Shirts", "Pants"],
  },
  {
    id: "m4",
    name: "Georgette",
    type: "Synthetic",
    category: "saree",
    pricePerMeter: 550,
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop",
    colors: ["#FF69B4", "#FF0000", "#00CED1", "#9370DB"],
    inStock: true,
    rating: 4.5,
    bestFor: ["Sarees", "Dupattas", "Dresses"],
  },
  {
    id: "m5",
    name: "Terry Wool",
    type: "Wool",
    category: "suit",
    pricePerMeter: 1800,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop",
    colors: ["#2F4F4F", "#000080", "#36454F", "#000000"],
    inStock: true,
    rating: 4.9,
    bestFor: ["Suits", "Blazers", "Formal Pants"],
  },
  {
    id: "m6",
    name: "Poly-Cotton",
    type: "Blend",
    category: "uniform",
    pricePerMeter: 280,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
    colors: ["#FFFFFF", "#ADD8E6", "#F5F5DC"],
    inStock: true,
    rating: 4.4,
    bestFor: ["Uniforms", "Shirts", "School Wear"],
  },
  {
    id: "m7",
    name: "Raw Silk",
    type: "Silk",
    category: "blouse",
    pricePerMeter: 950,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
    colors: ["#FFD700", "#DC143C", "#228B22", "#8B4513"],
    inStock: false,
    rating: 4.7,
    bestFor: ["Blouses", "Lehengas"],
  },
  {
    id: "m8",
    name: "Twill Cotton",
    type: "Cotton",
    category: "pant",
    pricePerMeter: 520,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop",
    colors: ["#F5F5DC", "#D2691E", "#808080", "#000000"],
    inStock: true,
    rating: 4.6,
    bestFor: ["Pants", "Trousers", "Chinos"],
  },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "blouse", label: "Blouse" },
  { value: "kurti", label: "Kurti" },
  { value: "saree", label: "Saree" },
  { value: "suit", label: "Suits" },
  { value: "pant", label: "Pants" },
  { value: "uniform", label: "Uniforms" },
];

const fabricTypes = [
  { value: "all", label: "All Fabrics" },
  { value: "Cotton", label: "Cotton" },
  { value: "Silk", label: "Silk" },
  { value: "Linen", label: "Linen" },
  { value: "Wool", label: "Wool" },
  { value: "Synthetic", label: "Synthetic" },
];

export default function Materials() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [fabricFilter, setFabricFilter] = useState("all");
  const [cart, setCart] = useState<Record<string, number>>({});

  const filteredMaterials = materials.filter((m) => {
    if (categoryFilter !== "all" && m.category !== categoryFilter) return false;
    if (fabricFilter !== "all" && m.type !== fabricFilter) return false;
    return true;
  });

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    toast.success("Added to cart!");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-10 md:py-16 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
        <div className="container px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-white/90 mb-2">
            <Palette className="w-5 h-5" />
            <span className="text-sm font-medium">Premium Fabrics</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">
            Shop Materials
          </h1>
          <p className="text-white/90 max-w-lg mx-auto text-sm md:text-base">
            Choose from our curated collection of premium fabrics for your custom tailoring
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 border-b border-border sticky top-16 bg-background z-10">
        <div className="container px-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter:</span>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="text-xs">
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={fabricFilter} onValueChange={setFabricFilter}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Fabric" />
              </SelectTrigger>
              <SelectContent>
                {fabricTypes.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="text-xs">
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="ml-auto text-xs text-muted-foreground">
              {filteredMaterials.length} fabrics
            </span>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-8 md:py-12">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredMaterials.map((material) => (
              <div 
                key={material.id} 
                className="bg-card rounded-xl overflow-hidden border border-border shadow-soft hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img 
                    src={material.image} 
                    alt={material.name}
                    className="w-full h-full object-cover"
                  />
                  {!material.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary" className="bg-white text-foreground">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-white/90 text-foreground text-[10px]">
                    {material.type}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-1 mb-1">{material.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span className="text-xs font-medium">{material.rating}</span>
                  </div>

                  {/* Colors */}
                  <div className="flex gap-1 mb-2">
                    {material.colors.slice(0, 4).map((color, i) => (
                      <div 
                        key={i}
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {material.colors.length > 4 && (
                      <span className="text-[10px] text-muted-foreground">+{material.colors.length - 4}</span>
                    )}
                  </div>

                  {/* Best For */}
                  <p className="text-[10px] text-muted-foreground mb-2 line-clamp-1">
                    Best for: {material.bestFor.slice(0, 2).join(", ")}
                  </p>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">per meter</p>
                      <p className="font-bold text-primary">₹{material.pricePerMeter}</p>
                    </div>
                    <Button 
                      variant={cart[material.id] ? "default" : "outline"}
                      size="sm" 
                      className="h-8 px-3 text-xs"
                      disabled={!material.inStock}
                      onClick={() => addToCart(material.id)}
                    >
                      {cart[material.id] ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          {cart[material.id]}
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-muted/50">
        <div className="container px-4">
          <div className="bg-card rounded-xl p-6 md:p-8 shadow-md text-center">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-2">
              Have Your Own Material?
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Bring your own fabric and we'll stitch it for you. Pay only for tailoring!
            </p>
            <Button variant="gold" asChild>
              <Link to="/categories">Browse Designs <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}