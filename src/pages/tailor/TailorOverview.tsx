import { useState, useEffect } from "react";
import {
  ShoppingBag,
  IndianRupee,
  Star,
  TrendingUp,
  Sparkles,
  Upload,
  Plus,
  ChevronRight,
  BarChart3,
  Users,
  Bell,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Eye,
  Settings,
  Scissors,
  Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { designService } from "@/services/designService";
import { orderService, Order } from "@/services/orderService";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function TailorOverview() {
  const { user, kytData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [designCount, setDesignCount] = useState(0);
  const [recentDesigns, setRecentDesigns] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;

      setLoading(true);

      // Fetch designs and orders separately to handle errors independently
      try {
        const designs = await designService.getTailorDesigns(user.uid);
        console.log("TailorOverview: Fetched Designs:", designs);
        console.log("TailorOverview: Design Count:", designs.length);

        setDesignCount(designs.length);
        setRecentDesigns(designs.slice(0, 3));

        // Calculate Rating 
        const totalRating = designs.reduce((acc, curr) => acc + (curr.rating || 0), 0);
        const avg = designs.length > 0 ? (totalRating / designs.length) : 0;
        setAverageRating(avg);
      } catch (error) {
        console.error("Error fetching designs:", error);
        // Set defaults on error
        setDesignCount(0);
        setRecentDesigns([]);
        setAverageRating(0);
      }

      // Fetch orders separately - if it fails, designs will still display
      try {
        const fetchedOrders = await orderService.getUserOrders(user.uid);
        console.log("TailorOverview: Fetched Orders:", fetchedOrders.length);

        setOrders(fetchedOrders);
        const revenue = fetchedOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Error fetching orders:", error);
        console.warn("Orders fetch failed - this may be due to missing Firebase index. Designs will still display.");
        // Set defaults on error
        setOrders([]);
        setTotalRevenue(0);
      }

      setLoading(false);
    };
    fetchData();
  }, [user?.uid]);

  const shopName = kytData?.address?.shopName || "My Boutique";

  const quickActions = [
    { label: "New Design", icon: Plus, path: "/tailor/designs", color: "bg-amber-500", desc: "Upload to portfolio" },
    { label: "Check Orders", icon: ShoppingBag, path: "/tailor/orders", color: "bg-blue-500", desc: "Manage requested items" },
    { label: "Withdraw", icon: IndianRupee, path: "/tailor/earnings", color: "bg-green-500", desc: "Request your payouts" },
    { label: "Edit Profile", icon: Settings, path: "/tailor/profile", color: "bg-purple-500", desc: "Update shop details" },
    // { label: "Database Seeder", icon: Database, path: "/seed", color: "bg-rose-500", desc: "Populate mock data" }, // Hidden for real users
  ];

  const stats = [
    { label: "Total Orders", value: orders.length.toString(), change: "Lifetime", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "Lifetime", icon: IndianRupee, color: "text-green-600", bg: "bg-green-50" },
    { label: "Portfolio Size", value: designCount.toString(), change: "designs", icon: Star, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Avg. Rating", value: averageRating.toFixed(1), change: "From designs", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-8 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
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
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Scissors className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{shopName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Tailor Dashboard
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your boutique, orders, and designs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-amber-200 text-amber-700 hover:bg-amber-50 font-bold uppercase tracking-wider text-xs hidden sm:flex"
                onClick={() => navigate("/tailor/earnings")}
              >
                <BarChart3 className="w-3.5 h-3.5 mr-2" /> Analytics
              </Button>
              <Button
                size="sm"
                className="h-9 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 font-bold uppercase tracking-wider text-xs"
                onClick={() => navigate("/tailor/designs")}
              >
                <Plus className="w-3.5 h-3.5 mr-2" /> Quick Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 pt-8 space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/40 shadow-sm hover:border-amber-200/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg font-bold text-foreground tracking-tight tabular-nums mt-0.5">{stat.value}</p>
                  <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center opacity-80", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Conditional Getting Started vs Portfolio Pulse */}
            {designCount === 0 ? (
              <Card className="bg-gradient-to-br from-amber-600 to-amber-700 border-none shadow-xl shadow-amber-900/20 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-1000 group-hover:scale-150 rotate-12">
                  <Sparkles className="w-48 h-48" />
                </div>
                <CardContent className="p-8 sm:p-12 relative z-10 flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-display font-bold">
                      Start Your Modern Boutique
                    </h3>
                    <p className="text-white/80 max-w-md mx-auto leading-relaxed">
                      Your portal is active, but your portfolio is empty. Upload your first design to start receiving orders from local customers.
                    </p>
                  </div>
                  <Button size="lg" className="bg-white text-amber-700 hover:bg-white/90 font-bold px-10 h-12 shadow-2xl transition-transform active:scale-95" asChild>
                    <Link to="/tailor/designs">
                      <Plus className="w-5 h-5 mr-2 font-bold" />
                      Upload Your First Design
                    </Link>
                  </Button>
                  <div className="flex gap-6 pt-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> KYT Verified</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 24/7 Setup</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 shadow-soft overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/5">
                  <div>
                    <CardTitle className="text-base font-bold">Portfolio Pulse</CardTitle>
                    <CardDescription>Recently updated designs in your boutique</CardDescription>
                  </div>
                  <Link to="/tailor/designs" className="text-xs font-bold text-amber-600 flex items-center hover:underline">
                    All Designs <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid sm:grid-cols-3 divide-x divide-border/50">
                    {recentDesigns.map((design, idx) => (
                      <div key={idx} className="p-4 flex flex-col gap-3 group">
                        <div className="aspect-square rounded-xl bg-muted overflow-hidden relative">
                          <img src={design.image} alt={design.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm border-none text-[8px] uppercase font-bold py-0.5 px-2">
                            {design.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs font-bold truncate">{design.name}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[10px] text-muted-foreground">₹{design.price}</span>
                            <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                              <Eye className="w-3 h-3" /> 24pv
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {designCount < 3 && [1, 2].slice(0, 3 - designCount).map((_, i) => (
                      <div key={i} className="p-4 flex flex-col items-center justify-center gap-2 border-dashed border-2 border-transparent hover:border-muted-foreground/20 transition-all m-2 rounded-xl group" onClick={() => navigate("/tailor/designs")}>
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-600">
                          <Plus className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground">Add Design</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions Grid */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                Quick Command Center <div className="h-[1px] flex-1 bg-border/50" />
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="p-5 rounded-2xl bg-card border border-border/50 shadow-soft hover:border-amber-500/50 hover:shadow-lg transition-all text-left space-y-3 group active:scale-95"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:rotate-6", action.color)}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">{action.label}</p>
                      <p className="text-[9px] font-medium text-muted-foreground uppercase">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Activity & Notifications */}
          <div className="space-y-8">
            <Card className="border-border/50 shadow-soft overflow-hidden">
              <CardHeader className="pb-3 bg-muted/5 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-600" /> Notifications
                  </CardTitle>
                  {orders.some(o => o.status === 'pending') && (
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-xs">
                    No recent notifications.
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="p-4 space-y-1 hover:bg-muted/5 transition-colors cursor-pointer"
                        onClick={() => navigate("/tailor/orders")}
                      >
                        <p className="text-xs font-bold flex items-center gap-1.5">
                          <Badge className={cn("h-4 px-1 py-0 text-[8px]",
                            order.status === 'pending' ? "bg-blue-100 text-blue-700 border-blue-200" :
                              order.status === 'delivered' ? "bg-green-100 text-green-700 border-green-200" :
                                "bg-gray-100 text-gray-700 border-gray-200"
                          )}>
                            {order.status}
                          </Badge>
                          Order received
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {order.items.length} items • {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  variant="ghost"
                  className="w-full h-10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-amber-600"
                  onClick={() => navigate("/tailor/orders")}
                >
                  View All Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Business Support */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
              <div className="absolute -bottom-10 -right-10 opacity-20">
                <Users className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-4">
                <h4 className="font-bold text-base leading-tight">Need Expert Help Scaling Up?</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join our weekly "Mastering Boutique Sales" webinar this Friday.
                </p>
                <Button className="w-full bg-white text-indigo-900 hover:bg-slate-100 font-bold h-9 text-xs rounded-xl">
                  Register for Webinar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

