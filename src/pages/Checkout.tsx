import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { IndianRupee, MapPin, Plus, Check, Loader2, ArrowRight, ArrowLeft, ShieldCheck, Ticket, CreditCard, Lock, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { userService, Address } from "@/services/userService";
import { orderService, Order, OrderItem } from "@/services/orderService";
import { promoCodeService, PromoCode } from "@/services/promoCodeService";
import { settingsService, AppSettings } from "@/services/settingsService";
import { handleCustomError, showSuccess, showInfo } from "@/lib/toastUtils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Declare Razorpay for TypeScript
declare global {
    interface Window {
        Razorpay: any;
    }
}

// Mini Payment Modal Component - Now used as a "Processing" overlay or status indicator
function PaymentModal({ isOpen, onClose, onConfirm, amount }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, amount: number }) {
    // This component is now deprecated in favor of real Razorpay popup, 
    // but kept as a fallback or for the "Secure Payment" branding before redirect
    return null;
}

export default function Checkout() {
    const { user, loading: authLoading } = useAuth();
    const { items: cartItems, clearCart, totalPrice: cartSubtotal } = useCart();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [loading, setLoading] = useState(true);
    const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
    const [availablePromos, setAvailablePromos] = useState<PromoCode[]>([]);
    const [showPromoDropdown, setShowPromoDropdown] = useState(false);

    const DELIVERY_FEE = 99;

    useEffect(() => {
        if (cartItems.length === 0 && !loading) {
            navigate("/categories");
            return;
        }

        if (!authLoading && !user) {
            showInfo("Please login to proceed with checkout.");
            navigate("/auth", { state: { from: "/checkout" } });
            return;
        }

        if (user) {
            loadInitialData();
        } else {
            setLoading(false);
        }
    }, [user, authLoading, navigate, cartItems.length]);

    async function loadInitialData() {
        if (!user) return;
        setLoading(true);
        try {
            const [savedAddresses, promos, settings] = await Promise.all([
                userService.getSavedAddresses(user.uid),
                promoCodeService.getActivePromos(),
                settingsService.getSettings()
            ]);

            setAddresses(savedAddresses);
            setAvailablePromos(promos);
            setAppSettings(settings);

            const defaultAddr = savedAddresses.find(a => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            } else if (savedAddresses.length > 0) {
                setSelectedAddressId(savedAddresses[0].id);
            }
        } catch (error) {
            console.error("Failed to load initial data:", error);
            handleCustomError(error, "Failed to load checkout details.");
        } finally {
            setLoading(false);
        }
    }

    async function loadPromos() {
        try {
            const promos = await promoCodeService.getActivePromos();
            setAvailablePromos(promos);
        } catch (error) {
            console.error("Failed to load promos:", error);
        }
    }

    async function loadAddresses() {
        if (!user) return;
        try {
            const savedAddresses = await userService.getSavedAddresses(user.uid);
            setAddresses(savedAddresses);
            const defaultAddr = savedAddresses.find(a => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            } else if (savedAddresses.length > 0) {
                setSelectedAddressId(savedAddresses[0].id);
            }
        } catch (error) {
            handleCustomError(error, "Failed to load addresses.");
        } finally {
            setLoading(false);
        }
    }

    const calculateSubtotal = () => cartSubtotal;

    const calculateDiscount = () => {
        if (!appliedPromo) return 0;
        const subtotal = calculateSubtotal();
        if (appliedPromo.discountType === 'fixed') {
            return appliedPromo.value;
        } else if (appliedPromo.discountType === 'percentage') {
            return Math.round((subtotal * appliedPromo.value) / 100);
        }
        return 0;
    };

    const getDeliveryFee = () => {
        if (appliedPromo?.discountType === 'free_delivery' || appliedPromo?.code === 'FREEDEL') {
            return 0;
        }
        return appSettings?.deliveryCharge || DELIVERY_FEE;
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const discount = calculateDiscount();
        const delivery = getDeliveryFee();
        return subtotal - discount + delivery;
    };

    const handleApplyPromo = async () => {
        if (!promoCode) return;
        const subtotal = calculateSubtotal();

        if (promoCode.toUpperCase() === "FREEDEL") {
            setAppliedPromo({
                code: "FREEDEL",
                discountType: "free_delivery",
                value: 0,
                minOrderAmount: 0,
                isActive: true,
                expiryDate: "2099-12-31",
                usedCount: 0,
                description: "Free Delivery Special"
            });
            showSuccess("Free Delivery applied!");
            return;
        }

        try {
            const result = await promoCodeService.validatePromo(promoCode, subtotal);
            if (result.valid && result.promo) {
                setAppliedPromo(result.promo);
                showSuccess("Promo code applied successfully!");
            } else {
                handleCustomError({ code: "invalid-promo", message: result.message }, "Invalid promo code");
            }
        } catch (error) {
            handleCustomError(error, "Failed to apply promo code.");
        }
    };

    const selectPromo = (code: string) => {
        setPromoCode(code);
        setShowPromoDropdown(false);
        // We need to use the code directly because state update is async
        handleApplySelectedPromo(code);
    };

    const handleApplySelectedPromo = async (code: string) => {
        const subtotal = calculateSubtotal();
        try {
            const result = await promoCodeService.validatePromo(code, subtotal);
            if (result.valid && result.promo) {
                setAppliedPromo(result.promo);
                showSuccess("Promo code applied successfully!");
            } else {
                handleCustomError({ code: "invalid-promo", message: result.message }, "Invalid promo code");
            }
        } catch (error) {
            handleCustomError(error, "Failed to apply promo code.");
        }
    };

    const handlePlaceOrder = async () => {
        const incompleteItems = cartItems.filter(item =>
            !item.measurementType ||
            (item.measurementType === 'pickup' && !item.pickupSlot) ||
            (item.measurementType === 'manual' && (!item.measurements || Object.keys(item.measurements).length === 0))
        );

        if (incompleteItems.length > 0) {
            handleCustomError(
                { code: "missing-details", message: "Some items are missing tailoring details." },
                "Please complete all items before placing order."
            );
            // Scroll to items section
            const itemsElement = document.getElementById('review-items-section');
            if (itemsElement) itemsElement.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (!user || cartItems.length === 0 || !selectedAddressId) {
            if (!selectedAddressId) showInfo("Please select a delivery address.");
            return;
        }

        const address = addresses.find(a => a.id === selectedAddressId);
        if (!address) {
            showInfo("Selected address not found");
            return;
        }

        if (!appSettings?.razorpayKey || appSettings.razorpayKey.includes("dummy")) {
            handleCustomError(
                { code: "missing-config", message: "Razorpay Key ID is not configured. Please add your key in Admin Settings." },
                "Checkout Error"
            );
            return;
        }

        const finalAmount = calculateTotal();

        // Ensure Razorpay script is loaded
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                if (window.Razorpay) {
                    resolve(true);
                    return;
                }
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        try {
            setIsPlacingOrder(true);

            console.log("Initializing Razorpay with Key:", appSettings.razorpayKey.substring(0, 8) + "...");

            const isLoaded = await loadRazorpayScript();
            if (!isLoaded || !window.Razorpay) {
                console.error("Razorpay SDK Fail: Loaded?", isLoaded, "Window.Razorpay?", !!window.Razorpay);
                handleCustomError(
                    { code: "script-load-error", message: "Could not load Razorpay SDK. Please check your internet connection or disable ad-blockers." },
                    "Payment Error"
                );
                setIsPlacingOrder(false);
                return;
            }

            // Initialize Razorpay
            const options = {
                key: appSettings.razorpayKey,
                amount: Math.round(finalAmount * 100), // Amount in paise, ensured integer
                currency: "INR",
                name: "Tailor Made Magic",
                description: "Order Payment",
                handler: async function (response: any) {
                    console.log("Payment successful, creation order...");
                    await processOrderCreation(response.razorpay_payment_id, address);
                },
                prefill: {
                    name: user.displayName || address.fullName,
                    email: user.email || "",
                    contact: address.phone
                },
                notes: {
                    userId: user.uid,
                    orderItemsCount: cartItems.length
                },
                theme: {
                    color: "#F97316"
                },
                modal: {
                    ondismiss: function () {
                        console.log("Razorpay modal dismissed");
                        setIsPlacingOrder(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                console.error("Payment Failed:", response.error);
                handleCustomError(response.error, "Payment Failed");
                setIsPlacingOrder(false);
            });

            rzp.open();
        } catch (error) {
            console.error("Razorpay Initialization Error:", error);
            handleCustomError(error, "Failed to initialize payment gateway. Please check your admin settings.");
            setIsPlacingOrder(false);
        }
    };

    const processOrderCreation = async (paymentId: string, address: Address) => {
        setIsPlacingOrder(true);

        try {
            const subtotal = calculateSubtotal();
            const discount = calculateDiscount();
            const delivery = getDeliveryFee();
            const total = calculateTotal();

            // Sanitize items - Ensure no undefined values
            const orderItems: OrderItem[] = cartItems.map(item => ({
                designId: item.designId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size || "custom",
                withMaterial: item.withMaterial,
                image: item.image,
                orderType: item.orderType || (item.withMaterial ? 'stitching_and_fabric' : 'stitching'),
                shopName: item.shopName || null,
                measurementType: item.measurementType || null,
                measurements: item.measurements || null,
                pickupSlot: item.pickupSlot || null,
                tailorId: item.tailorId || null,
                estimatedDays: item.estimatedDays || 7
            }));

            // Collect all unique tailorIds for easier querying
            const tailorIds = Array.from(new Set(orderItems.map(item => item.tailorId).filter(id => !!id))) as string[];

            const orderData: Omit<Order, "id" | "createdAt"> = {
                userId: user!.uid,
                items: orderItems,
                totalAmount: subtotal,
                deliveryFee: delivery,
                discountAmount: discount,
                totalFinalAmount: total,
                status: "pending",
                shippingAddress: {
                    fullName: address.fullName,
                    phone: address.phone,
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zipCode: address.zipCode,
                    landmark: address.landmark || null,
                    label: address.label || "Home"
                },
                paymentStatus: "paid",
                paymentMethod: "Razorpay",
                // For top level backwards compatibility/easy access
                measurementType: orderItems[0]?.measurementType || 'manual',
                measurements: orderItems[0]?.measurements || null,
                pickupSlot: orderItems[0]?.pickupSlot || null,
                promoCode: appliedPromo?.code || null,
                tailorId: orderItems[0]?.tailorId || null,
                tailorIds: tailorIds,
                razorpayPaymentId: paymentId
            };

            // Fix for undefined fields in Firestore
            const sanitizedData = JSON.parse(JSON.stringify(orderData));

            await orderService.createOrder(sanitizedData);
            clearCart();

            showSuccess("Payment Successful! Order placed.");
            showInfo("Track your order in 'My Orders'");

            navigate("/account", { state: { orderSuccess: true } });
        } catch (error) {
            handleCustomError(error, "Failed to save order after payment. Please contact support with payment ID: " + paymentId);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (loading || authLoading) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                    <p className="text-muted-foreground animate-pulse">Setting up secure checkout...</p>
                </div>
            </Layout>
        );
    }

    if (cartItems.length === 0) return null;

    return (
        <Layout>
            <div className="container px-4 py-8 max-w-6xl mx-auto">
                <div className="mb-8 flex flex-col gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-display font-bold">Secure Checkout</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            Complete your order to start the magic
                            <span className="text-xs text-muted-foreground/40">•</span>
                            <Link to="/cart" className="text-orange-600 hover:text-orange-700 font-bold hover:underline">Edit Cart</Link>
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-[1fr_350px] lg:grid-cols-[1fr_380px] gap-4 lg:gap-8 items-start">
                    <div className="space-y-6">
                        {/* Delivery Address Section */}
                        <section className="bg-card rounded-2xl border border-border overflow-hidden p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <h2 className="text-xl font-bold">Delivery Address</h2>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link to="/account/addresses">Manage Addresses</Link>
                                </Button>
                            </div>

                            {addresses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
                                    {addresses.map((addr) => (
                                        <button
                                            key={addr.id}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all relative ${selectedAddressId === addr.id
                                                ? "border-orange-500 bg-orange-50/50"
                                                : "border-border hover:border-orange-200"
                                                }`}
                                        >
                                            {selectedAddressId === addr.id && (
                                                <Badge className="absolute top-3 right-3 bg-orange-500">Selected</Badge>
                                            )}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold">{addr.label}</span>
                                                {addr.isDefault && (
                                                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase">Default</span>
                                                )}
                                            </div>
                                            <p className="font-medium text-sm">{addr.fullName}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                {addr.street}, {addr.landmark && addr.landmark + ","} {addr.city}, {addr.state} - {addr.zipCode}
                                            </p>
                                            <p className="text-xs font-semibold mt-2">{addr.phone}</p>
                                        </button>
                                    ))}
                                    <Link
                                        to="/account/addresses"
                                        className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-border hover:border-orange-300 hover:bg-orange-50/20 transition-all text-muted-foreground hover:text-orange-600"
                                    >
                                        <Plus className="w-6 h-6 mb-1" />
                                        <span className="text-sm font-medium">Add New Address</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground mb-4">You haven't saved any addresses yet.</p>
                                    <Button asChild>
                                        <Link to="/account/addresses"><Plus className="w-4 h-4 mr-2" /> Add Address</Link>
                                    </Button>
                                </div>
                            )}
                        </section>

                        {/* Order Details Section */}
                        <section className="bg-card rounded-2xl border border-border overflow-hidden p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6" id="review-items-section">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-orange-600" />
                                </div>
                                <h2 className="text-xl font-bold">Review Items ({cartItems.length})</h2>
                            </div>

                            <div className="space-y-4">
                                {cartItems.map((item, idx) => {
                                    const isComplete = item.measurementType && (
                                        (item.measurementType === 'pickup' && item.pickupSlot) ||
                                        (item.measurementType === 'manual' && item.measurements && Object.keys(item.measurements).length > 0)
                                    );

                                    return (
                                        <div key={item.id} className={`flex gap-4 p-4 rounded-xl border transition-all ${isComplete ? "bg-muted/20 border-border/40" : "bg-red-50/50 border-red-200 ring-1 ring-red-100"
                                            }`}>
                                            <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted relative">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                {!isComplete && (
                                                    <div className="absolute inset-x-0 bottom-0 bg-red-600 text-white text-[8px] font-black py-0.5 text-center uppercase">Incomplete</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-base">{item.name}</h3>
                                                        {item.shopName && <p className="text-xs text-muted-foreground">Tailored by: {item.shopName}</p>}
                                                    </div>
                                                    <p className="font-bold text-base">₹{item.price.toLocaleString()}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <Badge variant="outline" className={`text-[10px] ${!item.orderType ? "text-red-600 border-red-200" : "bg-muted/30"}`}>
                                                        {item.orderType === 'stitching_and_fabric' ? 'Stitching + Fabric' : 'Stitching Only'}
                                                    </Badge>
                                                    <Badge variant="outline" className={`text-[10px] capitalize ${!item.measurementType ? "text-red-600 border-red-200 bg-red-50" : "bg-muted/30"}`}>
                                                        {!item.measurementType ? "Missing Details" :
                                                            item.measurementType === 'pickup' ? 'Measure at Pickup' : 'Custom Measurements'}
                                                    </Badge>
                                                    {item.pickupSlot && (
                                                        <Badge variant="outline" className="text-[10px] bg-orange-50 text-orange-700 border-orange-200">
                                                            Slot: {item.pickupSlot.time}
                                                        </Badge>
                                                    )}
                                                    {item.measurementType === 'pickup' && !item.pickupSlot && (
                                                        <Badge variant="outline" className="text-[10px] text-red-600 border-red-200 bg-red-50">Missing Time Slot</Badge>
                                                    )}
                                                </div>

                                                {!isComplete && (
                                                    <div className="mt-3 flex justify-end">
                                                        <Button
                                                            variant="link"
                                                            className="text-orange-600 h-auto p-0 text-xs font-bold font-display"
                                                            asChild
                                                        >
                                                            <Link to="/cart">
                                                                Fix Details <ArrowRight className="w-3 h-3 ml-1" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-card rounded-2xl border border-border p-5 lg:p-6 shadow-md md:sticky md:top-24">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Items Subtotal</span>
                                    <span className="font-medium">₹{calculateSubtotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Pickup & Delivery</span>
                                    <div className="flex items-center gap-1.5">
                                        {getDeliveryFee() === 0 && <span className="text-xs line-through text-muted-foreground">₹{DELIVERY_FEE}</span>}
                                        <span className={getDeliveryFee() === 0 ? "text-green-600 font-bold" : "font-medium"}>
                                            {getDeliveryFee() === 0 ? "FREE" : `₹${DELIVERY_FEE}`}
                                        </span>
                                    </div>
                                </div>

                                {appliedPromo && (
                                    <div className="flex justify-between text-sm text-green-600 font-medium">
                                        <span>Discount ({appliedPromo.code})</span>
                                        <span>- ₹{calculateDiscount().toLocaleString()}</span>
                                    </div>
                                )}

                                <Separator />

                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-bold text-lg">Total Amount</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black text-orange-600 flex items-center">
                                            <IndianRupee className="w-5 h-5" />
                                            {calculateTotal().toLocaleString()}
                                        </span>
                                        <p className="text-[10px] text-muted-foreground italic">inclusive of all taxes</p>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Code Input */}
                            <div className="mb-8 relative promo-container">
                                <div className="flex gap-2 relative items-center">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-transform duration-200">
                                        <Ticket className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Promo Code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        onFocus={() => setShowPromoDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowPromoDropdown(false), 200)}
                                        disabled={!!appliedPromo}
                                        className="pl-9 pr-3 py-2.5 w-full text-xs sm:text-sm border-2 border-border rounded-xl bg-background outline-none focus:border-orange-400 transition-all uppercase font-semibold placeholder:text-muted-foreground/50"
                                    />
                                    {appliedPromo ? (
                                        <button
                                            onClick={() => { setAppliedPromo(null); setPromoCode(""); }}
                                            className="text-destructive font-black text-[10px] uppercase px-2 hover:opacity-80 transition-opacity"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleApplyPromo}
                                            disabled={!promoCode}
                                            className="rounded-lg font-bold text-xs h-9 px-4 shadow-sm"
                                        >
                                            Apply
                                        </Button>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {showPromoDropdown && !appliedPromo && availablePromos.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                            className="absolute left-0 right-0 top-full mt-2 bg-white border border-border rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden max-h-56 overflow-y-auto"
                                        >
                                            <div className="px-3 py-1.5 border-b border-border bg-orange-50/30">
                                                <p className="text-[9px] uppercase font-black text-orange-800/60 tracking-widest">Available Offers</p>
                                            </div>
                                            {availablePromos.map((promo) => (
                                                <button
                                                    key={promo.id}
                                                    onClick={() => selectPromo(promo.code)}
                                                    className="w-full text-left p-2.5 hover:bg-orange-50 transition-colors border-b border-border/50 last:border-0 group"
                                                >
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <span className="font-black text-sm text-orange-600 group-hover:scale-[1.02] transition-transform origin-left">{promo.code}</span>
                                                        <Badge variant="secondary" className="bg-green-50 text-green-700 text-[9px] border-none font-black h-4 px-1.5">
                                                            {promo.discountType === 'percentage' ? `${promo.value}% OFF` :
                                                                promo.discountType === 'fixed' ? `₹${promo.value} OFF` : 'FREE DELIVERY'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[9px] text-muted-foreground/80 font-medium leading-tight line-clamp-1">{promo.description}</p>
                                                    {promo.minOrderAmount > 0 && (
                                                        <p className="text-[8px] text-orange-500/70 mt-1 font-bold uppercase tracking-tight">Orders above ₹{promo.minOrderAmount}</p>
                                                    )}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!appliedPromo && !showPromoDropdown && (
                                    <p className="text-[10px] text-muted-foreground mt-2 pl-1">
                                        Try <span className="font-bold text-orange-600 cursor-pointer" onClick={() => selectPromo("FREEDEL")}>FREEDEL</span> for free pickup & delivery
                                    </p>
                                )}
                            </div>

                            <Button
                                className="w-full rounded-2xl py-6 text-lg font-bold shadow-gold-glow hover:shadow-gold-glow-lg transition-all"
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder || !selectedAddressId}
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Review & Pay <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Tailo Secure Checkout - Powered by Razorpay</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
}
