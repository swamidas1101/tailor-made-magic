import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, IndianRupee, Check, Heart, Bookmark, Share2, Ruler, ChevronRight, Loader2, Settings2, ShoppingBag, Truck, ShieldCheck, AlertTriangle, ArrowLeft as BackIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MeasurementForm } from "@/components/measurements/MeasurementForm";
import { SizeChartModal } from "@/components/size-chart/SizeChartModal";
import { SimilarProducts } from "@/components/shared/SimilarProducts";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { LikeButton } from "@/components/designs/LikeButton";
import { useLikes } from "@/contexts/LikesContext";

export default function DesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { designs, loading } = useFirebaseData();
  const design = designs.find((d) => d.id === id);
  const [withMaterial, setWithMaterial] = useState(false);
  const [selectedMeasurements, setSelectedMeasurements] = useState<Record<string, string> | null>(null);
  const [measurementMode, setMeasurementMode] = useState<'manual' | 'pickup' | null>(null);
  const [pickupTimeSlot, setPickupTimeSlot] = useState<string>("");
  const [hasSavedMeasurements, setHasSavedMeasurements] = useState(false);
  const [showConfigSheet, setShowConfigSheet] = useState(false);
  const [configStep, setConfigStep] = useState<"options" | "measurements">("options");
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
      category: design.categoryName || (design as any).category || "Premium",
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
      toast.success("Saved to wishlist!");
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
                  <Bookmark className={`w-4 h-4 ${wishlisted ? "fill-amber-500 text-amber-500" : ""}`} />
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

              <Separator orientation="vertical" className="h-4" />

              {design && (
                <LikeButton
                  designId={design.id}
                  initialLikesCount={design.likesCount || 0}
                  size="md"
                  variant="outline"
                />
              )}
            </div>

            <p className="text-foreground/80 mb-6">{design.description}</p>


            {/* Service Type Selection - Compact & Rich */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="font-black text-[11px] uppercase tracking-[0.1em] text-foreground">Service Type</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setWithMaterial(false)}
                  className={cn(
                    "flex-1 min-w-[160px] flex items-center justify-between p-3.5 rounded-xl border-2 transition-all group",
                    !withMaterial
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/20 bg-white"
                  )}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-colors", !withMaterial ? "bg-primary/20" : "bg-muted")}>
                      <ShoppingBag className={cn("w-4.5 h-4.5", !withMaterial ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <p className={cn("text-[13px] font-bold leading-tight", !withMaterial ? "text-primary" : "text-foreground")}>Stitching Only</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">₹{design.price.toLocaleString()}</p>
                    </div>
                  </div>
                  {!withMaterial && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>}
                </button>

                {design.priceWithMaterial > design.price && (
                  <button
                    type="button"
                    onClick={() => setWithMaterial(true)}
                    className={cn(
                      "flex-1 min-w-[160px] flex items-center justify-between p-3.5 rounded-xl border-2 transition-all group",
                      withMaterial
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/20 bg-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5 text-left">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-colors", withMaterial ? "bg-primary/20" : "bg-muted")}>
                        <Truck className={cn("w-4.5 h-4.5", withMaterial ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div>
                        <p className={cn("text-[13px] font-bold leading-tight", withMaterial ? "text-primary" : "text-foreground")}>Stitching + Fabric</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">₹{design.priceWithMaterial.toLocaleString()}</p>
                      </div>
                    </div>
                    {withMaterial && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>}
                  </button>
                )}
              </div>
            </div>

            {/* Tailoring Preferences - More integrated */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="font-black text-[11px] uppercase tracking-[0.1em] text-foreground">Tailoring Preferences</h3>
              </div>
              <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-background border flex items-center justify-center shrink-0 shadow-sm text-primary">
                    <Settings2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    {measurementMode ? (
                      <div>
                        <p className="text-[13px] font-bold text-foreground truncate">
                          {measurementMode === 'manual' ? 'Custom Measurements' : 'At Pickup'}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {measurementMode === 'manual' ? `${measurementCount} sizes provided` : pickupTimeSlot}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[13px] font-bold text-muted-foreground">Not Configured</p>
                        <p className="text-[10px] text-muted-foreground/60">Measurements & Pickup</p>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => setShowConfigSheet(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-9 font-bold bg-white hover:bg-muted text-primary px-4 transition-all"
                >
                  {measurementMode ? "Edit" : "Configure"}
                </Button>
              </div>
            </div>

            {/* Simple Clean Pricing Card */}
            <div className="mt-4 pt-4 border-t space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Total Estimated Amount</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-foreground opacity-60">₹</span>
                    <span className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
                      {(withMaterial ? design.priceWithMaterial : design.price).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-primary mb-1">Ready in {design.timeInDays} Days</p>
                  <p className="text-[10px] text-muted-foreground">Expert quality guaranteed</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="xl"
                  className="h-14 rounded-2xl font-bold border-2 border-border hover:bg-muted/5 transition-all active:scale-[0.98]"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="default"
                  size="xl"
                  className="h-14 rounded-2xl font-bold shadow-xl shadow-primary/10 transition-all active:scale-[0.98]"
                  onClick={handleBookNow}
                >
                  Buy Now
                </Button>
              </div>

              {!measurementMode && (
                <p className="text-[10px] text-center text-muted-foreground/60 font-medium">
                  Tailoring preferences will be confirmed in the next step
                </p>
              )}
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

      {/* Unified Tailoring Configuration Sheet */}
      <Sheet open={showConfigSheet} onOpenChange={setShowConfigSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background border-l shadow-2xl">
          <SheetHeader className="p-3 sm:p-6 border-b bg-card shrink-0">
            <div className="flex items-center gap-2">
              {configStep === "measurements" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -ml-2 hover:bg-muted"
                  onClick={() => setConfigStep("options")}
                >
                  <BackIcon className="w-4 h-4" />
                </Button>
              )}
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-base sm:text-lg font-display font-bold flex items-center gap-2 truncate">
                  <Settings2 className="w-4 h-4 text-primary shrink-0" />
                  {configStep === "options" ? "Tailoring Options" : "Select Measurements"}
                </SheetTitle>
                <SheetDescription className="text-[10px] sm:text-xs truncate">
                  {configStep === "options"
                    ? "Choose how you'd like us to take your measurements."
                    : `Provide measurements for your ${design.name}`}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-muted/5">
            <AnimatePresence mode="wait">
              {configStep === "options" ? (
                <motion.div
                  key="options"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Measurement Method */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Measurement Method</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => setConfigStep("measurements")}
                        className={cn(
                          "w-full h-14 px-3 rounded-xl border-2 transition-all flex items-center justify-between text-left group",
                          measurementMode === 'manual'
                            ? "bg-primary/5 border-primary shadow-sm"
                            : "bg-white border-border/50 hover:bg-muted/40"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                            measurementMode === 'manual' ? "bg-primary/10" : "bg-muted"
                          )}>
                            <Ruler className={cn("w-4 h-4", measurementMode === 'manual' ? "text-primary" : "text-muted-foreground")} />
                          </div>
                          <div>
                            <p className={cn(
                              "text-[13px] font-bold",
                              measurementMode === 'manual' ? "text-primary" : "text-foreground"
                            )}>{selectedMeasurements ? 'Edit Sizes' : 'Add Sizes'}</p>
                            <p className="text-[9px] text-muted-foreground leading-none mt-0.5">Provide manual body sizes</p>
                          </div>
                        </div>
                        {measurementMode === 'manual' && <ShieldCheck className="w-4.5 h-4.5 text-primary" />}
                      </button>

                      <button
                        onClick={() => {
                          setMeasurementMode('pickup');
                          setSelectedMeasurements(null);
                        }}
                        className={cn(
                          "w-full h-14 px-3 rounded-xl border-2 transition-all flex items-center justify-between text-left group",
                          measurementMode === 'pickup'
                            ? "bg-primary/5 border-primary shadow-sm"
                            : "bg-white border-border/50 hover:bg-muted/40"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                            measurementMode === 'pickup' ? "bg-primary/10" : "bg-muted"
                          )}>
                            <Truck className={cn("w-4 h-4", measurementMode === 'pickup' ? "text-primary" : "text-muted-foreground")} />
                          </div>
                          <div>
                            <p className={cn(
                              "text-[13px] font-bold",
                              measurementMode === 'pickup' ? "text-primary" : "text-foreground"
                            )}>At Pickup</p>
                            <p className="text-[9px] text-muted-foreground leading-none mt-0.5">Tailor visits you for sizing</p>
                          </div>
                        </div>
                        {measurementMode === 'pickup' && <ShieldCheck className="w-4.5 h-4.5 text-primary" />}
                      </button>
                    </div>
                  </div>

                  {/* Pickup Slot Selection */}
                  {measurementMode === 'pickup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2 pt-1"
                    >
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Select Pickup Slot</Label>
                      <div className="bg-white p-2 rounded-xl border border-border/10 shadow-sm">
                        <div className="flex flex-col gap-1.5">
                          {[
                            { label: "Morning", sub: "9 AM - 12 PM", time: "Morning (9-12)" },
                            { label: "Afternoon", sub: "12 PM - 4 PM", time: "Afternoon (12-4)" },
                            { label: "Evening", sub: "4 PM - 7 PM", time: "Evening (4-7)" }
                          ].map((slot) => {
                            const isActive = pickupTimeSlot === slot.time;
                            return (
                              <button
                                key={slot.label}
                                onClick={() => setPickupTimeSlot(slot.time)}
                                className={cn(
                                  "flex items-center justify-between px-3 h-11 rounded-lg border transition-all",
                                  isActive
                                    ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                                    : "bg-transparent border-transparent hover:bg-muted/40"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <Clock className={cn("w-3.5 h-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
                                  <div className="text-left">
                                    <p className={cn("text-xs font-bold", isActive ? "text-primary" : "text-foreground")}>{slot.label}</p>
                                    <p className="text-[9px] text-muted-foreground leading-none">{slot.sub}</p>
                                  </div>
                                </div>
                                {isActive && (
                                  <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5 text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="measurements"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <MeasurementForm
                    categoryId={design.categoryId}
                    categoryName={design.categoryName || (design as any).category || ""}
                    onConfirm={(measurements) => {
                      setSelectedMeasurements(measurements);
                      setMeasurementMode('manual');
                      setConfigStep("options");
                      toast.success("Measurements updated successfully");
                    }}
                    onCancel={() => setConfigStep("options")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <SheetFooter className="p-3 sm:p-6 border-t bg-card mt-auto">
            <Button
              className="w-full h-12 rounded-2xl font-bold shadow-gold-sm"
              onClick={() => setShowConfigSheet(false)}
            >
              Done
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Layout>
  );
}