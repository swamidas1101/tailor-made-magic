import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, IndianRupee, Check, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { designs } from "@/data/mockData";
import { useState } from "react";
import { toast } from "sonner";

export default function DesignDetail() {
  const { id } = useParams();
  const design = designs.find((d) => d.id === id);
  const [withMaterial, setWithMaterial] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (!design) {
    return (
      <Layout>
        <div className="container px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Design not found</h1>
          <Button asChild>
            <Link to="/categories">Browse Designs</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleBookNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size or provide measurements");
      return;
    }
    toast.success("Redirecting to booking...", {
      description: `${design.name} - ₹${withMaterial ? design.priceWithMaterial : design.price}`,
    });
  };

  return (
    <Layout>
      <div className="container px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Designs
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-elevated">
            <img src={design.image} alt={design.name} className="w-full h-full object-cover" />
            {design.isPopular && (
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Popular</Badge>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-accent font-medium uppercase tracking-wide text-sm mb-2">{design.category}</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{design.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-semibold">{design.rating}</span>
                <span className="text-muted-foreground">({design.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{design.timeInDays} days delivery</span>
              </div>
            </div>

            <p className="text-foreground/80 mb-6">{design.description}</p>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2">
                {design.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Material Option */}
            <div className="mb-6 p-4 bg-muted/50 rounded-xl">
              <h3 className="font-semibold mb-3">Material Option</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setWithMaterial(false)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    !withMaterial ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium">Without Material</p>
                  <p className="text-sm text-muted-foreground">You provide the fabric</p>
                  <p className="text-lg font-bold text-primary mt-2">₹{design.price.toLocaleString()}</p>
                </button>
                <button
                  onClick={() => setWithMaterial(true)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    withMaterial ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium">With Material</p>
                  <p className="text-sm text-muted-foreground">Premium fabric included</p>
                  <p className="text-lg font-bold text-primary mt-2">₹{design.priceWithMaterial.toLocaleString()}</p>
                </button>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL", "Custom"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize === "Custom" && (
                <p className="text-sm text-accent mt-2">
                  <Link to="/measurements" className="underline">Click here</Link> to provide custom measurements
                </p>
              )}
            </div>

            {/* Price & Book */}
            <div className="mt-auto pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-3xl font-bold text-primary flex items-center">
                    <IndianRupee className="w-6 h-6" />
                    {(withMaterial ? design.priceWithMaterial : design.price).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Delivery in</p>
                  <p className="font-semibold">{design.timeInDays} working days</p>
                </div>
              </div>
              <Button variant="gold" size="xl" className="w-full" onClick={handleBookNow}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
