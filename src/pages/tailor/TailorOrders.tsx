import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Clock,
  CheckCircle2,
  Package,
  Search,
  Filter,
  Calendar,
  IndianRupee,
  ChevronRight,
  MoreVertical,
  Inbox,
  Ruler,
  Printer,
  Phone,
  Edit2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { orderService, Order } from "@/services/orderService";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function TailorOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesState, setNotesState] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedOrder) {
      const initialNotes: Record<string, string> = {};
      selectedOrder.items.forEach((item, idx) => {
        if (item.tailorId === user?.uid) {
          initialNotes[`${idx}`] = item.tailorNotes || "";
        }
      });
      setNotesState(initialNotes);
    }
  }, [selectedOrder, user?.uid]);

  const handleUpdateNotes = async () => {
    if (!selectedOrder || !selectedOrder.id) return;
    try {
      setSavingNotes(true);
      const updatedItems = selectedOrder.items.map((item, idx) => {
        if (item.tailorId === user?.uid) {
          return { ...item, tailorNotes: notesState[`${idx}`] };
        }
        return item;
      });
      await orderService.updateOrderItems(selectedOrder.id, updatedItems);
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, items: updatedItems } : o));
      setSelectedOrder(prev => prev ? { ...prev, items: updatedItems } : null);
    } catch (error) {
      console.error("Error updating notes:", error);
    } finally {
      setSavingNotes(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const fetchedOrders = await orderService.getTailorOrders(user.uid);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.uid]);

  // Calculate Stats
  const newOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const shopRevenue = orders.reduce((acc, o) => {
    const shopItems = o.items.filter(item => item.tailorId === user?.uid);
    const shopTotal = shopItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return acc + shopTotal;
  }, 0);

  const stats = [
    { label: "New", value: newOrders.toString(), color: "bg-blue-500", icon: Clock },
    { label: "Processing", value: processingOrders.toString(), color: "bg-amber-500", icon: Package },
    { label: "Delivered", value: deliveredOrders.toString(), color: "bg-green-500", icon: CheckCircle2 },
    { label: "Shop Revenue", value: `₹${(shopRevenue / 1000).toFixed(1)}k`, color: "bg-primary", icon: IndianRupee },
  ];

  const filteredOrders = orders.filter(order =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shippingAddress?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 lg:p-8 space-y-8 animate-pulse">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="w-full px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Active Orders
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your current workflow and deliveries
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 shadow-sm">
                <Calendar className="w-3.5 h-3.5 mr-2" /> Calendar View
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 pt-8 space-y-8">

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-border/40 shadow-sm hover:border-amber-200/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground tracking-tight tabular-nums mt-0.5">{stat.value}</p>
                </div>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center opacity-80", stat.color.replace('bg-', 'bg-').replace('500', '100'), stat.color.replace('bg-', 'text-').replace('500', '700'))}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-9 h-10 border-0 bg-muted/30 focus-visible:ring-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-10 text-xs border-border/50 shrink-0">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-muted/5 rounded-3xl border border-dashed border-border">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg">No orders found</h3>
              <p className="text-muted-foreground text-sm">Your order list is currently empty.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              // Extract items belonging to this tailor
              const tailorItems = order.items.filter(item => item.tailorId === user?.uid);
              const mainItem = tailorItems[0] || order.items[0];
              const otherItemsCount = (order.items?.length || 0) - 1;
              const designName = mainItem?.name || "Custom Order";
              const displayDesign = otherItemsCount > 0 ? `${designName} + ${otherItemsCount} more` : designName;

              return (
                <Card key={order.id} className="group hover:border-orange-300 transition-all duration-300 shadow-soft border-border/40 overflow-hidden bg-white">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">

                      {/* Left: Product Thumbnails (Compact) */}
                      <div className="flex -space-x-3 md:space-x-0 md:flex-col md:gap-1.5 shrink-0">
                        {order.items
                          .filter(item => item.tailorId === user?.uid)
                          .map((item, idx) => (
                            <div key={idx} className="w-14 h-16 md:w-16 md:h-20 rounded-lg border border-orange-200 ring-2 ring-white shadow-sm shrink-0 overflow-hidden relative z-10 group-hover:scale-105 transition-transform">
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-x-0 bottom-0 bg-black/40 py-0.5 text-[8px] text-white text-center font-bold">
                                {item.orderType === 'stitching_and_fabric' ? 'FABRIC' : 'STITCH'}
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Middle: Order Info (Main) */}
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                        {/* Customer & Description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-base truncate">{order.shippingAddress?.fullName || 'Guest Customer'}</h3>
                            <Badge
                              variant="outline"
                              className={cn("text-[9px] font-bold h-5 px-1.5",
                                order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                  order.status === 'processing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    'bg-blue-50 text-blue-700 border-blue-200'
                              )}
                            >
                              {order.status?.toUpperCase() || 'PENDING'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 italic">
                            OrderID: <span className="font-mono font-bold text-slate-500 mr-2">#{order.id?.slice(-8).toUpperCase()}</span>
                            • {tailorItems.length} item(s) to stitch
                          </p>
                        </div>

                        {/* Details (Stacked on mobile, row on desktop) */}
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 text-xs whitespace-nowrap">
                          <div>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Order Date</p>
                            <div className="flex items-center gap-1.5 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Pending'}
                            </div>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Payment</p>
                            <div className="flex items-center gap-1.5 font-medium text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Paid
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Action Button & Deadline */}
                      <div className="shrink-0 flex flex-col items-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-border/50">
                        {/* Completion Deadline */}
                        {(() => {
                          const maxDays = Math.max(...tailorItems.map(i => i.estimatedDays || 7));
                          const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt);
                          const deadline = new Date(orderDate);
                          deadline.setDate(deadline.getDate() + maxDays);

                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const deadlineOnly = new Date(deadline);
                          deadlineOnly.setHours(0, 0, 0, 0);

                          const diffTime = deadlineOnly.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                          let statusColor = "text-slate-500 bg-slate-50 border-slate-200";
                          let dotColor = "bg-slate-400";
                          let label = `Due in ${diffDays} days`;

                          if (diffDays <= 0) {
                            statusColor = "text-rose-700 bg-rose-50 border-rose-200";
                            dotColor = "bg-rose-500";
                            label = diffDays === 0 ? "Due Today" : `Overdue by ${Math.abs(diffDays)}d`;
                          } else if (diffDays <= 2) {
                            statusColor = "text-amber-700 bg-amber-50 border-amber-200";
                            dotColor = "bg-amber-500";
                            label = "Due Soon";
                          }

                          return (
                            <div className={cn("flex flex-col items-end", order.status === 'delivered' && "opacity-50 grayscale")}>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Target Completion</p>
                              <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border shadow-sm", statusColor)}>
                                <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColor)} />
                                <span className="text-[10px] font-bold whitespace-nowrap">
                                  {deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {label}
                                </span>
                              </div>
                            </div>
                          );
                        })()}

                        <Button
                          size="sm"
                          className="w-full md:w-auto px-6 h-9 text-xs font-bold shadow-sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setViewDialogOpen(true);
                          }}
                        >
                          View Specifications
                        </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white rounded-2xl shadow-2xl border-none">
          {selectedOrder && (
            <div className="flex flex-col h-full max-h-[90vh]">
              <DialogHeader className="p-6 border-b border-border/40 bg-muted/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <DialogTitle className="text-xl font-bold font-display">Order Specifications</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                      Order ID: #{selectedOrder.id?.slice(-8).toUpperCase()} • {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </DialogDescription>
                  </div>
                  <Badge className={cn("px-3 py-1 text-xs font-bold w-fit",
                    selectedOrder.status === 'delivered' ? 'bg-green-500 text-white' :
                      selectedOrder.status === 'processing' ? 'bg-amber-500 text-white' :
                        'bg-blue-500 text-white'
                  )}>
                    {selectedOrder.status?.toUpperCase()}
                  </Badge>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-8">
                  {/* Customer Info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start bg-slate-50 p-4 rounded-xl border border-slate-100 gap-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                      <h4 className="font-bold text-base">{selectedOrder.shippingAddress?.fullName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedOrder.shippingAddress?.phone}</p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                        <p className="text-xs font-bold text-slate-600">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${selectedOrder.shippingAddress?.phone}`;
                        }}
                      >
                        <Phone className="w-3.5 h-3.5 mr-2" />
                        Call Customer
                      </Button>
                    </div>
                  </div>

                  {/* Items belonging to this tailor */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                      <Ruler className="w-3.5 h-3.5" /> Design Specifications
                    </h4>
                    <div className="space-y-6">
                      {selectedOrder.items.map((item, originalIdx) => {
                        if (item.tailorId !== user?.uid) return null;

                        return (
                          <div key={originalIdx} className="space-y-3 rounded-2xl p-4 border transition-all bg-orange-50/30 border-orange-200 ring-1 ring-orange-100">
                            <div className="flex gap-4">
                              <img src={item.image} className="w-20 h-24 object-cover rounded-lg border border-white shadow-sm" alt="" />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-bold text-base">{item.name}</h5>
                                    <p className="text-xs text-muted-foreground mt-1">Size: {item.size || 'Custom'}</p>
                                  </div>
                                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none text-[10px]">Your Shop</Badge>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <Badge variant="secondary" className="text-[10px] bg-white border border-slate-100">{item.orderType === 'stitching_and_fabric' ? 'Stitching + Fabric' : 'Stitching Only'}</Badge>
                                  <Badge variant="outline" className="text-[10px] bg-white capitalize border-slate-100">{(item.measurementType || selectedOrder.measurementType)} Details</Badge>
                                </div>
                              </div>
                            </div>

                            {/* Measurements */}
                            {(item.measurements || (originalIdx === 0 && selectedOrder.measurements)) && (
                              <div className="mt-3 p-3 rounded-xl bg-white/80 border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                  <Ruler className="w-3 h-3" /> Measurements
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                                  {Object.entries(item.measurements || selectedOrder.measurements || {}).map(([k, v]) => (
                                    <div key={k} className="flex flex-col">
                                      <span className="text-[9px] text-slate-400 uppercase">{k}</span>
                                      <span className="text-[11px] font-bold text-slate-700">{v as string}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Workshop Notes */}
                            <div className="mt-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100/50">
                              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Edit2 className="w-3 h-3" /> Workshop / Custom Notes
                              </p>
                              <Textarea
                                placeholder="Add specific customer requested points here... (e.g., 'Needs extra margin in sleeves', 'Add pocket in right side')"
                                className="text-xs min-h-[60px] bg-white border-amber-100 focus-visible:ring-amber-200"
                                value={notesState[`${originalIdx}`] || ""}
                                onChange={(e) => setNotesState(prev => ({ ...prev, [`${originalIdx}`]: e.target.value }))}
                              />
                            </div>

                            {/* Pickup Info */}
                            {(item.pickupSlot || (originalIdx === 0 && selectedOrder.pickupSlot)) && (
                              <div className="mt-2 p-3 rounded-xl bg-blue-50/50 border border-blue-100/50">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Pickup Slot</p>
                                <p className="text-xs font-bold text-blue-900">{(item.pickupSlot || selectedOrder.pickupSlot).time} • {(item.pickupSlot || selectedOrder.pickupSlot).date}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="p-4 border-t border-border/40 bg-muted/5 gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="hidden md:flex flex-1 h-11 rounded-xl"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Job Sheet
                </Button>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="flex-1 h-11 rounded-xl">
                  Close Details
                </Button>
                <Button
                  className="flex-1 h-11 rounded-xl shadow-lg transition-all"
                  onClick={handleUpdateNotes}
                  disabled={savingNotes}
                >
                  {savingNotes ? "Saving..." : "Update Notes & Workflow"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
