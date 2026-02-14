import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, Ruler, ShieldCheck, ShoppingBag, AlertTriangle, Clock, Settings2, Info, Truck, Heart, Check, ChevronRight, ArrowLeft as BackIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { MeasurementForm } from "@/components/measurements/MeasurementForm";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, updateItemDetails, clearCart, totalItems, totalPrice, isLoading } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [configItemId, setConfigItemId] = useState<string | null>(null);
  const [configStep, setConfigStep] = useState<"options" | "measurements">("options");

  const selectedItem = useMemo(() =>
    items.find(i => i.id === (configItemId || selectedItemId)),
    [items, configItemId, selectedItemId]
  );

  const isCheckoutDisabled = useMemo(() => {
    return items.some(item => {
      // Must have measurement mode
      if (!item.measurementType) return true;
      // If pickup, must have a slot
      if (item.measurementType === 'pickup' && !item.pickupSlot) return true;
      // If manual, must have measurements (some data)
      if (item.measurementType === 'manual' && (!item.measurements || Object.keys(item.measurements).length === 0)) return true;
      return false;
    });
  }, [items]);

  const handleMoveToWishlist = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      addToWishlist({
        id: item.designId,
        name: item.name,
        image: item.image,
        price: item.price,
        category: item.category,
        tailorId: item.tailorId,
        shopName: item.shopName
      });
      removeFromCart(id);
      toast.success("Moved to wishlist!", { description: item.name });
    }
  };

  const confirmDelete = (move: boolean = false) => {
    if (itemToDelete) {
      const item = items.find(i => i.id === itemToDelete);
      if (item) {
        if (move) {
          addToWishlist({
            id: item.designId,
            name: item.name,
            image: item.image,
            price: item.price,
            category: item.category,
            tailorId: item.tailorId,
            shopName: item.shopName
          });
          toast.success("Moved to wishlist!", { description: item.name });
        } else {
          toast.info("Item removed from cart", { description: item.name });
        }
        removeFromCart(itemToDelete);
      }
      setItemToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container px-4 py-32 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-3">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any designs to your cart yet. Explore our collection to find your perfect style!
            </p>
            <Button variant="gold" size="lg" asChild>
              <Link to="/categories">Browse Designs <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-6 md:py-8 max-w-6xl mx-auto pb-32 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" /> Clear Cart
          </Button>
        </div>

        {isCheckoutDisabled && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-orange-900">Please finish tailoring details</p>
              <p className="text-xs text-orange-700/80">Select stitching type and sizes for each item to proceed with your order.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card rounded-2xl p-3 sm:p-4 shadow-soft hover:shadow-lg transition-all border border-border/50 group">
                <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
                  {/* Top: Image + Info Row on Mobile */}
                  <div className="flex gap-4 flex-1 min-w-0">
                    {/* Image */}
                    <div className="shrink-0">
                      <Link to={item.designId.startsWith('m') ? `/material/${item.designId}` : `/design/${item.designId}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 sm:w-28 sm:h-32 object-cover rounded-2xl group-hover:opacity-90 transition-opacity border border-border/10 shadow-sm"
                        />
                      </Link>
                    </div>

                    {/* Item Info beside image */}
                    <div className="flex-1 min-w-0 py-0.5">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Link to={item.designId.startsWith('m') ? `/material/${item.designId}` : `/design/${item.designId}`} className="block truncate max-w-[150px] sm:max-w-none">
                          <h3 className="font-bold text-sm md:text-base group-hover:text-primary transition-colors leading-tight truncate">{item.name}</h3>
                        </Link>
                        <Badge variant="secondary" className="text-[9px] h-4.5 bg-muted/50 border-none font-bold uppercase tracking-wider px-1.5">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium mb-2">by {item.shopName || 'Premium Tailor'}</p>

                      {/* Selection Summary Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-2 md:mb-0">
                        <Badge variant="outline" className="text-[8px] sm:text-[9px] h-5 border-orange-100 text-orange-700 bg-orange-50/50 px-1.5">
                          {item.orderType === 'stitching' ? 'Stitching Only' : 'Stitching + Fabric'}
                        </Badge>
                        <Badge variant="outline" className={cn(
                          "text-[8px] sm:text-[9px] h-5 px-1.5",
                          item.measurementType
                            ? "border-green-100 text-green-700 bg-green-50/50"
                            : "border-orange-100 text-orange-700 bg-orange-50/50"
                        )}>
                          {item.measurementType === 'manual'
                            ? (item.measurements ? 'Sizes' : 'Needs Sizes')
                            : item.measurementType === 'pickup'
                              ? 'At Pickup'
                              : 'Select Meas.'}
                        </Badge>
                      </div>

                      {/* Desktop button position */}
                      <div className="hidden md:block mt-4">
                        <Button
                          variant={item.measurementType ? "secondary" : "outline"}
                          size="sm"
                          className={cn(
                            "h-9 text-[11px] font-bold border-2 rounded-xl group/btn",
                            item.measurementType && "bg-green-50 border-green-100 text-green-700 hover:bg-green-100 hover:text-green-800"
                          )}
                          onClick={() => {
                            setConfigItemId(item.id);
                            setConfigStep("options");
                            setShowConfigDialog(true);
                          }}
                        >
                          {item.measurementType ? (
                            <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                          ) : (
                            <Settings2 className="w-3.5 h-3.5 mr-2 group-hover/btn:rotate-90 transition-transform" />
                          )}
                          {item.measurementType ? 'Review Your Fit' : 'Perfect Your Fit'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions: Column below row */}
                  <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-end gap-4">
                    {/* Mobile button position */}
                    <div className="md:hidden">
                      <Button
                        variant={item.measurementType ? "secondary" : "outline"}
                        size="sm"
                        className={cn(
                          "h-9 w-full text-[11px] font-bold border-2 rounded-xl group/btn",
                          item.measurementType && "bg-green-50 border-green-100 text-green-700 hover:bg-green-100 hover:text-green-800"
                        )}
                        onClick={() => {
                          setConfigItemId(item.id);
                          setConfigStep("options");
                          setShowConfigDialog(true);
                        }}
                      >
                        {item.measurementType ? (
                          <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                        ) : (
                          <Settings2 className="w-3.5 h-3.5 mr-2 group-hover/btn:rotate-90 transition-transform" />
                        )}
                        {item.measurementType ? 'Review Your Fit' : 'Perfect Your Fit'}
                      </Button>
                    </div>

                    {/* Actions & Pricing Section */}
                    <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-4 md:w-[150px] shrink-0 pt-3 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-border/10">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-muted/40 rounded-xl p-0.5 border border-border/10">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-white rounded-lg transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-white rounded-lg transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Pricing Info */}
                      <div className="flex flex-col items-end gap-1">
                        <p className="font-bold text-primary text-xl whitespace-nowrap leading-none">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          ₹{item.price.toLocaleString()} per item
                        </p>
                      </div>

                      {/* Delete Button - Premium Outline Style */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive border-2 border-destructive/10 hover:bg-destructive/5 hover:border-destructive/20 rounded-xl shrink-0 transition-all hover:scale-110 active:scale-95 group/trash"
                        onClick={() => setItemToDelete(item.id)}
                        title="Remove from cart"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24 border border-border/50">
              <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground italic text-xs">Exclusive savings & shipping confirmed at checkout.</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Cart Total</span>
                <span className="text-primary text-2xl">₹{totalPrice.toLocaleString()}</span>
              </div>


              <div className="space-y-3">
                <Button
                  variant="gold"
                  size="xl"
                  className="w-full shadow-gold-glow hover:shadow-gold-glow-lg transition-all font-bold group"
                  onClick={() => navigate("/checkout")}
                  disabled={isCheckoutDisabled}
                >
                  {isCheckoutDisabled ? 'Fill Details to Checkout' : 'Secure Checkout'}
                  {!isCheckoutDisabled && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>

                {isCheckoutDisabled && (
                  <p className="text-[10px] text-center text-orange-600 font-bold italic">
                    * One or more items need tailoring specifications
                  </p>
                )}
              </div>

              <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
                <Link to="/categories"><ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Checkout Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border shadow-[0_-8px_30px_rgb(0,0,0,0.12)] p-4 animate-in slide-in-from-bottom duration-500">
          <div className="container max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Amount</span>
              <span className="text-xl font-display font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
            </div>
            <Button
              variant="gold"
              className="h-12 px-8 rounded-2xl shadow-gold-glow font-bold group flex-1"
              onClick={() => navigate("/checkout")}
              disabled={isCheckoutDisabled}
            >
              Checkout
              {!isCheckoutDisabled && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Unified Tailoring Configuration Sheet */}
      <Sheet open={showConfigDialog} onOpenChange={setShowConfigDialog}>
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
                    ? "Customize how you want this item to be tailored."
                    : `Provide measurements for your ${selectedItem?.name}`}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-muted/5">
            {!selectedItem ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="font-bold text-sm">Item not found</p>
                  <p className="text-xs text-muted-foreground mt-1">Please try opening the configuration again.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowConfigDialog(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {configStep === "options" ? (
                  <motion.div
                    key="options"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Order Type */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Service Type</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => updateItemDetails(selectedItem.id, { orderType: 'stitching', withMaterial: false })}
                          className={cn(
                            "w-full h-14 px-3 rounded-xl border-2 transition-all flex items-center justify-between text-left group",
                            selectedItem.orderType === 'stitching'
                              ? "bg-primary/5 border-primary shadow-sm"
                              : "bg-white border-border/50 hover:bg-muted/40"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                              selectedItem.orderType === 'stitching' ? "bg-primary/10" : "bg-muted"
                            )}>
                              <ShoppingBag className={cn("w-4 h-4", selectedItem.orderType === 'stitching' ? "text-primary" : "text-muted-foreground")} />
                            </div>
                            <div>
                              <p className={cn(
                                "text-[13px] font-bold",
                                selectedItem.orderType === 'stitching' ? "text-primary" : "text-foreground"
                              )}>Stitching Only</p>
                              <p className="text-[9px] text-muted-foreground leading-none mt-0.5">You provide the fabric</p>
                            </div>
                          </div>
                          {selectedItem.orderType === 'stitching' && <ShieldCheck className="w-4.5 h-4.5 text-primary" />}
                        </button>

                        {selectedItem.hasFabricOption !== false && (
                          <button
                            onClick={() => updateItemDetails(selectedItem.id, { orderType: 'stitching_and_fabric', withMaterial: true })}
                            className={cn(
                              "w-full h-14 px-3 rounded-xl border-2 transition-all flex items-center justify-between text-left group",
                              selectedItem.orderType === 'stitching_and_fabric'
                                ? "bg-primary/5 border-primary shadow-sm"
                                : "bg-white border-border/50 hover:bg-muted/40"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                selectedItem.orderType === 'stitching_and_fabric' ? "bg-primary/10" : "bg-muted"
                              )}>
                                <Truck className={cn("w-4 h-4", selectedItem.orderType === 'stitching_and_fabric' ? "text-primary" : "text-muted-foreground")} />
                              </div>
                              <div>
                                <p className={cn(
                                  "text-[13px] font-bold",
                                  selectedItem.orderType === 'stitching_and_fabric' ? "text-primary" : "text-foreground"
                                )}>Stitching + Fabric</p>
                                <p className="text-[9px] text-muted-foreground leading-none mt-0.5">We provide premium fabric</p>
                              </div>
                            </div>
                            {selectedItem.orderType === 'stitching_and_fabric' && <ShieldCheck className="w-4.5 h-4.5 text-primary" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Measurement Method */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Measurement Method</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => setConfigStep("measurements")}
                          className={cn(
                            "w-full h-14 px-3 rounded-xl border-2 transition-all flex items-center justify-between text-left group",
                            selectedItem.measurementType === 'manual'
                              ? "bg-primary/5 border-primary shadow-sm"
                              : "bg-white border-border/50 hover:bg-muted/40"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                              selectedItem.measurementType === 'manual' ? "bg-primary/10" : "bg-muted"
                            )}>
                              <Ruler className={cn("w-4 h-4", selectedItem.measurementType === 'manual' ? "text-primary" : "text-muted-foreground")} />
                            </div>
                            <div>
                              <p className={cn(
                                "text-[13px] font-bold",
                                selectedItem.measurementType === 'manual' ? "text-primary" : "text-foreground"
                              )}>{selectedItem.measurements ? 'Edit Sizes' : 'Add Sizes'}</p>
                              <p className="text-[9px] text-muted-foreground leading-none mt-0.5">Provide manual body sizes</p>
                            </div>
                          </div>
                          {selectedItem.measurementType === 'manual' && <ShieldCheck className="w-4.5 h-4.5 text-primary" />}
                        </button>

                        <button
                          onClick={() => updateItemDetails(selectedItem.id, { measurementType: 'pickup', measurements: null })}
                          className={cn(
                            "w-full h-14 px-3 rounded-xl border-2 transition-all flex items-center justify-between text-left group",
                            selectedItem.measurementType === 'pickup'
                              ? "bg-primary/5 border-primary shadow-sm"
                              : "bg-white border-border/50 hover:bg-muted/40"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                              selectedItem.measurementType === 'pickup' ? "bg-primary/10" : "bg-muted"
                            )}>
                              <Truck className={cn("w-4 h-4", selectedItem.measurementType === 'pickup' ? "text-primary" : "text-muted-foreground")} />
                            </div>
                            <div>
                              <p className={cn(
                                "text-[13px] font-bold",
                                selectedItem.measurementType === 'pickup' ? "text-primary" : "text-foreground"
                              )}>At Pickup</p>
                              <p className="text-[9px] text-muted-foreground leading-none mt-0.5">Tailor visits you for sizing</p>
                            </div>
                          </div>
                          {selectedItem.measurementType === 'pickup' && <ShieldCheck className="w-4.5 h-4.5 text-primary" />}
                        </button>
                      </div>
                    </div>

                    {/* Pickup Slot Selection */}
                    {selectedItem.measurementType === 'pickup' && (
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
                              const isActive = selectedItem.pickupSlot?.time === slot.time;
                              return (
                                <button
                                  key={slot.label}
                                  onClick={() => updateItemDetails(selectedItem.id, {
                                    pickupSlot: { date: new Date().toISOString().split('T')[0], time: slot.time }
                                  })}
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
                      categoryId={selectedItem.category}
                      categoryName={selectedItem.name}
                      onConfirm={(measurements) => {
                        updateItemDetails(selectedItem.id, { measurementType: 'manual', measurements });
                        setConfigStep("options");
                        toast.success("Measurements updated successfully");
                      }}
                      onCancel={() => setConfigStep("options")}
                    />
                  </motion.div>
                )
                }
              </AnimatePresence>
            )}
          </div>

          <SheetFooter className="p-3 sm:p-6 border-t bg-card mt-auto">
            <Button
              className="w-full h-12 rounded-2xl font-bold shadow-gold-sm"
              onClick={() => setShowConfigDialog(false)}
            >
              Done
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent className="max-w-[380px] rounded-3xl p-6 gap-6 border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-display font-bold text-center">Remove Item?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-center text-muted-foreground">
              Wish to save this for later? You can move it to your wishlist instead of removing it.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-3">
            <Button
              variant="gold"
              className="w-full h-12 rounded-xl font-bold text-sm shadow-gold-glow"
              onClick={() => confirmDelete(true)}
            >
              <Heart className="w-4 h-4 mr-2" /> Move to Wishlist
            </Button>

            <div className="flex gap-3">
              <AlertDialogCancel className="flex-1 h-12 rounded-xl border-2 font-semibold">
                Keep
              </AlertDialogCancel>

              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl text-destructive border-2 border-destructive/20 hover:bg-destructive/5 font-semibold"
                onClick={() => confirmDelete(false)}
              >
                Remove
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Layout >
  );
}
