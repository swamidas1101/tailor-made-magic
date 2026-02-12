import { useState, useEffect } from "react";
import { Users, ShoppingBag, Scissors, IndianRupee, TrendingUp, ArrowRight, Activity, ShieldCheck, Clock, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { adminService } from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentTailors, setRecentTailors] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, tailorsData] = await Promise.all([
          adminService.getAdminStats(),
          adminService.getAllTailorsWithStats()
        ]);
        setStats(statsData);
        setRecentTailors(tailorsData.slice(0, 5));
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statConfig = [
    { label: "Total Artisans", value: stats?.totalTailors || 0, icon: Users, color: "text-amber-600", bg: "bg-amber-50", desc: "Active verifications" },
    { label: "Active Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50", desc: "In production" },
    { label: "Design Portfolio", value: stats?.totalDesigns || 0, icon: Scissors, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Curated collection" },
    { label: "Total Revenue", value: `₹${(stats?.revenueMTD / 1000 || 0).toFixed(1)}k`, icon: IndianRupee, color: "text-purple-600", bg: "bg-purple-50", desc: "Platform earnings" },
  ];

  if (loading) {
    return (
      <div className="p-4 lg:p-8 space-y-8 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{format(new Date(), "EEEE, MMMM do, yyyy")}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Welcome back, Administrator
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Your daily overview of platform performance, artisan activity, and order fulfillment.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-amber-200 text-amber-700 hover:bg-amber-50 font-bold uppercase tracking-wider text-xs hidden sm:flex"
                onClick={() => navigate("/admin/analytics")}
              >
                Download Report
              </Button>
              <Button
                size="sm"
                className="h-9 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 font-bold uppercase tracking-wider text-xs"
                onClick={() => navigate("/admin/tailors")}
              >
                Verify New Artisans
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 pt-8 space-y-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statConfig.map((stat) => (
            <Card key={stat.label} className="border-border/50 shadow-soft hover-lift group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                    <p className="text-[10px] font-bold text-green-600 flex items-center gap-0.5">
                      +12%
                    </p>
                  </div>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Artisans */}
          <Card className="lg:col-span-2 border-border/50 shadow-soft overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/5">
              <div>
                <CardTitle className="text-base font-bold">Recent Artisans</CardTitle>
                <CardDescription>Newest platform partners</CardDescription>
              </div>
              <Link to="/admin/tailors">
                <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 text-xs font-bold uppercase tracking-wider">
                  View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {recentTailors.map((tailor) => (
                  <div key={tailor.id} className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border border-border/50">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tailor.id}`} />
                        <AvatarFallback className="bg-amber-50 text-amber-700 font-bold text-xs">
                          {tailor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-foreground group-hover:text-amber-700 transition-colors">{tailor.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          {tailor.shopName} • <span className="text-[10px] bg-muted px-1.5 rounded">{tailor.specialization || "General"}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-medium text-muted-foreground">Just now</span>
                      </div>
                      <Badge variant={tailor.approved ? "default" : "secondary"} className={cn("text-[9px] font-bold uppercase tracking-wider px-2", tailor.approved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-100 text-amber-700 hover:bg-amber-200")}>
                        {tailor.approved ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status & Alerts */}
          <div className="space-y-6">
            {/* System Status */}
            <Card className="border-border/50 shadow-soft bg-gradient-to-br from-amber-600 to-amber-700 text-white border-none relative overflow-hidden">
              <Activity className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 rotate-12" />
              <CardContent className="p-6 relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">System Status</p>
                    <p className="text-xs text-amber-100 font-medium opacity-90">All systems operational</p>
                  </div>
                </div>
                <div className="h-px bg-white/20 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-amber-200/80">Uptime</p>
                    <p className="text-lg font-bold">99.9%</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-amber-200/80">Latency</p>
                    <p className="text-lg font-bold">24ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Alerts */}
            <Card className="border-border/50 shadow-soft overflow-hidden">
              <CardHeader className="pb-3 bg-muted/5 border-b border-border/50">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Platform Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  <div className="p-4 space-y-1 hover:bg-muted/5 transition-colors cursor-pointer" onClick={() => navigate("/admin/designs")}>
                    <p className="text-xs font-bold flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      Pending Verifications
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      5 new artisans await your approval.
                    </p>
                  </div>
                  <div className="p-4 space-y-1 hover:bg-muted/5 transition-colors cursor-pointer" onClick={() => navigate("/admin/analytics")}>
                    <p className="text-xs font-bold flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      Order Volume Spike
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      High order volume detected in Hyderabad region.
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full h-10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-amber-600"
                  onClick={() => navigate("/admin/designs")}
                >
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
