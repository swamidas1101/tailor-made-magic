import { Users, ShoppingBag, Scissors, IndianRupee, TrendingUp, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Total Tailors", value: "48", change: "+5 this month", icon: Users, color: "bg-blue-500" },
  { label: "Active Orders", value: "156", change: "+23 this week", icon: ShoppingBag, color: "bg-green-500" },
  { label: "Total Designs", value: "524", change: "+12 pending", icon: Scissors, color: "bg-purple-500" },
  { label: "Revenue (MTD)", value: "₹4.2L", change: "+18% vs last month", icon: IndianRupee, color: "bg-amber-500" },
];

const recentTailors = [
  { id: 1, name: "Rajesh Sharma", status: "pending", designs: 12, date: "Jan 6, 2026" },
  { id: 2, name: "Priya Patel", status: "approved", designs: 28, date: "Jan 5, 2026" },
  { id: 3, name: "Mohammed Khan", status: "pending", designs: 8, date: "Jan 5, 2026" },
  { id: 4, name: "Anita Desai", status: "blocked", designs: 0, date: "Jan 4, 2026" },
];

const recentOrders = [
  { id: "ORD-001", customer: "Vikram Singh", design: "Wedding Sherwani", amount: 12500, status: "processing" },
  { id: "ORD-002", customer: "Meera Reddy", design: "Embroidered Blouse", amount: 2200, status: "completed" },
  { id: "ORD-003", customer: "Arjun Nair", design: "Formal Suit", amount: 8500, status: "pending" },
  { id: "ORD-004", customer: "Kavitha Iyer", design: "Silk Saree Blouse", amount: 1800, status: "processing" },
];

export default function AdminOverview() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Administrator</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    {stat.change}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tailors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">Recent Tailors</CardTitle>
            <a href="/admin/tailors" className="text-sm text-primary hover:underline">View All</a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTailors.map((tailor) => (
                <div key={tailor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {tailor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{tailor.name}</p>
                      <p className="text-xs text-muted-foreground">{tailor.designs} designs • {tailor.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    tailor.status === "approved" ? "bg-green-100 text-green-700" :
                    tailor.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {tailor.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">Recent Orders</CardTitle>
            <a href="/admin/orders" className="text-sm text-primary hover:underline">View All</a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      {order.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : order.status === "processing" ? (
                        <Clock className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{order.design}</p>
                      <p className="text-xs text-muted-foreground">{order.customer} • {order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{order.amount.toLocaleString()}</p>
                    <span className={`text-xs font-medium ${
                      order.status === "completed" ? "text-green-600" :
                      order.status === "processing" ? "text-blue-600" :
                      "text-yellow-600"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
