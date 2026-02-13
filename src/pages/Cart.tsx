import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Clock, Ruler, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { MeasurementSelector } from "@/components/measurements/MeasurementSelector";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, updateItemDetails, clearCart, totalItems, totalPrice, isLoading } = useCart();
  const navigate = useNavigate();
  const [showMeasurementSelector, setShowMeasurementSelector] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const selectedItem = useMemo(() =>
    items.find(i => i.id === selectedItemId),
    [items, selectedItemId]
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
      <div className="container px-2 sm:px-4 py-8 max-w-6xl mx-auto">
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
                <div className="flex flex-col md:flex-row md:items-center gap-4 lg:gap-6">
                  {/* Image & Basic Info - ~25% width on desktop */}
                  <div className="flex gap-3 md:w-[25%] lg:w-[22%] shrink-0">
                    <Link to={item.designId.startsWith('m') ? `/material/${item.designId}` : `/design/${item.designId}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 xs:w-24 xs:h-24 md:w-24 md:h-28 object-cover rounded-xl group-hover:opacity-90 transition-opacity border border-border/10"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <Link to={item.designId.startsWith('m') ? `/material/${item.designId}` : `/design/${item.designId}`} className="block">
                          <h3 className="font-bold text-sm group-hover:text-primary transition-colors leading-tight">{item.name}</h3>
                        </Link>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-1 font-medium tracking-tight">by {item.shopName || 'Premium Tailor'}</p>
                    </div>
                  </div>

                  {/* Tailoring Details Selection - ~60% width on desktop */}
                  <div className="flex-1 space-y-3 md:border-l md:border-r border-border/10 md:px-6 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6">
                      {/* Order Type Selection */}
                      <div className="flex items-center justify-between gap-1 bg-muted/20 p-1 rounded-full border border-border/30">
                        <button
                          onClick={() => updateItemDetails(item.id, { orderType: 'stitching', withMaterial: false })}
                          className={cn(
                            "flex-1 h-8 text-[10px] font-black rounded-full transition-all flex items-center justify-center tracking-tight",
                            item.orderType === 'stitching'
                              ? "bg-white text-orange-600 shadow-sm border border-orange-100"
                              : "text-muted-foreground hover:bg-white/40"
                          )}
                        >
                          Stitching Only
                        </button>
                        {item.hasFabricOption !== false && (
                          <button
                            onClick={() => updateItemDetails(item.id, { orderType: 'stitching_and_fabric', withMaterial: true })}
                            className={cn(
                              "flex-1 h-8 text-[10px] font-black rounded-full transition-all flex items-center justify-center tracking-tight",
                              item.orderType === 'stitching_and_fabric'
                                ? "bg-white text-orange-600 shadow-sm border border-orange-100"
                                : "text-muted-foreground hover:bg-white/40"
                            )}
                          >
                            Stitching + Fabric
                          </button>
                        )}
                      </div>

                      {/* Measurement Mode Selection */}
                      <div className="flex items-center justify-between gap-1 bg-muted/20 p-1 rounded-full border border-border/30">
                        <button
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setShowMeasurementSelector(true);
                          }}
                          className={cn(
                            "flex-1 h-8 text-[10px] font-black rounded-full transition-all flex items-center justify-center tracking-tight",
                            item.measurementType === 'manual'
                              ? "bg-white text-orange-600 shadow-sm border border-orange-100"
                              : "text-muted-foreground hover:bg-white/40"
                          )}
                        >
                          <Ruler className="w-3 h-3 mr-1" />
                          {item.measurements ? 'Edit' : 'Add'} Sizes
                        </button>
                        <button
                          onClick={() => updateItemDetails(item.id, { measurementType: 'pickup', measurements: null })}
                          className={cn(
                            "flex-1 h-8 text-[10px] font-black rounded-full transition-all flex items-center justify-center tracking-tight",
                            item.measurementType === 'pickup'
                              ? "bg-white text-orange-600 shadow-sm border border-orange-100"
                              : "text-muted-foreground hover:bg-white/40"
                          )}
                        >
                          At Pickup
                        </button>
                      </div>
                    </div>

                    {/* Pickup Slot Selection - INLINE */}
                    {item.measurementType === 'pickup' && (
                      <div className="bg-orange-50/40 p-1 rounded-full border border-orange-100/50 flex items-center gap-2 max-w-sm">
                        <p className="text-[9px] font-black text-orange-800 uppercase tracking-widest shrink-0 flex items-center gap-1 pl-3">
                          <Clock className="w-2.5 h-2.5" /> Slot:
                        </p>
                        <div className="flex gap-1 flex-1 pr-1">
                          {["Morning", "Afternoon", "Evening"].map((slot) => {
                            const fullSlot = slot === "Morning" ? "Morning (9-12)" : slot === "Afternoon" ? "Afternoon (12-4)" : "Evening (4-7)";
                            return (
                              <button
                                key={slot}
                                onClick={() => updateItemDetails(item.id, {
                                  pickupSlot: { date: new Date().toISOString().split('T')[0], time: fullSlot }
                                })}
                                className={cn(
                                  "flex-1 text-[9px] h-6 rounded-full border transition-all font-bold",
                                  item.pickupSlot?.time === fullSlot
                                    ? "bg-white border-orange-500 text-orange-600 shadow-sm"
                                    : "bg-transparent border-transparent text-orange-800/40 hover:bg-white/40"
                                )}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Validation Warnings (Inline) */}
                    {(!item.measurementType || (item.measurementType === 'pickup' && !item.pickupSlot)) && (
                      <div className="flex items-center gap-2 p-1.5 rounded-lg bg-orange-50/50 border border-orange-100/30">
                        <AlertTriangle className="w-2.5 h-2.5 text-orange-600" />
                        <p className="text-[8px] font-bold text-orange-800/70">
                          Missing: {!item.measurementType ? 'measurement mode' : 'pickup slot'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quantity & Price Section - ~15% width on desktop */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:w-[15%] shrink-0">
                    <div className="flex items-center gap-2 bg-muted/40 rounded-xl p-0.5 border border-border/30">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-white rounded-lg"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </Button>
                      <span className="w-6 text-center font-bold text-[10px]">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-white rounded-lg"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-primary text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive hidden md:flex"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-[8px] text-muted-foreground leading-none">₹{item.price.toLocaleString()} each</p>
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
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{Math.round(totalPrice * 0.18).toLocaleString()}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total Amount</span>
                <span className="text-primary text-2xl">₹{Math.round(totalPrice * 1.18).toLocaleString()}</span>
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
      </div>

      <MeasurementSelector
        isOpen={showMeasurementSelector}
        onClose={() => setShowMeasurementSelector(false)}
        categoryId={selectedItem?.designId.startsWith('m') ? "material" : "design"}
        categoryName={selectedItem?.name || ""}
        onConfirm={(measurements) => {
          if (selectedItemId) {
            updateItemDetails(selectedItemId, {
              measurementType: 'manual',
              measurements
            });
          }
          setShowMeasurementSelector(false);
        }}
      />
    </Layout>
  );
}
