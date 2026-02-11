import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, IndianRupee, Check, Heart, Share2, Ruler, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MeasurementSelector } from "@/components/measurements/MeasurementSelector";
import { SizeChartModal } from "@/components/size-chart/SizeChartModal";
import { SimilarProducts } from "@/components/shared/SimilarProducts";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useWishlist } from "@/contexts/WishlistContext";

export default function DesignDetail() {
  const { id } = useParams();
  const { designs, loading } = useFirebaseData();
  const design = designs.find((d) => d.id === id);
  const [withMaterial, setWithMaterial] = useState(false);
  const [showMeasurementSelector, setShowMeasurementSelector] = useState(false);
  const [selectedMeasurements, setSelectedMeasurements] = useState<Record<string, string> | null>(null);
  const [hasSavedMeasurements, setHasSavedMeasurements] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = design ? isInWishlist(design.id) : false;
  const [activeImage, setActiveImage] = useState<string>("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (design) {
      setActiveImage(design.image);
    }
  }, [design]);

  const allImages = useMemo(() => {
    if (!design) return [];
    return [design.image, ...(design.images || [])];
  }, [design]);

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
          const designCat = design.categoryName || (design as any).category || "";
          const key = categoryMappings[designCat] || "blouse";
          if (parsed[key] && Object.keys(parsed[key]).length > 0) {
            setHasSavedMeasurements(true);
          }
        } catch (e) {
          console.error("Error parsing measurements", e);
        }
      }
    }
  }, [design]);

  if (loading && !design) {
    return (
      <Layout>
        <div className="container min-h-screen py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading design details...</p>
        </div>
      </Layout>
    );
  }

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

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(design.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist({
        id: design.id,
        name: design.name,
        image: design.image,
        price: design.price,
        category: design.categoryName || (design as any).category || "Premium",
      });
      toast.success("Added to wishlist!");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: design.name,
      text: `Check out this ${design.name} on Tailo!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const measurementCount = selectedMeasurements ? Object.keys(selectedMeasurements).length : 0;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Designs
          </Link>
        </div>

        <div className="grid lg:grid-cols-[40%_60%] gap-8 lg:gap-16">
          {/* Image Gallery Section */}
          <div className="flex flex-col gap-4">
            {/* Main Image with Zoom Effect */}
            <div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-elevated group bg-muted cursor-zoom-in"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setMousePos({ x, y });
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={design.name}
                className="w-full h-full object-cover transition-transform duration-200"
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: isHovering ? "scale(2)" : "scale(1)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {design.isPopular && (
                <Badge className="absolute top-4 left-4 bg-foreground text-background">Popular</Badge>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={handleWishlist}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? "border-foreground shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                  >
                    <img src={img} alt={`${design.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-muted-foreground font-medium uppercase tracking-wide text-sm mb-2">{design.categoryName || (design as any).category}</p>
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
                  defaultCategory={design.categoryName || (design as any).category}
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
          items={designs.filter(d =>
            d.status === 'approved' &&
            d.id !== design.id &&
            (
              d.categoryId === design.categoryId ||
              (design.categoryName && d.categoryName === design.categoryName) ||
              ((design as any).category && (d as any).category === (design as any).category)
            )
          ).slice(0, 10)}
          type="design"
          title="You May Also Like"
        />
      </div>

      {/* Measurement Selector Modal */}
      <MeasurementSelector
        isOpen={showMeasurementSelector}
        onClose={() => setShowMeasurementSelector(false)}
        categoryId={design.categoryId}
        categoryName={design.categoryName || (design as any).category || ""}
        onConfirm={handleMeasurementConfirm}
      />
    </Layout>
  );
}