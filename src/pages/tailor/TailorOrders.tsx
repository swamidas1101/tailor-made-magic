import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, Package } from "lucide-react";

const orders = [
  { id: "ORD-001", customer: "Vikram Singh", design: "Wedding Sherwani", amount: 15000, status: "processing", date: "Jan 5, 2026", delivery: "Jan 15, 2026" },
  { id: "ORD-002", customer: "Meera Reddy", design: "Silk Blouse", amount: 2400, status: "completed", date: "Jan 2, 2026", delivery: "Jan 6, 2026" },
  { id: "ORD-003", customer: "Sneha Kapoor", design: "Kids Party Dress", amount: 1500, status: "pending", date: "Jan 7, 2026", delivery: "Jan 17, 2026" },
];

export default function TailorOrders() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8"><h1 className="text-2xl lg:text-3xl font-display font-bold">My Orders</h1><p className="text-muted-foreground mt-1">Track and manage your orders</p></div>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    {order.status === "completed" ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : order.status === "processing" ? <Package className="w-6 h-6 text-blue-500" /> : <Clock className="w-6 h-6 text-yellow-500" />}
                  </div>
                  <div><p className="font-semibold">{order.design}</p><p className="text-sm text-muted-foreground">{order.customer} • {order.id}</p><p className="text-xs text-muted-foreground">Delivery: {order.delivery}</p></div>
                </div>
                <div className="text-right"><p className="text-xl font-bold text-primary">₹{order.amount.toLocaleString()}</p><Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
