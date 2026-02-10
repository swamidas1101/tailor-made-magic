import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { orderService, Order } from "@/services/orderService";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function TailorOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const fetchedOrders = await orderService.getUserOrders(user.uid);
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
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  const stats = [
    { label: "New", value: newOrders.toString(), color: "bg-blue-500", icon: Clock },
    { label: "Processing", value: processingOrders.toString(), color: "bg-amber-500", icon: Package },
    { label: "Delivered", value: deliveredOrders.toString(), color: "bg-green-500", icon: CheckCircle2 },
    { label: "Revenue", value: `₹${(totalRevenue / 1000).toFixed(1)}k`, color: "bg-primary", icon: IndianRupee },
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
    <div className="p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Active Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your current workflow and deliveries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 border-border/50 shadow-soft">
            <Calendar className="w-4 h-4 mr-2" /> Calendar View
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-soft overflow-hidden">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-opacity-10", stat.color.replace('bg-', 'bg-').replace('500', '500/10'), stat.color.replace('bg-', 'text-').replace('500', '600'))}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
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
            const mainItem = order.items?.[0];
            const otherItemsCount = (order.items?.length || 0) - 1;
            const designName = mainItem?.name || "Custom Order";
            const displayDesign = otherItemsCount > 0 ? `${designName} + ${otherItemsCount} more` : designName;

            return (
              <Card key={order.id} className="group hover:border-primary/30 transition-all duration-300 shadow-soft border-border/40 overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base truncate">{order.shippingAddress?.fullName || 'Guest Customer'}</h3>
                          <Badge
                            className={cn("text-[10px] font-bold shrink-0",
                              order.status === 'delivered' ? 'bg-green-500/10 text-green-700 border-green-200' :
                                order.status === 'processing' ? 'bg-amber-500/10 text-amber-700 border-amber-200' :
                                  'bg-blue-500/10 text-blue-700 border-blue-200'
                            )}
                          >
                            {order.status?.toUpperCase() || 'PENDING'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{displayDesign}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/50">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Order ID</p>
                        <p className="text-xs font-semibold">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Ordered On</p>
                        <p className="text-xs font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Amount</p>
                        <p className="text-xs font-semibold flex items-center text-green-600">
                          <IndianRupee className="w-3 h-3" /> {order.totalAmount?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <Button size="sm" className="w-full h-8 bg-primary hover:bg-primary/90 text-xs">
                          View Details <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
