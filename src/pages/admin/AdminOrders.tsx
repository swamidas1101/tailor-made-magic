import { useState } from "react";
import { Search, Eye, Clock, CheckCircle2, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  customer: string;
  phone: string;
  design: string;
  tailor: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  deliveryDate: string;
  size: string;
  withMaterial: boolean;
}

const initialOrders: Order[] = [
  { id: "ORD-001", customer: "Vikram Singh", phone: "+91 98765 43210", design: "Wedding Sherwani", tailor: "Rajesh Sharma", amount: 15000, status: "processing", createdAt: "Jan 5, 2026", deliveryDate: "Jan 15, 2026", size: "L", withMaterial: true },
  { id: "ORD-002", customer: "Meera Reddy", phone: "+91 98765 43211", design: "Silk Blouse", tailor: "Priya Patel", amount: 2400, status: "delivered", createdAt: "Jan 2, 2026", deliveryDate: "Jan 6, 2026", size: "M", withMaterial: true },
  { id: "ORD-003", customer: "Arjun Nair", phone: "+91 98765 43212", design: "Corporate Blazer", tailor: "Mohammed Khan", amount: 6000, status: "pending", createdAt: "Jan 7, 2026", deliveryDate: "Jan 17, 2026", size: "XL", withMaterial: true },
  { id: "ORD-004", customer: "Kavitha Iyer", phone: "+91 98765 43213", design: "Embroidered Blouse", tailor: "Lakshmi Iyer", amount: 1800, status: "shipped", createdAt: "Jan 4, 2026", deliveryDate: "Jan 10, 2026", size: "S", withMaterial: false },
  { id: "ORD-005", customer: "Rohit Mehta", phone: "+91 98765 43214", design: "Formal Suit", tailor: "Suresh Kumar", amount: 8500, status: "confirmed", createdAt: "Jan 6, 2026", deliveryDate: "Jan 20, 2026", size: "L", withMaterial: true },
  { id: "ORD-006", customer: "Sneha Kapoor", phone: "+91 98765 43215", design: "Kids Party Dress", tailor: "Priya Patel", amount: 1500, status: "processing", createdAt: "Jan 3, 2026", deliveryDate: "Jan 12, 2026", size: "Kids-6", withMaterial: true },
];

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusIcons: Record<OrderStatus, any> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: Clock,
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.design.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
    toast.success(`Order status updated to ${newStatus}`);
  };

  const stats = [
    { label: "Total Orders", value: orders.length, color: "text-primary" },
    { label: "Pending", value: orders.filter(o => o.status === "pending").length, color: "text-yellow-600" },
    { label: "Processing", value: orders.filter(o => ["confirmed", "processing"].includes(o.status)).length, color: "text-blue-600" },
    { label: "Delivered", value: orders.filter(o => o.status === "delivered").length, color: "text-green-600" },
  ];

  const totalRevenue = orders.filter(o => o.status === "delivered").reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Order Management</h1>
        <p className="text-muted-foreground mt-1">Track and manage all customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Revenue (Delivered)</p>
            <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "processing", "shipped", "delivered"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Design</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Tailor</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-4 px-4 font-mono text-sm">{order.id}</td>
                      <td className="py-4 px-4">
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell text-sm">{order.design}</td>
                      <td className="py-4 px-4 hidden lg:table-cell text-sm">{order.tailor}</td>
                      <td className="py-4 px-4 font-semibold">₹{order.amount.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Order {selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.phone}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Tailor</p>
                  <p className="font-medium">{selectedOrder.tailor}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Design</p>
                  <p className="font-medium">{selectedOrder.design}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Size</p>
                  <p className="font-medium">{selectedOrder.size}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-bold text-primary">₹{selectedOrder.amount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">With Material</p>
                  <p className="font-medium">{selectedOrder.withMaterial ? "Yes" : "No"}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Order Date</p>
                  <p className="font-medium">{selectedOrder.createdAt}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Delivery Date</p>
                  <p className="font-medium">{selectedOrder.deliveryDate}</p>
                </div>
              </div>

              <div className="pt-4">
                <label className="text-sm font-medium mb-2 block">Update Status</label>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => {
                    handleStatusChange(selectedOrder.id, value as OrderStatus);
                    setSelectedOrder({ ...selectedOrder, status: value as OrderStatus });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
