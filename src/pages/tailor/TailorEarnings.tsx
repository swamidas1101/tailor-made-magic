import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, TrendingUp } from "lucide-react";

const earnings = [
  { month: "January", orders: 12, amount: 45200 },
  { month: "December", orders: 18, amount: 62500 },
  { month: "November", orders: 15, amount: 51800 },
];

export default function TailorEarnings() {
  const total = earnings.reduce((sum, e) => sum + e.amount, 0);
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8"><h1 className="text-2xl lg:text-3xl font-display font-bold">Earnings</h1><p className="text-muted-foreground mt-1">Track your income and payouts</p></div>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card><CardContent className="p-6 flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center"><IndianRupee className="w-6 h-6 text-white" /></div><div><p className="text-sm text-muted-foreground">Total Earnings (3 months)</p><p className="text-2xl font-bold">₹{total.toLocaleString()}</p></div></CardContent></Card>
        <Card><CardContent className="p-6 flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-white" /></div><div><p className="text-sm text-muted-foreground">This Month</p><p className="text-2xl font-bold">₹{earnings[0].amount.toLocaleString()}</p></div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Monthly Breakdown</CardTitle></CardHeader><CardContent>
        <div className="space-y-4">
          {earnings.map((e) => (<div key={e.month} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"><div><p className="font-medium">{e.month}</p><p className="text-sm text-muted-foreground">{e.orders} orders completed</p></div><p className="text-xl font-bold text-primary">₹{e.amount.toLocaleString()}</p></div>))}
        </div>
      </CardContent></Card>
    </div>
  );
}
