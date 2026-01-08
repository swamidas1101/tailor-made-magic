import { ShoppingBag, IndianRupee, Star, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Total Orders", value: "156", change: "+12 this month", icon: ShoppingBag, color: "bg-blue-500" },
  { label: "Earnings (MTD)", value: "₹45,200", change: "+18%", icon: IndianRupee, color: "bg-green-500" },
  { label: "Active Designs", value: "28", change: "3 pending", icon: Star, color: "bg-purple-500" },
  { label: "Avg. Rating", value: "4.8", change: "+0.1", icon: TrendingUp, color: "bg-amber-500" },
];

const recentOrders = [
  { id: "ORD-001", customer: "Vikram Singh", design: "Wedding Sherwani", amount: 15000, status: "processing" },
  { id: "ORD-002", customer: "Meera Reddy", design: "Silk Blouse", amount: 2400, status: "completed" },
  { id: "ORD-003", customer: "Sneha Kapoor", design: "Kids Party Dress", amount: 1500, status: "pending" },
];

export default function TailorOverview() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Master Tailor</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    {order.status === "completed" ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div><p className="font-medium">{order.design}</p><p className="text-xs text-muted-foreground">{order.customer} • {order.id}</p></div>
                </div>
                <div className="text-right"><p className="font-bold">₹{order.amount.toLocaleString()}</p><span className={`text-xs font-medium ${order.status === "completed" ? "text-green-600" : "text-blue-600"}`}>{order.status}</span></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
