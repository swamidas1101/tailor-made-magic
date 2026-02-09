import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  Package,
  Search,
  Filter,
  Calendar,
  IndianRupee,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const orders = [
  { id: "ORD-001", customer: "Vikram Singh", design: "Wedding Sherwani", amount: 15000, status: "processing", date: "Jan 5, 2026", delivery: "Jan 15, 2026", items: 1 },
  { id: "ORD-002", customer: "Meera Reddy", design: "Silk Blouse", amount: 2400, status: "completed", date: "Jan 2, 2026", delivery: "Jan 6, 2026", items: 2 },
  { id: "ORD-003", customer: "Sneha Kapoor", design: "Kids Party Dress", amount: 1500, status: "pending", date: "Jan 7, 2026", delivery: "Jan 17, 2026", items: 1 },
];

export default function TailorOrders() {
  return (
    <div className="p-4 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Active Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your current workflow and deliveries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 border-border/50 shadow-soft">
            <Calendar className="w-4 h-4 mr-2" /> Calendar View
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New", value: "1", color: "bg-blue-500", icon: Clock },
          { label: "Processing", value: "2", color: "bg-amber-500", icon: Package },
          { label: "Delivered", value: "12", color: "bg-green-500", icon: CheckCircle2 },
          { label: "Revenue", value: "₹45k", color: "bg-primary", icon: IndianRupee },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-soft overflow-hidden">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color}/10 flex items-center justify-center text-${stat.color.split('-')[1]}-600`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar - Horizontal Scroll on Mobile */}
      <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 h-10 border-0 bg-muted/30 focus-visible:ring-1" />
          </div>
          <Button variant="outline" size="sm" className="h-10 text-xs border-border/50 shrink-0">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="group hover:border-primary/30 transition-all duration-300 shadow-soft border-border/40 overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-base truncate">{order.customer}</h3>
                      <Badge
                        className={`text-[10px] font-bold shrink-0 ${order.status === 'completed' ? 'bg-green-500/10 text-green-700 border-green-200' :
                          order.status === 'processing' ? 'bg-amber-500/10 text-amber-700 border-amber-200' :
                            'bg-blue-500/10 text-blue-700 border-blue-200'
                          }`}
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{order.design}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/50">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Order ID</p>
                    <p className="text-xs font-semibold">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Due Date</p>
                    <p className="text-xs font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {order.delivery}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Amount</p>
                    <p className="text-xs font-semibold flex items-center text-green-600">
                      <IndianRupee className="w-3 h-3" /> {order.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Button size="sm" className="w-full h-8 bg-primary hover:bg-primary/90 text-xs">
                      View Details <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Add UserIcon to imports if missing or use fallback
function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// Helper for cn if not already imported correctly or missing but we have it from lib/utils
import { cn } from "@/lib/utils";
