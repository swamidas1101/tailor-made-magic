import { useState, useEffect } from "react";
import { Search, MoreVertical, CheckCircle2, XCircle, Eye, Ban, UserCheck, Scissors, Star, ShoppingBag, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminService } from "@/services/adminService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface Tailor {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "blocked" | "submitted";
  designs: number;
  orders: number;
  rating: number;
  joinDate: string;
  specialty: string;
  kytData?: any;
}

export default function TailorManagement() {
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTailor, setSelectedTailor] = useState<Tailor | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTailors = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllTailorsWithStats();
      setTailors(data as any);
    } catch (error) {
      console.error("Error fetching tailors:", error);
      toast.error("Failed to load tailors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTailors();
  }, []);

  const filteredTailors = tailors.filter((tailor) => {
    const matchesSearch = tailor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tailor.email.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (filterStatus === 'pending') {
      matchesFilter = tailor.status === 'submitted' || tailor.status === 'pending';
    } else if (filterStatus !== 'all') {
      matchesFilter = tailor.status === filterStatus;
    }

    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (tailorId: string, newStatus: "approved" | "blocked") => {
    const loadingToast = toast.loading(`Updating tailor status...`);
    try {
      await adminService.updateTailorStatus(tailorId, newStatus);
      setTailors(tailors.map(t =>
        t.id === tailorId ? { ...t, status: newStatus } : t
      ));
      toast.success(`Tailor ${newStatus}`, { id: loadingToast });
      setViewDialogOpen(false);
    } catch (error) {
      toast.error("Operation failed", { id: loadingToast });
    }
  };

  const stats = [
    { label: "Total Tailors", value: tailors.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending", value: tailors.filter(t => t.status === "submitted" || t.status === "pending").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active", value: tailors.filter(t => t.status === "approved").length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Blocked", value: tailors.filter(t => t.status === "blocked").length, icon: Ban, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Tailor Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage tailor accounts and verifications</p>
        </div>
        <Button onClick={fetchTailors} variant="outline" size="sm" className="h-9">
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 border-border/50"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px] h-10">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tailors List - Cards on Mobile, Table on Desktop */}
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-muted/20 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTailors.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-medium text-muted-foreground">No tailors found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {filteredTailors.map((tailor) => (
              <Card key={tailor.id} className="border-border/50 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center font-bold text-amber-600 text-lg shrink-0">
                        {tailor.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{tailor.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{tailor.email}</p>
                      </div>
                    </div>
                    <Badge className={cn(
                      "text-[9px] font-bold shrink-0",
                      tailor.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                        tailor.status === 'blocked' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                    )}>
                      {tailor.status === 'submitted' ? 'PENDING' : tailor.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs font-bold">{tailor.designs}</p>
                      <p className="text-[9px] text-muted-foreground">Designs</p>
                    </div>
                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs font-bold">{tailor.orders}</p>
                      <p className="text-[9px] text-muted-foreground">Orders</p>
                    </div>
                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs font-bold flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {tailor.rating}
                      </p>
                      <p className="text-[9px] text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-9"
                      onClick={() => {
                        setSelectedTailor(tailor);
                        setViewDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {tailor.status !== "approved" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(tailor.id, "approved")}>
                            <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {tailor.status !== "blocked" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(tailor.id, "blocked")} className="text-red-600">
                            <Ban className="w-4 h-4 mr-2" />
                            Block
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <Card className="hidden lg:block border-border/50 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Tailor</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Specialty</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Designs</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Orders</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Rating</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredTailors.map((tailor) => (
                      <tr key={tailor.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center font-bold text-amber-600">
                              {tailor.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{tailor.name}</p>
                              <p className="text-xs text-muted-foreground">{tailor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-xs text-muted-foreground">{tailor.specialty.split(',')[0]}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className="text-xs">{tailor.designs}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-sm font-semibold">{tailor.orders}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-sm font-semibold">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {tailor.rating}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={cn(
                            "text-[9px] font-bold",
                            tailor.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                              tailor.status === 'blocked' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                          )}>
                            {tailor.status === 'submitted' ? 'PENDING' : tailor.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setSelectedTailor(tailor);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {tailor.status !== "approved" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(tailor.id, "approved")}>
                                    <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                                    Approve
                                  </DropdownMenuItem>
                                )}
                                {tailor.status !== "blocked" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(tailor.id, "blocked")} className="text-red-600">
                                    <Ban className="w-4 h-4 mr-2" />
                                    Block
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Tailor Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTailor && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-2xl font-bold text-amber-700">
                    {selectedTailor.name.charAt(0)}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedTailor.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTailor.email}</p>
                  </div>
                </div>
              </DialogHeader>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border bg-card text-center">
                  <Scissors className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <p className="text-lg font-bold">{selectedTailor.designs}</p>
                  <p className="text-xs text-muted-foreground">Designs</p>
                </div>
                <div className="p-3 rounded-xl border bg-card text-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-lg font-bold">{selectedTailor.orders}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div className="p-3 rounded-xl border bg-card text-center">
                  <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-lg font-bold">{selectedTailor.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>

              <Separator />

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Phone</p>
                  <p className="text-sm font-medium">{selectedTailor.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Specialty</p>
                  <p className="text-sm font-medium">{selectedTailor.specialty}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Joined</p>
                  <p className="text-sm font-medium">{selectedTailor.joinDate}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Status</p>
                  <Badge className={cn(
                    "text-xs",
                    selectedTailor.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      selectedTailor.status === 'blocked' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                  )}>
                    {selectedTailor.status === 'submitted' ? 'PENDING' : selectedTailor.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-3">
                {selectedTailor.status !== "approved" && (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange(selectedTailor.id, "approved")}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                )}
                {selectedTailor.status !== "blocked" && (
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:bg-red-50"
                    onClick={() => handleStatusChange(selectedTailor.id, "blocked")}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Block
                  </Button>
                )}
                {selectedTailor.status === "blocked" && (
                  <Button
                    className="flex-1"
                    onClick={() => handleStatusChange(selectedTailor.id, "approved")}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Unblock
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
