import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Wallet,
  Download,
  Filter,
  ChevronRight,
  CreditCard,
  PieChart,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { monthlyEarnings, categoryPerformance, dailyEarnings } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function TailorEarnings() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");

  const totalRevenue = monthlyEarnings.reduce((sum, e) => sum + e.revenue, 0);
  const currentMonth = monthlyEarnings[monthlyEarnings.length - 1];
  const lastMonth = monthlyEarnings[monthlyEarnings.length - 2];

  const periods = [
    { id: "daily", label: "Today" },
    { id: "weekly", label: "This Week" },
    { id: "monthly", label: "This Month" },
    { id: "yearly", label: "This Year" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="w-full px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Earnings Center
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Real-time revenue tracking and performance insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-9 border-amber-200 text-amber-700 hover:bg-amber-50 font-bold uppercase tracking-wider text-xs shadow-sm hidden sm:flex">
                <Download className="w-3.5 h-3.5 mr-2" /> Export
              </Button>
              <Button size="sm" className="h-9 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 font-bold uppercase tracking-wider text-xs">
                <Wallet className="w-3.5 h-3.5 mr-2" /> Withdraw
              </Button>
            </div>
          </div>

          {/* Period Selector - Mobile Scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide pt-4 -mx-1 px-1">
            {periods.map((p) => (
              <Button
                key={p.id}
                variant={period === p.id ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 rounded-full text-[10px] font-bold uppercase tracking-wider px-4 shrink-0 transition-all",
                  period === p.id
                    ? "bg-amber-600 shadow-md shadow-amber-900/20 text-white hover:bg-amber-700"
                    : "bg-transparent text-gray-500 hover:text-amber-600 hover:bg-amber-50"
                )}
                onClick={() => setPeriod(p.id as any)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 pt-8 space-y-6">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-border/50 shadow-soft bg-gradient-to-br from-card to-amber-500/5">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-200 shadow-sm transition-transform group-hover:scale-110">
                  <IndianRupee className="w-5 h-5 text-amber-700" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">Settled</Badge>
              </div>
              <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest mb-1">Total Balance</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold">₹{(124500).toLocaleString()}</h2>
                <span className="text-green-600 text-[10px] flex items-center gap-0.5 font-bold">
                  <TrendingUp className="w-3 h-3" /> 12%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-soft">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm">
                  <CreditCard className="w-5 h-5 text-blue-700" />
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-[10px]">Pending</Badge>
              </div>
              <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest mb-1">Coming Payout</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold">₹{(8450).toLocaleString()}</h2>
                <span className="text-muted-foreground text-[9px] font-medium">Est. Jan 20</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-soft sm:col-span-2 lg:col-span-1">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center border border-purple-200 shadow-sm">
                  <BarChart3 className="w-5 h-5 text-purple-700" />
                </div>
                <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 text-[10px]">Orders</Badge>
              </div>
              <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest mb-1">Average Order</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold">₹3,420</h2>
                <span className="text-green-600 text-[10px] flex items-center gap-0.5 font-bold">
                  <ArrowUpRight className="w-3 h-3" /> 5%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <Card className="lg:col-span-2 border-border/50 shadow-soft overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/5">
              <div>
                <CardTitle className="text-base font-bold">Revenue Analytics</CardTitle>
                <CardDescription>Monthly growth performance for 2024</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-4">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-[10px] font-medium text-muted-foreground">Revenue</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[250px] w-full flex items-end justify-between gap-1.5 sm:gap-4 px-2">
                {monthlyEarnings.map((data, i) => {
                  const height = (data.revenue / 110000) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full">
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover border border-border shadow-md rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none min-w-[70px] text-center">
                        <p className="text-[9px] font-bold text-muted-foreground">{data.month}</p>
                        <p className="text-[11px] font-bold text-primary">₹{data.revenue.toLocaleString()}</p>
                      </div>

                      {/* Bar Container */}
                      <div className="w-full flex-1 flex flex-col justify-end">
                        <div
                          className={cn(
                            "w-full rounded-sm transition-all duration-500 group-hover:brightness-110",
                            i === monthlyEarnings.length - 1
                              ? "bg-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
                              : "bg-amber-500/20 group-hover:bg-amber-500/40"
                          )}
                          style={{ height: `${height}%` }}
                        >
                          {/* Shimmer effect for current month */}
                          {i === monthlyEarnings.length - 1 && (
                            <div className="w-full h-full bg-gradient-to-t from-transparent to-white/10 animate-pulse rounded-sm" />
                          )}
                        </div>
                      </div>

                      {/* Month Label */}
                      <span className="text-[9px] font-bold text-muted-foreground/70 uppercase">
                        {data.month.split(' ')[0].substring(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card className="border-border/50 shadow-soft">
            <CardHeader className="pb-3 bg-muted/5">
              <CardTitle className="text-base font-bold">Sales by Category</CardTitle>
              <CardDescription>Distribution of revenue across services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              {categoryPerformance.map((cat, i) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="text-muted-foreground font-bold">{cat.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}

              <Separator className="my-4" />

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <h4 className="text-xs font-bold text-amber-900 mb-1">Quick Insight</h4>
                <p className="text-[10px] text-amber-800 leading-relaxed">
                  <span className="font-bold">Blouses</span> continue to be your top performing category, contributing over 45% of your total revenue this month.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border-border/50 shadow-soft overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
            <div>
              <CardTitle className="text-lg">Financial History</CardTitle>
              <CardDescription>Review your recent payouts and earnings</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider">
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-muted/10 text-muted-foreground">
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider">Reference</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider">Date</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider">Month</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {monthlyEarnings.slice(-5).reverse().map((e, i) => (
                    <tr key={i} className="hover:bg-muted/5 transition-colors group cursor-pointer" onClick={() => alert(`Details for TRX-2024-${1000 - i}`)}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center border border-border/50 shadow-sm shrink-0">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium">TRX-2024-{1000 - i}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">Dec {31 - i}, 2024</td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-[10px] font-bold bg-background shadow-sm uppercase tracking-tight">
                          {e.month}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-bold text-primary">₹{e.revenue.toLocaleString()}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View for Transactions */}
            <div className="md:hidden divide-y divide-border/50">
              {monthlyEarnings.slice(-5).reverse().map((e, i) => (
                <div
                  key={i}
                  className="p-4 flex items-center justify-between active:bg-muted/20 transition-colors"
                  onClick={() => alert(`Transaction: TRX-2024-${1000 - i}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center border border-border/50 shadow-sm shrink-0">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">TRX-2024-{1000 - i}</p>
                      <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-tight">
                        {e.month} • Dec {31 - i}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-amber-700">₹{e.revenue.toLocaleString()}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tip Section Redesign */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 rounded-2xl relative overflow-hidden group shadow-lg shadow-amber-900/20">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12">
            <TrendingUp className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h4 className="font-bold text-white text-base">Performance Tip</h4>
              <p className="text-xs text-white/90 leading-relaxed max-w-2xl">
                Tailors who respond to "Correction Requests" within 24 hours see a <span className="font-bold underline">15% higher completion rate</span> and better customer ratings. Check your pending designs now!
              </p>
            </div>
            <Button className="bg-white text-amber-700 hover:bg-white/90 font-bold px-6 h-10 w-full sm:w-auto shadow-xl">
              Review Feedback
            </Button>
          </div>
        </div>

        {/* Footer Actions for Mobile */}
        <div className="sm:hidden grid grid-cols-2 gap-3 pb-4">
          <Button variant="outline" className="h-11 border-border/50 bg-card shadow-soft font-bold">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="h-11 bg-primary shadow-lg shadow-primary/20 font-bold">
            <Wallet className="w-4 h-4 mr-2" /> Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
}

