import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, CheckCircle2, XCircle, Eye, Printer, Download, ShoppingBag, Clock, ArrowRight, User, MapPin, Phone, Mail, IndianRupee, Package, Calendar, Tag, ChevronRight, Gem, AlertTriangle, Scale, History, FileText, Truck, LayoutList } from "lucide-react";
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
    { label: "Total Revenue", value: `₹${(orders.reduce((acc, o) => acc + o.total, 0) / 1000).toFixed(1)}k`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50" },
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
                  <th className="text-left py-3 px-6 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Item Details</th>
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
                        <span className="text-xs text-muted-foreground">{order.items.length} item(s) • <span className="text-foreground/80 font-medium">{order.items[0].shopName}</span></span>
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
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setSelectedOrder(order);
                            setViewDialogOpen(true);
                          }}
                        >
                          <ChevronRight className="w-4 h-4 text-amber-600" />
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
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white rounded-2xl shadow-2xl border-none">
            {selectedOrder && (
              <div className="flex flex-col h-full max-h-[90vh]">
                <DialogHeader className="p-6 border-b border-border/40 bg-muted/5 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <DialogTitle className="text-lg font-bold font-display flex items-center gap-2">
                      Order #{selectedOrder.id}
                      <Badge variant="outline" className={cn("ml-2 text-[10px] font-bold uppercase tracking-wider py-0.5 px-2", getStatusColor(selectedOrder.status))}>
                        {selectedOrder.status}
                      </Badge>
                    </DialogTitle>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {selectedOrder.date}</span>
                      <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                      <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> {selectedOrder.items.length} items</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full"><Printer className="w-3.5 h-3.5" /></Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full"><Mail className="w-3.5 h-3.5" /></Button>
                  </div>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Items */}
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Items</h4>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 p-3 rounded-xl bg-muted/10 border border-border/40 group hover:border-amber-200/50 transition-colors">
                              <div className="w-16 h-16 rounded-lg bg-white relative overflow-hidden shrink-0">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-foreground truncate">{item.name}</p>
                                <p className="text-xs text-amber-600 font-medium truncate">{item.shopName}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="text-[9px] px-1.5 bg-white h-5">{item.category}</Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm tabular-nums">₹{item.price.toLocaleString()}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">Qty: 1</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Customer & Info */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer</h4>
                        <div className="p-3 rounded-xl border border-border/40 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-[10px] text-amber-700 font-bold">
                              {selectedOrder.customerName.charAt(0)}
                            </div>
                            <p className="font-bold text-sm">{selectedOrder.customerName}</p>
                          </div>
                          <p className="text-xs text-muted-foreground pl-8">user@example.com</p>
                          <p className="text-xs text-muted-foreground pl-8">+91 987 654 3210</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address</h4>
                        <div className="p-3 rounded-xl border border-border/40 p-4">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            123 Fashion Avenue,<br />
                            Design District,<br />
                            Hyderabad, 500033
                          </p>
                        </div>
                      </div>

                      <div className="bg-amber-50 rounded-xl p-4 space-y-3 border border-amber-100/50">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">₹{selectedOrder.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="font-bold text-green-600">Free</span>
                        </div>
                        <Separator className="bg-amber-200/30" />
                        <div className="flex justify-between text-sm font-bold text-amber-900">
                          <span>Total</span>
                          <span>₹{selectedOrder.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <DialogFooter className="p-4 border-t border-border/40 bg-muted/5 gap-3">
                  <Button variant="outline" className="flex-1 bg-white h-10 border-border/60">
                    Cancel Order
                  </Button>
                  <Button className="flex-1 bg-amber-600 hover:bg-amber-700 h-10 shadow-lg shadow-amber-900/10">
                    Update Status &rarr;
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div >
    </div >
  );
}
