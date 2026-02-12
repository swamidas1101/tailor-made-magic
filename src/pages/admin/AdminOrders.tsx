import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, CheckCircle2, XCircle, Eye, Printer, Download, ShoppingBag, Clock, ArrowRight, User, MapPin, Phone, Mail, IndianRupee, Package, Calendar, Tag, ChevronRight, Gem, AlertTriangle, Scale, History, FileText, Truck, LayoutList, Ruler, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminService } from "@/services/adminService";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("pending")) return "text-amber-600 bg-amber-50 border-amber-200";
    if (s.includes("process")) return "text-blue-600 bg-blue-50 border-blue-200";
    if (s.includes("shipped")) return "text-purple-600 bg-purple-50 border-purple-200";
    if (s.includes("delivered")) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  const getStatusDot = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("pending")) return "bg-amber-500";
    if (s.includes("process")) return "bg-blue-500";
    if (s.includes("shipped")) return "bg-purple-500";
    if (s.includes("delivered")) return "bg-emerald-500";
    return "bg-slate-500";
  }

  const stats = [
    { label: "Active Orders", value: orders.filter(o => o.status !== "delivered").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Revenue", value: `₹${(orders.reduce((acc, o) => acc + (o.totalFinalAmount || o.total || 0), 0) / 1000).toFixed(1)}k`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50" },
    { label: "High Priority", value: "05", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Completed", value: orders.filter(o => o.status === "delivered").length, icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="w-full px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Package className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Fulfillment Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Order Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Track and manage customer orders and shipments
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 border-amber-200 text-amber-700 hover:bg-amber-50 font-bold uppercase tracking-wider text-xs">
                <Download className="w-3.5 h-3.5 mr-2" /> Export
              </Button>
              <Button onClick={fetchOrders} size="sm" className="h-9 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 font-bold uppercase tracking-wider text-xs">
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 pt-8 space-y-8">

        {/* Stats Cards - Low Profile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border border-border/40 flex items-center gap-4 bg-white shadow-sm hover:border-amber-200/50 transition-colors">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-foreground tracking-tight tabular-nums">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls - Integrated Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center bg-muted/10 p-2 rounded-xl border border-border/40">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search Order ID, Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 border-none bg-transparent focus-visible:ring-0 text-sm"
            />
          </div>
          <div className="h-6 w-px bg-border/50 hidden lg:block" />
          <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full lg:w-auto">
            <TabsList className="bg-transparent p-0 h-9">
              <TabsTrigger value="all" className="text-[10px] font-bold rounded-lg px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="pending" className="text-[10px] font-bold rounded-lg px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending</TabsTrigger>
              <TabsTrigger value="processing" className="text-[10px] font-bold rounded-lg px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">Processing</TabsTrigger>
              <TabsTrigger value="delivered" className="text-[10px] font-bold rounded-lg px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Clean Order Table - High Density */}
        <Card className="border-border/40 shadow-sm overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/20 border-b border-border/40">
                  <th className="text-left py-3 px-6 font-bold text-muted-foreground uppercase text-[10px] tracking-wider w-32">ID</th>
                  <th className="text-left py-3 px-6 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Customer</th>
                  <th className="text-left py-3 px-6 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Tailor/Shop</th>
                  <th className="text-left py-3 px-6 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Status</th>
                  <th className="text-right py-3 px-6 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Total</th>
                  <th className="px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="py-4 px-6"><div className="h-8 bg-muted/20 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground italic">No orders found matching criteria.</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-amber-50/10 hover:shadow-[inset_2px_0_0_0_#d97706] transition-all cursor-default">
                      <td className="py-3 px-6 font-mono text-xs font-medium text-muted-foreground group-hover:text-foreground">#{order.id.split('-')[1]}</td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-muted/30 flex items-center justify-center text-[10px] font-bold text-muted-foreground/70 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                            {order.customerName.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground text-xs">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-foreground">{order.items[0]?.shopName || order.shopName || "Premium Boutique"}</span>
                          <span className="text-[10px] text-muted-foreground">{order.items.length} item(s)</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(order.status))} />
                          <span className="text-xs font-medium capitalize text-muted-foreground">{order.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-right font-bold text-foreground/90 text-xs">
                        ₹{order.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => {
                            setSelectedOrder(order);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Clean Order Detail Sheet/Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="w-[95vw] max-w-5xl p-0 overflow-hidden bg-white rounded-2xl shadow-2xl border-none">
            {selectedOrder && (
              <div className="flex flex-col h-full max-h-[90vh]">
                <DialogHeader className="p-4 sm:p-6 border-b border-border/40 bg-muted/5 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-1">
                      <DialogTitle className="text-lg sm:text-xl font-bold font-display tracking-tight">
                        Order #{selectedOrder.id.split('-')[1]?.toUpperCase() || selectedOrder.id.substring(0, 8).toUpperCase()}
                      </DialogTitle>
                      <Badge variant="outline" className={cn("text-[9px] sm:text-[10px] font-bold uppercase tracking-wider py-0.5 px-2", getStatusColor(selectedOrder.status))}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {selectedOrder.date}</span>
                      <span className="hidden sm:block w-1 h-1 bg-muted-foreground/30 rounded-full" />
                      <span className="flex items-center gap-1.5 font-bold text-amber-600"><ShoppingBag className="w-3.5 h-3.5" /> {selectedOrder.items.length} items</span>
                      <span className="hidden sm:block w-1 h-1 bg-muted-foreground/30 rounded-full" />
                      <span className="flex items-center gap-1.5 font-bold text-foreground">Total: ₹{(selectedOrder.totalFinalAmount || selectedOrder.total || 0).toLocaleString()}</span>
                    </div>
                    <DialogDescription className="sr-only">
                      Full details and management options for Order #{selectedOrder.id}.
                    </DialogDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto shrink-0 transition-all">
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none h-9 px-3 sm:px-4 rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50 text-[10px] sm:text-xs">
                      <Printer className="w-3.5 h-3.5 mr-2" /> Print
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1 sm:flex-none h-9 px-3 sm:px-4 rounded-xl text-[10px] sm:text-xs">
                      <Mail className="w-3.5 h-3.5 mr-2" /> Email
                    </Button>
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 sm:p-6 grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-6">
                      {/* Products Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Package className="w-4 h-4 text-amber-600" />
                          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">Order Items</h4>
                        </div>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item: any, idx: number) => (
                            <div key={idx} className="bg-white rounded-xl border border-border/40 overflow-hidden group hover:border-amber-200/50 transition-all">
                              <div className="p-3 flex gap-4">
                                <div className="w-16 h-20 rounded-lg bg-muted relative overflow-hidden shrink-0 border border-border/20 shadow-sm">
                                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <div className="flex justify-between items-start">
                                    <div className="min-w-0">
                                      <h5 className="font-bold text-xs sm:text-sm text-foreground truncate">{item.name}</h5>
                                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-amber-600 font-bold uppercase tracking-tight">
                                          <Gem className="w-2.5 h-2.5" />
                                          {item.shopName || selectedOrder.shopName || "Premium Boutique"}
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1.5">
                                          <div className="hidden sm:block w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                          {item.orderType === 'stitching_and_fabric' ? 'Fabric + Stitching' : 'Stitching Only'}
                                        </div>
                                        {/* Pickup Slot in Single Line */}
                                        {(item.pickupSlot || (idx === 0 && selectedOrder.pickupSlot)) && (
                                          <div className="text-[9px] sm:text-[10px] text-blue-600 font-bold uppercase flex items-center gap-1.5">
                                            <div className="hidden sm:block w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                            <Truck className="w-3 h-3 " />
                                            Pickup: {(item.pickupSlot || selectedOrder.pickupSlot).date}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-2">
                                      <div className="text-xs sm:text-sm font-bold tabular-nums">₹{(item.price || 0).toLocaleString()}</div>
                                      <div className="text-[9px] text-muted-foreground font-bold uppercase mt-0.5">Qty: {item.quantity || 1}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Summary - Card Format */}
                      <Card className="border-border/40 bg-muted/30 shadow-none relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl transition-all group-hover:bg-amber-500/10" />
                        <CardContent className="p-4 sm:p-6">
                          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-start">
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Payment Breakdown</h4>
                              <div className="space-y-2.5">
                                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                  <span>Cart Subtotal</span>
                                  <span className="text-foreground">₹{(selectedOrder.totalAmount || selectedOrder.total || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                  <span className="flex items-center gap-1.5">GST (12% included) <Tag className="w-3 h-3 text-muted-foreground/50" /></span>
                                  <span className="text-foreground">₹{Math.round(((selectedOrder.totalAmount || selectedOrder.total || 0) * 0.12)).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                                  <span>Delivery Charges</span>
                                  <span className={(selectedOrder.deliveryFee === 0 || !selectedOrder.deliveryFee) ? "text-emerald-600 font-bold" : "text-foreground"}>
                                    {(selectedOrder.deliveryFee === 0 || !selectedOrder.deliveryFee) ? "FREE" : `₹${selectedOrder.deliveryFee}`}
                                  </span>
                                </div>
                                {Number(selectedOrder.discountAmount) > 0 && (
                                  <div className="pt-2 border-t border-border/40">
                                    <div className="flex justify-between text-xs text-emerald-600 font-bold italic">
                                      <span className="flex items-center gap-1">
                                        <Ticket className="w-3 h-3" />
                                        {selectedOrder.promoCode || "SAVEMORE"}
                                      </span>
                                      <span>- ₹{Number(selectedOrder.discountAmount).toLocaleString()}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="md:border-l md:border-border/60 md:pl-8 flex flex-col justify-between items-start md:items-end h-full pt-1">
                              <div className="w-full text-left md:text-right">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Final Amount Received</p>
                                <div className="flex items-baseline justify-start md:justify-end gap-1.5 text-2xl sm:text-3xl font-black text-amber-600">
                                  <IndianRupee className="w-5 sm:w-6 h-5 sm:h-6 self-center" />
                                  {(selectedOrder.totalFinalAmount || selectedOrder.total || 0).toLocaleString()}
                                </div>
                              </div>
                              <div className="mt-4 sm:mt-6 w-full flex items-center justify-between bg-white/50 p-3 rounded-xl border border-border/40">
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Payment Mode</span>
                                  <span className="text-[10px] sm:text-[11px] font-bold text-foreground">{selectedOrder.paymentMethod || "Razorpay UPI"}</span>
                                </div>
                                <Badge variant="outline" className={cn(
                                  "text-[9px] font-black uppercase tracking-tighter py-0.5 px-2",
                                  selectedOrder.paymentStatus === 'paid' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                                )}>
                                  {selectedOrder.paymentStatus || "Paid"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-6">
                      {/* Tailor Details Sidebar Card */}
                      <Card className="border-border/40 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="p-4 bg-amber-50/30 border-b border-amber-100/50">
                          <div className="flex items-center gap-2">
                            <Gem className="w-4 h-4 text-amber-600" />
                            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground">Tailor Assignment</h4>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 text-base sm:text-lg font-bold">
                              {selectedOrder.items[0]?.shopName?.charAt(0) || "T"}
                            </div>
                            <div>
                              <p className="font-bold text-xs sm:text-sm text-foreground">{selectedOrder.items[0]?.shopName || selectedOrder.shopName || "Premium Boutique"}</p>
                              <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">Boutique ID: {selectedOrder.items[0]?.tailorId?.substring(0, 8) || "PLAT-001"}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                            <Button variant="outline" size="sm" className="h-8 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-lg border-amber-100 text-amber-700 hover:bg-amber-50">
                              <Phone className="w-3 h-3 mr-1.5" /> Call
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-lg border-amber-100 text-amber-700 hover:bg-amber-50">
                              <Mail className="w-3 h-3 mr-1.5" /> Message
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Customer & Shipping Summary */}
                      <Card className="border-border/40 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="p-4 bg-muted/5 border-b border-border/40">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-amber-600" />
                            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-foreground">Delivery Information</h4>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-base sm:text-lg font-bold shadow-md">
                              {selectedOrder.customerName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-xs sm:text-sm text-foreground">{selectedOrder.customerName}</p>
                              <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[120px] sm:max-w-none">ID: {selectedOrder.userId.substring(0, 8)}</p>
                            </div>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-border/40">
                            <div>
                              <p className="text-[9px] sm:text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" /> Shipping Address
                              </p>
                              <p className="text-xs font-bold text-foreground mb-1">{selectedOrder.shippingAddress?.fullName || selectedOrder.customerName}</p>
                              <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
                                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.landmark && <>{selectedOrder.shippingAddress.landmark}, </>}
                                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-medium text-foreground/80">
                                <Mail className="w-3.5 h-3.5 text-amber-500" />
                                <span className="truncate">user@example.com</span>
                              </div>
                              <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-medium text-foreground/80">
                                <Phone className="w-3.5 h-3.5 text-amber-500" />
                                <span>{selectedOrder.shippingAddress?.phone || selectedOrder.customerPhone || "+91 987 654 3210"}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quick Actions */}
                      <div className="space-y-2 sm:space-y-3 pt-2">
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Order Management</h4>
                        </div>
                        <Button variant="outline" className="w-full justify-start text-[10px] sm:text-xs font-bold h-9 sm:h-10 rounded-xl">
                          <FileText className="w-4 h-4 mr-2 text-slate-400" /> View Activity Log
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-[10px] sm:text-xs font-bold h-9 sm:h-10 rounded-xl">
                          <History className="w-4 h-4 mr-2 text-slate-400" /> Order History
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="p-4 border-t border-border/40 bg-muted/5 flex flex-col sm:flex-row gap-3">
                  <Button variant="ghost" className="w-full sm:w-auto text-muted-foreground hover:text-rose-600 hover:bg-rose-50 font-bold shadow-none text-[10px] sm:text-xs uppercase tracking-widest h-10 sm:h-auto" onClick={() => setViewDialogOpen(false)}>
                    Close Panel
                  </Button>
                  <div className="flex gap-2 w-full sm:flex-1 sm:justify-end">
                    <Button variant="outline" className="flex-1 sm:flex-none bg-white h-10 sm:h-11 border-border/60 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all px-4 sm:px-8">
                      Cancel
                    </Button>
                    <Button className="flex-1 sm:flex-none bg-amber-600 hover:bg-amber-700 text-white h-10 sm:h-11 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all px-6 sm:px-10">
                      Update Status
                    </Button>
                  </div>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
