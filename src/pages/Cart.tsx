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

export default function Cart() {
  const { items, removeFromCart, updateQuantity, updateItemDetails, clearCart, totalItems, totalPrice } = useCart();
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card rounded-2xl p-3 sm:p-4 shadow-soft hover:shadow-lg transition-all border border-border/50 group">
                <div className="flex flex-col gap-3">
                  {/* Top Row: Image & Basic Info */}
                  <div className="flex gap-3 items-start">
                    <Link to={item.designId.startsWith('m') ? `/material/${item.designId}` : `/design/${item.designId}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 xs:w-24 xs:h-24 md:w-28 md:h-28 object-cover rounded-xl group-hover:opacity-90 transition-opacity border border-border/10"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <Link to={item.designId.startsWith('m') ? `/material/${item.designId}` : `/design/${item.designId}`} className="block truncate">
                          <h3 className="font-bold text-sm group-hover:text-primary transition-colors truncate leading-tight">{item.name}</h3>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-7 w-7 -mt-1 flex-shrink-0"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFromCart(item.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <p className="text-[10px] text-muted-foreground mb-1.5 font-medium tracking-tight">by {item.shopName || 'Premium Tailor'}</p>

                      {/* Summary Badges (Compact) */}
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        <Badge variant="secondary" className="text-[9px] h-4 py-0 bg-orange-50/80 text-orange-700 hover:bg-orange-50 border-none px-1.5 font-bold">
                          {item.orderType === 'stitching_and_fabric' ? 'Fabric+Stitching' : 'Stitching Only'}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] h-4 py-0 capitalize border-slate-100/50 text-slate-500 px-1.5 font-bold">
                          {item.measurementType === 'pickup' ? 'Home Pickup' : 'Manual Sizes'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Tailoring Details Selection - CHIP BASED & COMPACT */}
                  <div className="space-y-3 pt-3 border-t border-border/5 mb-[-4px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Order Type Selection - Chips */}
                      <div className="flex items-center justify-between gap-2 bg-muted/20 p-1 rounded-full border border-border/30 w-full">
                        <button
                          onClick={() => updateItemDetails(item.id, { orderType: 'stitching', withMaterial: false })}
                          className={cn(
                            "flex-1 h-7 text-[10px] font-black rounded-full transition-all flex items-center justify-center tracking-tight",
                            item.orderType === 'stitching'
                              ? "bg-white text-orange-600 shadow-sm border border-orange-100"
                              : "text-muted-foreground hover:bg-white/40"
                          )}
                        >
                          Stitching Only
                        </button>
                        <button
                          onClick={() => updateItemDetails(item.id, { orderType: 'stitching_and_fabric', withMaterial: true })}
                          className={cn(
                            "flex-1 h-7 text-[10px] font-black rounded-full transition-all flex items-center justify-center tracking-tight",
                            item.orderType === 'stitching_and_fabric'
                              ? "bg-white text-orange-600 shadow-sm border border-orange-100"
                              : "text-muted-foreground hover:bg-white/40"
                          )}
                        >
                          + Fabric
                        </button>
                      </div>

                      {/* Measurement Mode Selection - Chips */}
                      <div className="flex items-center justify-between gap-2 bg-muted/20 p-1 rounded-full border border-border/30 w-full">
                        <button
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setShowMeasurementSelector(true);
                          }}
                          className={cn(
                            "flex-1 h-7 text-[10px] font-black rounded-full transition-all flex items-center justify-center tracking-tight",
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
                            "flex-1 h-7 text-[10px] font-black rounded-full transition-all flex items-center justify-center tracking-tight",
                            item.measurementType === 'pickup'
                              ? "bg-white text-orange-600 shadow-sm border border-orange-100"
                              : "text-muted-foreground hover:bg-white/40"
                          )}
                        >
                          At Pickup
                        </button>
                      </div>
                    </div>

                    {/* Pickup Slot Selection - REDUCED HEIGHT */}
                    {item.measurementType === 'pickup' && (
                      <div className="bg-orange-50/30 p-2.5 rounded-2xl border border-orange-100 flex flex-col gap-2">
                        <p className="text-[9px] font-black text-orange-800 flex items-center gap-1.5 uppercase tracking-widest pl-1">
                          <Clock className="w-3 h-3" /> Pickup Slot
                        </p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {["Morning (9-12)", "Afternoon (12-4)", "Evening (4-7)"].map((slot) => (
                            <button
                              key={slot}
                              onClick={() => updateItemDetails(item.id, {
                                pickupSlot: { date: new Date().toISOString().split('T')[0], time: slot }
                              })}
                              className={cn(
                                "text-[10px] py-1.5 rounded-lg border transition-all font-black",
                                item.pickupSlot?.time === slot
                                  ? "bg-white border-orange-500 text-orange-600 shadow-sm scale-[1.02]"
                                  : "bg-transparent border-orange-200/30 text-orange-800/40 hover:border-orange-300"
                              )}
                            >
                              {slot.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Validation Warnings (Compact) */}
                    {(!item.measurementType || (item.measurementType === 'pickup' && !item.pickupSlot)) && (
                      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-orange-50 border border-orange-100/50">
                        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                          <AlertTriangle className="w-3 h-3 text-orange-600" />
                        </div>
                        <p className="text-[9px] font-bold text-orange-800/70 leading-none">
                          Missing: {!item.measurementType ? 'measurement mode' : 'pickup slot selection'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quantity & Price Row (Tighter) */}
                  <div className="pt-3 border-t border-border/10 flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-1 border border-border/30">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white rounded-lg shadow-sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-white"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-[9px] text-muted-foreground line-height-1 mt-[-2px]">₹{item.price.toLocaleString()} each</p>
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

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo Code"
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button variant="outline" size="sm" className="font-bold">Apply</Button>
                </div>
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
