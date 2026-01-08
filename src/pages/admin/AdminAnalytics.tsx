import { TrendingUp, TrendingDown, Users, ShoppingBag, IndianRupee, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Total Revenue", value: "₹12.5L", change: "+18%", trend: "up", icon: IndianRupee },
  { label: "Total Orders", value: "1,234", change: "+12%", trend: "up", icon: ShoppingBag },
  { label: "Active Tailors", value: "48", change: "+5", trend: "up", icon: Users },
  { label: "Avg. Rating", value: "4.7", change: "+0.2", trend: "up", icon: Star },
];

const monthlyData = [
  { month: "Aug", orders: 89, revenue: 245000 },
  { month: "Sep", orders: 112, revenue: 312000 },
  { month: "Oct", orders: 145, revenue: 425000 },
  { month: "Nov", orders: 178, revenue: 520000 },
  { month: "Dec", orders: 234, revenue: 680000 },
  { month: "Jan", orders: 156, revenue: 420000 },
];

const topTailors = [
  { name: "Priya Patel", orders: 156, revenue: 285000, rating: 4.9 },
  { name: "Suresh Kumar", orders: 134, revenue: 245000, rating: 4.7 },
  { name: "Lakshmi Iyer", orders: 128, revenue: 220000, rating: 4.8 },
  { name: "Rajesh Sharma", orders: 98, revenue: 195000, rating: 4.6 },
  { name: "Mohammed Khan", orders: 87, revenue: 165000, rating: 4.5 },
];

const topCategories = [
  { name: "Blouses", orders: 345, percentage: 28 },
  { name: "Wedding Wear", orders: 234, percentage: 19 },
  { name: "Men's Formal", orders: 198, percentage: 16 },
  { name: "Ethnic Wear", orders: 167, percentage: 14 },
  { name: "Kids Wear", orders: 145, percentage: 12 },
  { name: "Others", orders: 145, percentage: 11 },
];

export default function AdminAnalytics() {
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">Business insights and performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex items-center gap-4">
                  <span className="text-sm w-8 text-muted-foreground">{data.month}</span>
                  <div className="flex-1 h-8 bg-muted/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-gold rounded-full transition-all duration-500"
                      style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-20 text-right">₹{(data.revenue / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category) => (
                <div key={category.name} className="flex items-center gap-4">
                  <span className="text-sm flex-1">{category.name}</span>
                  <div className="w-32 h-3 bg-muted/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{category.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Tailors */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Tailors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rank</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tailor</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Orders</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rating</th>
                </tr>
              </thead>
              <tbody>
                {topTailors.map((tailor, index) => (
                  <tr key={tailor.name} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-4 px-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? "bg-yellow-100 text-yellow-700" :
                        index === 1 ? "bg-gray-100 text-gray-700" :
                        index === 2 ? "bg-orange-100 text-orange-700" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {tailor.name.charAt(0)}
                        </div>
                        <span className="font-medium">{tailor.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">{tailor.orders}</td>
                    <td className="py-4 px-4 font-semibold">₹{(tailor.revenue / 1000).toFixed(0)}K</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{tailor.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
