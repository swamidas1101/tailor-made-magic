import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { orderService, Order } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingBag,
    Clock,
    CheckCircle2,
    Package,
    ChevronRight,
    ArrowLeft,
    IndianRupee,
    Calendar,
    Ruler,
    Truck,
    Ticket,
    Phone,
    MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CustomerOrders() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchOrders = async () => {
            try {
                const data = await orderService.getUserOrders(user.uid);
                setOrders(data);
            } catch (error) {
                console.error("Failed to load orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
                <Skeleton className="h-10 w-48 mb-8" />
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-2xl w-full" />)}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="bg-white border-b border-border/50 sticky top-0 z-30 transition-all">
                <div className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            onClick={() => navigate("/")}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-xl font-display font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            My Orders
                        </h1>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-100">
                            Total {orders.length} Orders
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Premium Hero Section for Desktop */}
            <div className="bg-slate-900 border-b border-slate-800 hidden md:block overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10 flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-orange-500 mb-2">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Order History</span>
                        </div>
                        <h2 className="text-4xl font-display font-bold text-white">Track Your Journey</h2>
                        <p className="text-slate-400 max-w-md">
                            Manage your tailored collections, track deliveries, and relive your style moments.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center min-w-[140px]">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ongoing</p>
                            <p className="text-3xl font-black text-white">{orders.filter(o => o.status !== 'delivered').length}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center min-w-[140px]">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Delivered</p>
                            <p className="text-3xl font-black text-orange-500">{orders.filter(o => o.status === 'delivered').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl md:grid md:grid-cols-12 gap-8">
                {/* Sidebar for stats on desktop */}
                <div className="hidden md:block col-span-3 space-y-4">
                    <Card className="rounded-2xl border-border/40 shadow-soft sticky top-24 overflow-hidden">
                        <CardHeader className="bg-muted/5 pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">My Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Order Stats</p>
                                    <p className="text-[10px] text-muted-foreground">Tracking your styles</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-xs font-bold h-9 hover:bg-orange-50 hover:text-orange-600"
                                onClick={() => navigate("/account")}
                            >
                                <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Account
                            </Button>
                            <Button
                                variant="default"
                                className="w-full text-xs font-bold h-10 bg-orange-500 hover:bg-orange-600"
                                onClick={() => navigate("/categories")}
                            >
                                Explore More
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12 md:col-span-9">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
                            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-10 h-10 text-orange-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
                            <p className="text-muted-foreground mb-8">Ready to start your first tailoring journey?</p>
                            <Button onClick={() => navigate("/categories")} className="rounded-xl px-8">
                                Browse Designs
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <Card key={order.id} className="rounded-2xl border-border/40 shadow-soft overflow-hidden hover:border-orange-200 transition-colors">
                                    <CardHeader className="bg-muted/30 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-white">
                                                        #{order.id?.slice(-8).toUpperCase()}
                                                    </Badge>
                                                    <Badge className={cn("text-[10px] font-bold",
                                                        order.status === 'delivered' ? 'bg-green-500' :
                                                            order.status === 'processing' ? 'bg-blue-500' : 'bg-orange-500'
                                                    )}>
                                                        {order.status?.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm font-bold mt-1">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Amount</p>
                                                <p className="text-lg font-black text-orange-600">₹{order.totalFinalAmount?.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 border-t border-border/20">
                                        <div className="space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4">
                                                    <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden relative border border-border/10 flex-shrink-0">
                                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold text-sm">{item.name}</h4>
                                                            <p className="text-xs font-bold">₹{item.price.toLocaleString()}</p>
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.shopName}</p>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <span className="text-[9px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-full font-bold">
                                                                {item.orderType === 'stitching_and_fabric' ? 'Stitching + Fabric' : 'Stitching Only'}
                                                            </span>
                                                            <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-bold capitalize">
                                                                {(item.measurementType || order.measurementType)} Details
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-white pt-2">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-between text-sm group"
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setViewDialogOpen(true);
                                            }}
                                        >
                                            View Details & Tracking
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Tracking & Detail Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white rounded-2xl shadow-2xl border-none">
                    {selectedOrder && (
                        <div className="flex flex-col h-full max-h-[90vh]">
                            <DialogHeader className="p-6 border-b border-border/40 bg-muted/5">
                                <DialogTitle className="text-lg font-bold font-display flex items-center justify-between">
                                    <span>Order Details</span>
                                    <Badge className="bg-primary hover:bg-primary/90 text-[10px] font-bold">
                                        {selectedOrder.status?.toUpperCase()}
                                    </Badge>
                                </DialogTitle>
                                <DialogDescription className="sr-only">
                                    Detailed view of your order including items, tracking status, and shipping information.
                                </DialogDescription>
                            </DialogHeader>

                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-8">
                                    {/* Tracking Stepper */}
                                    <div className="relative pt-4 px-2">
                                        <div className="flex justify-between mb-8 relative z-10">
                                            {[
                                                { id: 'pending', icon: ShoppingBag, label: 'Placed' },
                                                { id: 'processing', icon: Package, label: 'Processing' },
                                                { id: 'shipped', icon: Truck, label: 'Shipped' },
                                                { id: 'delivered', icon: CheckCircle2, label: 'Delivered' }
                                            ].map((step, i, arr) => {
                                                const statuses = ['pending', 'processing', 'shipped', 'delivered'];
                                                const currentIdx = statuses.indexOf(selectedOrder.status);
                                                const isActive = i <= currentIdx;

                                                return (
                                                    <div key={step.id} className="flex flex-col items-center gap-2 group">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
                                                            isActive ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
                                                        )}>
                                                            <step.icon className="w-5 h-5" />
                                                        </div>
                                                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", isActive ? "text-foreground" : "text-muted-foreground")}>
                                                            {step.label}
                                                        </span>
                                                        {i < arr.length - 1 && (
                                                            <div className={cn(
                                                                "absolute h-[2px] w-[calc(100%/3-20%)] top-5 left-[calc(100%/6+10%+(100%/3)*" + i + ")] pointer-events-none",
                                                                i < currentIdx ? "bg-orange-500" : "bg-muted"
                                                            )} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Items</h4>
                                        <div className="space-y-4">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="space-y-3">
                                                    <div className="flex gap-4 p-4 rounded-xl bg-orange-50/20 border border-orange-100/50">
                                                        <img src={item.image} className="w-20 h-24 object-cover rounded-lg" alt="" />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h5 className="font-bold text-base">{item.name}</h5>
                                                                    <p className="text-xs text-muted-foreground mt-1">{item.shopName}</p>
                                                                </div>
                                                                <p className="font-bold text-base">₹{item.price.toLocaleString()}</p>
                                                            </div>
                                                            <div className="mt-4 flex flex-wrap gap-2">
                                                                <Badge variant="secondary" className="text-[10px] bg-white">{item.orderType === 'stitching_and_fabric' ? 'Stitching + Fabric' : 'Stitching Only'}</Badge>
                                                                <Badge variant="outline" className="text-[10px] bg-white capitalize">{(item.measurementType || selectedOrder.measurementType)} Details</Badge>
                                                                {item.pickupSlot && (
                                                                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-100">Slot: {item.pickupSlot.time}</Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Per-item measurements if exists */}
                                                    {(item.measurements || (idx === 0 && selectedOrder.measurements)) && (
                                                        <div className="mx-4 p-3 rounded-lg border border-dashed border-orange-200 bg-orange-50/10">
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                                                                {Object.entries(item.measurements || selectedOrder.measurements || {}).map(([k, v]) => (
                                                                    <div key={k} className="flex flex-col">
                                                                        <span className="text-[9px] text-muted-foreground uppercase">{k}</span>
                                                                        <span className="text-[11px] font-bold">{v as string}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Measurements */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" /> Additional Info
                                            </h4>
                                            <div className="p-4 rounded-xl border border-border/50 bg-muted/5">
                                                <p className="text-xs font-bold text-orange-600 mb-2 uppercase tracking-tight">Main Pickup Slot</p>
                                                {selectedOrder.pickupSlot ? (
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-bold">{selectedOrder.pickupSlot.time}</p>
                                                        <p className="text-[10px] text-muted-foreground">{selectedOrder.pickupSlot.date}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">No slot scheduled</p>
                                                )}
                                                {selectedOrder.measurementType && (
                                                    <p className="text-[10px] mt-3 font-medium text-slate-500 italic">
                                                        * Details for {selectedOrder.items.length} item(s) provided.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5" /> Shipping Address
                                            </h4>
                                            <div className="p-4 rounded-xl border border-border/50 bg-muted/5 h-full">
                                                <p className="text-xs font-bold">{selectedOrder.shippingAddress?.fullName}</p>
                                                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                                                    {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.landmark && <>{selectedOrder.shippingAddress.landmark}, </>}
                                                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}
                                                </p>
                                                <p className="text-[11px] font-bold mt-3 inline-flex items-center gap-1.5 text-foreground/70">
                                                    <Phone className="w-3 h-3 text-orange-500" /> {selectedOrder.shippingAddress?.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-orange-950/40 mb-4">Payment Summary</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-orange-900/60">Order Total</span>
                                                <span className="font-medium text-orange-900">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-orange-900/60">Delivery Fee</span>
                                                <span className={cn("font-medium", selectedOrder.deliveryFee === 0 ? "text-green-600 font-bold" : "text-orange-900")}>
                                                    {selectedOrder.deliveryFee === 0 ? "FREE" : `₹${selectedOrder.deliveryFee}`}
                                                </span>
                                            </div>
                                            {selectedOrder.discountAmount > 0 && (
                                                <div className="flex justify-between text-sm text-green-700 font-bold">
                                                    <span className="flex items-center gap-1.5"><Ticket className="w-4 h-4" /> Discount ({selectedOrder.promoCode})</span>
                                                    <span>- ₹{selectedOrder.discountAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <Separator className="bg-orange-200/50" />
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold text-orange-900/40">Paid via UPI / Razorpay</p>
                                                    <p className="text-sm font-black text-orange-950 uppercase tracking-tighter">Amount Paid</p>
                                                </div>
                                                <div className="text-2xl font-black text-orange-600 tracking-tighter">
                                                    ₹{selectedOrder.totalFinalAmount?.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>

                            <DialogFooter className="p-4 border-t border-border/40 bg-muted/5 gap-3">
                                <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="flex-1 h-12 rounded-xl">
                                    Close Details
                                </Button>
                                <Button className="flex-1 h-12 rounded-xl shadow-lg border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all">
                                    Need Help? Support
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
