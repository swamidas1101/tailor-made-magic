import { useState, useEffect } from "react";
import { Users, ShoppingBag, Scissors, IndianRupee, TrendingUp, ArrowRight, Activity, ShieldCheck, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { adminService } from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentTailors, setRecentTailors] = useState<any[]>([]);

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
      <div className="p-8 space-y-8 animate-pulse font-body">
        <div className="h-20 bg-muted/20 rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted/20 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 h-96 bg-muted/20 rounded-xl" />
          <div className="h-96 bg-muted/20 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white min-h-screen">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-8">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-widest">{format(new Date(), "EEEE, MMMM do, yyyy")}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
            Welcome back, <span className="text-amber-600">Administrator</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl leading-relaxed">
            Your daily overview of platform performance, artisan activity, and order fulfillment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border-border/60 hover:border-amber-200 hover:bg-amber-50/50 text-xs font-bold uppercase tracking-wider transition-all">
            Download Report
          </Button>
          <Button className="h-10 bg-amber-600 hover:bg-amber-700 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-900/10">
            Verify New Artisans
          </Button>
        </div>
      </div>

      {/* Boutique Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statConfig.map((stat) => (
          <Card key={stat.label} className="border-border/40 shadow-sm hover:shadow-md hover:border-amber-200/60 transition-all duration-300 group cursor-default">
            <CardContent className="p-6 flex items-start justify-between">
              <div className="space-y-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-display font-bold text-foreground mt-1 tabular-nums tracking-tight">{stat.value}</p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <Badge variant="outline" className="border-green-200 text-green-700 text-[9px] font-bold bg-green-50/50 px-2 py-0.5">
                  +12%
                </Badge>
              </div>
            </CardContent>
            <div className="px-6 pb-4">
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <Activity className="w-3 h-3" /> {stat.desc}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity - Clean List */}
        <Card className="lg:col-span-2 border-border/40 shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 px-6 pt-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-display font-bold">Recent Artisans</CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-wider">Newest platform partners</CardDescription>
            </div>
            <Link to="/admin/tailors">
              <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 text-xs font-bold uppercase tracking-wider">
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
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

        {/* System Health / Quick Actions */}
        <div className="space-y-6">
          <Card className="border-border/40 shadow-sm bg-gradient-to-br from-amber-600 to-amber-700 text-white border-none relative overflow-hidden">
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

          <Card className="border-border/40 shadow-sm bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Platform Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 items-start p-3 bg-white rounded-lg border border-border/40 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Pending Verifications</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">5 new artisans await your approval.</p>
                  <Link to="/admin/moderation" className="text-[10px] font-bold text-amber-600 hover:underline mt-1.5 block">Review Queue &rarr;</Link>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 bg-white rounded-lg border border-border/40 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Order Volume Spike</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">High order volume detected in Hyderabad region.</p>
                  <Link to="/admin/analytics" className="text-[10px] font-bold text-blue-600 hover:underline mt-1.5 block">View Insights &rarr;</Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
