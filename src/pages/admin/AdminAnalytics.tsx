import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  IndianRupee,
  Calendar,
  Download,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  CreditCard,
  PieChart as PieIcon,
  BarChart3,
  ListFilter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { adminService } from "@/services/adminService";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const result = await adminService.getAnalyticsData();
        setData(result);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse bg-white min-h-screen">
        <div className="h-12 w-64 bg-muted/20 rounded-xl" />
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

  const revenueData = [
    { name: "Week 1", value: 45000 },
    { name: "Week 2", value: 52000 },
    { name: "Week 3", value: 48000 },
    { name: "Week 4", value: 65000 },
  ];

  const categoryDistribution = data?.categoryStats || [
    { name: "Bridal", count: 45, color: "bg-amber-600" },
    { name: "Festive", count: 32, color: "bg-amber-500" },
    { name: "Casual", count: 28, color: "bg-amber-400" },
    { name: "Luxury", count: 15, color: "bg-amber-300" },
  ];

  const stats = [
    { label: "Total Revenue", value: `₹${(data?.revenue / 1000 || 0).toFixed(1)}k`, change: "+14.2%", icon: IndianRupee, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Artisans", value: data?.totalTailors || "0", change: "+5", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Orders Fulfilled", value: data?.totalOrders || "0", change: "+24%", icon: ShoppingBag, color: "text-green-600", bg: "bg-green-50" },
    { label: "Avg. Order Value", value: "₹4.5k", change: "+8.1%", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="w-full px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Platform Intelligence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Comprehensive overview of platform performance and metrics
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/50 p-1 rounded-xl border border-gray-200/60 shadow-sm">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px] h-9 text-xs font-bold uppercase tracking-wider border-none bg-transparent shadow-none focus:ring-0">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last Quarter</SelectItem>
                  <SelectItem value="1y">Year to Date</SelectItem>
                </SelectContent>
              </Select>
              <div className="w-px h-6 bg-gray-200" />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-amber-600">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-amber-600">
                <ListFilter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 pt-8 space-y-10">

        {/* Stats Cards - Refined */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 rounded-xl border border-border/40 bg-white shadow-sm hover:border-amber-200/50 hover:shadow-md transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-100 text-[10px] font-bold px-2">
                  <TrendingUp className="w-3 h-3 mr-1" /> {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground tracking-tight tabular-nums">{stat.value}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 h-full">
          {/* Main Revenue Chart - Area */}
          <Card className="lg:col-span-2 border-border/40 shadow-sm overflow-hidden h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold font-display">Revenue Performance</CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-wider">Gross platform earnings over time</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-[9px] px-2 py-0.5 border-amber-200/50 bg-amber-50 text-amber-700">Projected</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                      dy={16}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                      dx={-10}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-xl shadow-xl border border-border/40 text-xs">
                              <p className="font-bold text-muted-foreground uppercase tracking-wider mb-1">{payload[0].payload.name}</p>
                              <p className="text-lg font-bold text-amber-600">₹{payload[0].value?.toLocaleString()}</p>
                            </div>
                          )
                        }
                        return null;
                      }}
                      cursor={{ stroke: '#d97706', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#d97706"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution - Refined */}
          <div className="space-y-6 h-full flex flex-col">
            <Card className="border-border/40 shadow-sm flex-1">
              <CardHeader className="pb-2 border-b border-border/40">
                <CardTitle className="text-lg font-bold font-display">Category Mix</CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-wider">Sales volume by segment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 pt-8 px-6">
                {categoryDistribution.map((cat: any) => {
                  const total = categoryDistribution.reduce((acc: any, c: any) => acc + c.count, 0);
                  const percentage = Math.round((cat.count / total) * 100);
                  return (
                    <div key={cat.name} className="space-y-2 group">
                      <div className="flex justify-between text-sm items-end">
                        <span className="font-bold text-muted-foreground text-xs uppercase tracking-wide group-hover:text-amber-600 transition-colors">{cat.name}</span>
                        <span className="font-bold text-foreground tabular-nums">{percentage}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-muted/40 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110", cat.color)} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-lg shadow-gray-900/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Target className="w-24 h-24 text-white" />
              </div>
              <CardContent className="p-6 space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-amber-500 rounded-lg shadow-lg shadow-amber-500/20">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Waitlist Alert</p>
                    <p className="font-bold text-sm">High Demand</p>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  Bridal wear requests have exceeded tailor capacity in Bangalore. Authorization of new local artisans is recommended.
                </p>
                <Button size="sm" className="w-full text-[10px] font-bold uppercase tracking-wider bg-white text-gray-900 hover:bg-gray-100 h-8">
                  View Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
