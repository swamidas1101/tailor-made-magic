import { useParams, Link, useNavigate } from "react-router-dom";
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
import { useCart } from "@/contexts/CartContext";
import { handleCustomError, showSuccess, showInfo } from "@/lib/toastUtils";

export default function DesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { designs, loading } = useFirebaseData();
  const design = designs.find((d) => d.id === id);
  const [withMaterial, setWithMaterial] = useState(false);
  const [showMeasurementSelector, setShowMeasurementSelector] = useState(false);
  const [selectedMeasurements, setSelectedMeasurements] = useState<Record<string, string> | null>(null);
  const [measurementMode, setMeasurementMode] = useState<'manual' | 'pickup' | null>(null);
  const [pickupTimeSlot, setPickupTimeSlot] = useState<string>("");
  const [hasSavedMeasurements, setHasSavedMeasurements] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = design ? isInWishlist(design.id) : false;
  const [activeImage, setActiveImage] = useState<string>(design?.image || "");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (design) {
      setActiveImage(design.image);
      // RESET ALL SELECTIONS ON ID CHANGE (e.g. from Similar Products)
      setWithMaterial(false);
      setShowMeasurementSelector(false);
      setSelectedMeasurements(null);
      setMeasurementMode(null);
      setPickupTimeSlot("");
    }
  }, [id, design?.image]); // Track ID to ensure full reset

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
    setMeasurementMode('manual');
    toast.success(isNew ? "Measurements saved!" : "Using saved measurements", {
      description: `${Object.keys(measurements).length} measurements applied`,
    });
  };

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!design) return;

    const cartItem = {
      designId: design.id,
      name: design.name,
      image: design.image,
      price: withMaterial ? design.priceWithMaterial : design.price,
      orderType: (withMaterial ? 'stitching_and_fabric' : 'stitching') as 'stitching' | 'stitching_and_fabric',
      measurementType: measurementMode,
      measurements: selectedMeasurements,
      pickupSlot: measurementMode === 'pickup' ? { date: new Date().toISOString().split('T')[0], time: pickupTimeSlot } : null,
      tailorId: design.tailorId || "platform_admin",
      shopName: design.shopName || "Tailo Premium",
      estimatedDays: design.timeInDays || 7,
      size: "custom",
      quantity: 1,
      withMaterial,
      hasFabricOption: design.priceWithMaterial > design.price && design.priceWithMaterial > 0
    };

    addToCart(cartItem);
    toast.success("Added to cart", {
      description: `${design.name} with your tailoring preferences`
    });
  };

  const handleBookNow = () => {
    if (!design) return;

    handleAddToCart();
    navigate("/cart");
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
        tailorId: design.tailorId || "platform_admin",
        shopName: design.shopName || "Tailo Premium",
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
          <button
            onClick={() => window.history.length > 2 ? window.history.back() : window.location.href = '/categories'}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Designs
          </button>
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

            </div>

            <p className="text-foreground/80 mb-6">{design.description}</p>


            {/* Material Checkbox - Renamed to Purchase Option */}
            {/* Material Checkbox - Renamed to Purchase Option */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted-foreground">Purchase Option</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWithMaterial(false)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${!withMaterial
                    ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                    : "border-border hover:border-orange-200 bg-white"
                    }`}
                >
                  <span className="font-bold text-sm text-foreground">Stitching Only</span>
                  {!withMaterial && <Check className="w-3.5 h-3.5 text-orange-600" />}
                </button>

                {design.priceWithMaterial > design.price && (
                  <button
                    type="button"
                    onClick={() => setWithMaterial(true)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${withMaterial
                      ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                      : "border-border hover:border-orange-200 bg-white"
                      }`}
                  >
                    <span className="font-bold text-sm text-foreground">Stitching + Fabric</span>
                    {withMaterial && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                )}
              </div>
            </div>

            {/* Measurements Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Measurements</h3>
                <SizeChartModal
                  defaultCategory={design.categoryName || (design as any).category}
                  trigger={
                    <Button variant="link" size="sm" className="h-auto p-0 text-orange-600 hover:text-orange-700 font-medium text-[10px]">
                      <Ruler className="w-3 h-3 mr-1" />
                      Size Guide
                    </Button>
                  }
                />
              </div>

              {/* Measurement Preference */}
              {/* Measurement Toggle Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => {
                    setShowMeasurementSelector(true);
                  }}
                  className={`relative p-3 rounded-lg border-2 text-left transition-all ${measurementMode === 'manual' ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/10 shadow-sm" : "border-border bg-card hover:border-orange-200"
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-foreground">Add Measurements</span>
                    {measurementMode === 'manual' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </div>
                  <p className="text-xs text-muted-foreground">Enter your measurements now</p>
                </button>

                <button
                  onClick={() => {
                    setMeasurementMode('pickup');
                    setSelectedMeasurements(null); // Clear manual measurements if switching
                  }}
                  className={`relative p-3 rounded-lg border-2 text-left transition-all ${measurementMode === 'pickup' ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/10 shadow-sm" : "border-border bg-card hover:border-orange-200"
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-foreground">Measure at Pickup</span>
                    {measurementMode === 'pickup' && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </div>
                  <p className="text-xs text-muted-foreground">Tailor visits you</p>
                </button>
              </div>

              {/* Conditional Content based on Selection */}
              {measurementMode === 'manual' && selectedMeasurements && Object.keys(selectedMeasurements).length > 0 && (
                <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg text-sm flex items-start gap-2 border border-green-100">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                  <p>{Object.keys(selectedMeasurements).length} measurements added.</p>
                </div>
              )}

              {measurementMode === 'pickup' && (
                <div className="mb-3 space-y-2 p-3 bg-muted/30 rounded-xl border border-border/50">
                  <p className="text-xs font-medium text-muted-foreground">Select Pickup Time Slot</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Morning (9-12)", "Afternoon (12-4)", "Evening (4-7)"].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setPickupTimeSlot(slot)}
                        className={`text-[10px] py-2 px-1 rounded-lg border transition-all ${pickupTimeSlot === slot
                          ? "bg-orange-50 border-orange-500 text-orange-700 font-medium shadow-sm"
                          : "bg-background border-border text-muted-foreground hover:border-orange-200"
                          }`}
                      >
                        {slot.split(" ")[0]}
                        <span className="block opacity-70 scale-90">{slot.split(" ")[1]}</span>
                      </button>
                    ))}
                  </div>
                  {!pickupTimeSlot && (
                    <p className="text-[10px] text-orange-600 animate-pulse">Please select a time slot</p>
                  )}
                </div>
              )}


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
                  <p className="text-sm text-muted-foreground">Expected Delivery</p>
                  <p className="font-semibold">{design.timeInDays} working days</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button
                  variant="outline"
                  size="xl"
                  className="rounded-xl font-bold border-orange-200 text-orange-700 hover:bg-orange-50"
                  onClick={handleAddToCart}
                  disabled={!measurementMode || (measurementMode === 'pickup' && !pickupTimeSlot)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="default"
                  size="xl"
                  className="rounded-xl font-bold shadow-gold-glow"
                  onClick={handleBookNow}
                  disabled={!measurementMode || (measurementMode === 'pickup' && !pickupTimeSlot)}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border/50">
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