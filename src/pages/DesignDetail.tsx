import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, IndianRupee, Check, Heart, Share2, Ruler, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { designs } from "@/data/mockData";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { MeasurementSelector } from "@/components/measurements/MeasurementSelector";
import { SizeChartModal } from "@/components/size-chart/SizeChartModal";
import { SimilarProducts } from "@/components/shared/SimilarProducts";

export default function DesignDetail() {
  const { id } = useParams();
  const design = designs.find((d) => d.id === id);
  const [withMaterial, setWithMaterial] = useState(false);
  const [showMeasurementSelector, setShowMeasurementSelector] = useState(false);
  const [selectedMeasurements, setSelectedMeasurements] = useState<Record<string, string> | null>(null);
  const [hasSavedMeasurements, setHasSavedMeasurements] = useState(false);

  // Check for saved measurements on mount
  useEffect(() => {
    if (design) {
      const stored = localStorage.getItem("measurements");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const categoryMappings: Record<string, string> = {
            "Blouse": "blouse",
            "Kurti": "kurti",
            "Saree": "saree",
            "Frock": "kurti",
            "Lehenga": "blouse",
            "Half Saree": "blouse",
            "Suits": "kurti",
          };
          const key = categoryMappings[design.category] || "blouse";
          if (parsed[key] && Object.keys(parsed[key]).length > 0) {
            setHasSavedMeasurements(true);
          }
        } catch (e) {
          console.error("Error parsing measurements", e);
        }
      }
    }
  }, [design]);

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

  const handleMeasurementConfirm = (measurements: Record<string, string>, isNew: boolean) => {
    setSelectedMeasurements(measurements);
    toast.success(isNew ? "Measurements saved!" : "Using saved measurements", {
      description: `${Object.keys(measurements).length} measurements applied`,
    });
  };

  const handleBookNow = () => {
    if (!selectedMeasurements) {
      toast.error("Please provide your measurements first");
      setShowMeasurementSelector(true);
      return;
    }
    toast.success("Proceeding to checkout...", {
      description: `${design.name} - ₹${withMaterial ? design.priceWithMaterial : design.price}`,
    });
  };

  const measurementCount = selectedMeasurements ? Object.keys(selectedMeasurements).length : 0;

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
              <Badge className="absolute top-4 left-4 bg-foreground text-background">Popular</Badge>
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
            <p className="text-muted-foreground font-medium uppercase tracking-wide text-sm mb-2">{design.category}</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{design.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-gold text-gold" />
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
            {design.features && design.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2">
                  {design.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-foreground" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Material Option */}
            <div className="mb-6 p-4 bg-muted/50 rounded-xl">
              <h3 className="font-semibold mb-3">Material Option</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setWithMaterial(false)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${!withMaterial ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/30"
                    }`}
                >
                  <p className="font-medium">Without Material</p>
                  <p className="text-sm text-muted-foreground">You provide the fabric</p>
                  <p className="text-lg font-bold text-foreground mt-2">₹{design.price.toLocaleString()}</p>
                </button>
                <button
                  onClick={() => setWithMaterial(true)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${withMaterial ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground/30"
                    }`}
                >
                  <p className="font-medium">With Material</p>
                  <p className="text-sm text-muted-foreground">Premium fabric included</p>
                  <p className="text-lg font-bold text-foreground mt-2">₹{design.priceWithMaterial.toLocaleString()}</p>
                </button>
              </div>
            </div>

            {/* Measurements Section */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Your Measurements</h3>
              <button
                onClick={() => setShowMeasurementSelector(true)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedMeasurements
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/30"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedMeasurements ? "bg-foreground text-background" : "bg-muted text-foreground"
                      }`}>
                      <Ruler className="w-5 h-5" />
                    </div>
                    <div>
                      {selectedMeasurements ? (
                        <>
                          <p className="font-medium text-foreground">Measurements Added</p>
                          <p className="text-sm text-muted-foreground">
                            {measurementCount} measurements • Tap to change
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-foreground">Add Measurements</p>
                          <p className="text-sm text-muted-foreground">
                            {hasSavedMeasurements
                              ? "Use saved or enter new measurements"
                              : "Required for custom fitting"
                            }
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>

              {/* Size Chart Link */}
              <div className="mt-3">
                <SizeChartModal
                  defaultCategory={design.category}
                  trigger={
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                      <Ruler className="w-4 h-4" />
                      View Size Chart
                    </Button>
                  }
                />
              </div>
            </div>

            {/* Price & Book */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-3xl font-bold text-foreground flex items-center">
                    <IndianRupee className="w-6 h-6" />
                    {(withMaterial ? design.priceWithMaterial : design.price).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Delivery in</p>
                  <p className="font-semibold">{design.timeInDays} working days</p>
                </div>
              </div>
              <Button variant="default" size="xl" className="w-full" onClick={handleBookNow}>
                {selectedMeasurements ? "Proceed to Checkout" : "Add Measurements & Book"}
              </Button>
            </div>
          </div>
        </div>
        <SimilarProducts
          items={designs.filter(d => d.category === design.category && d.id !== design.id).slice(0, 10)}
          type="design"
          title="You May Also Like"
        />
      </div>

      {/* Measurement Selector Modal */}
      <MeasurementSelector
        isOpen={showMeasurementSelector}
        onClose={() => setShowMeasurementSelector(false)}
        category={design.category}
        onConfirm={handleMeasurementConfirm}
      />
    </Layout>
  );
}