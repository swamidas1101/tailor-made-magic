import { useState, useEffect } from "react";
import { Search, MoreVertical, CheckCircle2, XCircle, Eye, Ban, UserCheck, Scissors, Star, ShoppingBag, Clock, Users, Database, ShieldCheck, Mail, Phone, Calendar, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminService } from "@/services/adminService";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
    if (filterStatus === 'pending_approval') {
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
      toast.success(`Tailor marked as ${newStatus}`, { id: loadingToast });
      setViewDialogOpen(false);
    } catch (error) {
      toast.error("Operation failed", { id: loadingToast });
    }
  };

  const stats = [
    { label: "Artisan Registered", value: tailors.length, icon: Users, color: "text-amber-600", bg: "bg-amber-50/50" },
    { label: "Credential Review", value: tailors.filter(t => t.status === "submitted" || t.status === "pending").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50/50" },
    { label: "Active Network", value: tailors.filter(t => t.status === "approved").length, icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50/50" },
    { label: "Revoked Access", value: tailors.filter(t => t.status === "blocked").length, icon: Ban, color: "text-red-600", bg: "bg-red-50/50" },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-body">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Credential Control</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-[#1E1610]">Artisan Registry</h1>
          <p className="text-muted-foreground text-sm mt-1">Sovereign oversight of professional identities and platform permissions</p>
        </div>
        <Button onClick={fetchTailors} variant="outline" size="sm" className="h-10 border-border/50 bg-white shadow-soft font-bold rounded-xl px-6 text-[10px] uppercase tracking-widest transition-all hover:bg-amber-50">
          Sync Registry
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/30 shadow-soft group hover-lift transition-all overflow-hidden relative rounded-2xl">
            <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-10", stat.bg)} />
            <CardContent className="p-6 flex items-center gap-4 relative z-10">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-[#1E1610] tracking-tighter tabular-nums">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Control Bar */}
      <Card className="border-border/30 shadow-soft overflow-hidden rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by identity, email or establishment name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-muted/20 border-border/30 rounded-2xl focus-visible:ring-amber-500 transition-all font-semibold text-sm"
              />
            </div>
            <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full lg:w-auto">
              <TabsList className="bg-muted/30 p-1.5 h-12 rounded-2xl w-full lg:w-auto border border-border/10">
                <TabsTrigger value="all" className="px-6 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#1E1610] data-[state=active]:text-white">All Entities</TabsTrigger>
                <TabsTrigger value="pending_approval" className="px-6 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-[#1E1610]">Credentials</TabsTrigger>
                <TabsTrigger value="approved" className="px-6 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-green-600 data-[state=active]:text-white">Active</TabsTrigger>
                <TabsTrigger value="blocked" className="px-6 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-red-600 data-[state=active]:text-white">Blocked</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Tailors Table */}
      <Card className="border-border/30 shadow-soft overflow-hidden rounded-2xl bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/3 border-b border-border/20">
                  <th className="text-left py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Artisan Entity</th>
                  <th className="text-left py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 hidden md:table-cell">Core Mastery</th>
                  <th className="text-center py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 hidden lg:table-cell w-40">Portfolio Size</th>
                  <th className="text-center py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 hidden lg:table-cell">Trust Score</th>
                  <th className="text-left py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Governance</th>
                  <th className="text-right py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="py-8 px-8"><div className="h-12 bg-muted/20 rounded-2xl" /></td>
                    </tr>
                  ))
                ) : filteredTailors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-32 text-center text-muted-foreground italic font-semibold tracking-tight">No professional records discovered in the current subset</td>
                  </tr>
                ) : (
                  filteredTailors.map((tailor) => (
                    <tr key={tailor.id} className="hover:bg-muted/3 transition-colors group">
                      <td className="py-7 px-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center font-black text-amber-600 text-lg shadow-inner group-hover:scale-110 transition-transform ring-1 ring-amber-100/50">
                            {tailor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-base text-[#1E1610] tracking-tight">{tailor.name}</p>
                            <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{tailor.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-7 px-8 hidden md:table-cell max-w-[200px]">
                        <p className="text-[10px] font-black text-amber-600/70 border border-amber-600/10 bg-amber-50/20 px-3 py-1 rounded-lg inline-block uppercase tracking-wider truncate" title={tailor.specialty}>
                          {tailor.specialty.split(',')[0]}
                        </p>
                      </td>
                      <td className="py-7 px-8 hidden lg:table-cell text-center">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] font-black px-4 py-1 rounded-xl group-hover:bg-slate-200 transition-colors">
                          {tailor.designs} ITEMS
                        </Badge>
                      </td>
                      <td className="py-7 px-8 hidden lg:table-cell">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1.5 text-xs font-black text-[#1E1610] tabular-nums">
                            {tailor.orders} <ShoppingBag className="w-3.5 h-3.5 text-muted-foreground/40" />
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-amber-600 font-black mt-1">
                            <Star className="w-3 h-3 fill-current" /> {tailor.rating}
                          </div>
                        </div>
                      </td>
                      <td className="py-7 px-8">
                        <Badge className={cn(
                          "capitalize text-[9px] font-black px-3 py-1 border-none shadow-sm rounded-lg",
                          tailor.status === 'approved' ? 'text-green-600 bg-green-50' :
                            tailor.status === 'blocked' ? 'bg-red-50 text-red-600' :
                              'bg-amber-50 text-amber-700'
                        )}>
                          {tailor.status === 'submitted' ? 'CREDENTIAL_REVIEW' : tailor.status}
                        </Badge>
                      </td>
                      <td className="py-7 px-8">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedTailor(tailor);
                              setViewDialogOpen(true);
                            }}
                            className="h-10 w-10 text-amber-600 hover:bg-amber-50 rounded-2xl shadow-inner group/eye"
                          >
                            <Eye className="w-5 h-5 group-hover/eye:scale-110 transition-transform" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-muted rounded-2xl">
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-luxury border-border/30 bg-[#FDFCFB]">
                              {tailor.status !== "approved" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(tailor.id, "approved")} className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3 cursor-pointer hover:bg-green-50 focus:bg-green-50">
                                  <UserCheck className="w-4 h-4 mr-3 text-green-600" /> Grant Professional Access
                                </DropdownMenuItem>
                              )}
                              {tailor.status !== "blocked" && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(tailor.id, "blocked")}
                                  className="text-red-600 focus:text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest py-3 cursor-pointer hover:bg-red-50 focus:bg-red-50"
                                >
                                  <Ban className="w-4 h-4 mr-3" /> Revoke Permissions
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tailor Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
          {selectedTailor && (
            <div className="flex flex-col max-h-[90vh]">
              {/* Header Profile Section */}
              <div className="relative h-48 bg-neutral-900 flex items-end p-6 md:p-8 overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />

                <div className="relative z-10 flex items-end gap-6 w-full">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-1.5 shadow-xl shrink-0 -mb-12 md:-mb-14">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-4xl md:text-5xl font-display font-bold text-amber-700">
                      {selectedTailor.name.charAt(0)}
                    </div>
                  </div>

                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                        Artisan Profile
                      </Badge>
                      <span className="text-neutral-400 text-[10px] font-mono">#{selectedTailor.id.slice(0, 8)}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">{selectedTailor.name}</h2>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pt-16 md:pt-20 px-6 md:px-8 pb-8 space-y-8">

                {/* Stats Overview */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-border/40 bg-white shadow-sm text-center">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-2 text-amber-600">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Portfolio</p>
                    <p className="text-xl font-display font-bold text-foreground mt-0.5">{selectedTailor.designs}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/40 bg-white shadow-sm text-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-2 text-blue-600">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Orders</p>
                    <p className="text-xl font-display font-bold text-foreground mt-0.5">{selectedTailor.orders}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/40 bg-white shadow-sm text-center">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mx-auto mb-2 text-green-600">
                      <Star className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rating</p>
                    <p className="text-xl font-display font-bold text-foreground mt-0.5 flex items-center justify-center gap-1">
                      {selectedTailor.rating} <span className="text-sm text-muted-foreground font-sans font-medium">/ 5</span>
                    </p>
                  </div>
                </div>

                {/* Contact & Info */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600" /> Contact Info
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Email Address</p>
                          <p className="text-sm font-medium text-foreground">{selectedTailor.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Phone Number</p>
                          <p className="text-sm font-medium text-foreground">{selectedTailor.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-600" /> Professional
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Joined Platform</p>
                          <p className="text-sm font-medium text-foreground">{selectedTailor.joinDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Specialization</p>
                          <p className="text-sm font-medium text-foreground">{selectedTailor.specialty}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KYT Data Section (If Available) */}
                {selectedTailor.kytData && (
                  <div className="space-y-4 pt-4 border-t border-border/40">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-foreground flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600" /> Verification Data (KYT)
                    </h3>
                    <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 md:p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-purple-700/60 uppercase tracking-widest block mb-1">Aadhar Number</span>
                          <span className="font-mono font-medium text-purple-900 bg-white/50 px-2 py-1 rounded">{selectedTailor.kytData.documents?.aadharNumber || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-purple-700/60 uppercase tracking-widest block mb-1">PAN Number</span>
                          <span className="font-mono font-medium text-purple-900 bg-white/50 px-2 py-1 rounded">{selectedTailor.kytData.documents?.panNumber || "N/A"}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-purple-700/60 uppercase tracking-widest block mb-1">Shop Address</span>
                        <div className="bg-white/60 p-3 rounded-lg border border-purple-100/50">
                          <p className="text-sm text-purple-900 leading-relaxed font-medium">
                            {selectedTailor.kytData.address?.shopName && <span className="font-bold block text-purple-950 mb-0.5">{selectedTailor.kytData.address.shopName}</span>}
                            {selectedTailor.kytData.address?.shopAddress || "Address pending verification."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Footer Actions */}
              <div className="p-4 md:p-6 border-t border-border/40 bg-zinc-50/80 backdrop-blur-md shrink-0 flex gap-3">
                {selectedTailor.status !== "approved" && (
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 shadow-lg shadow-emerald-900/10 uppercase tracking-wide text-xs"
                    onClick={() => handleStatusChange(selectedTailor.id, "approved")}
                  >
                    <UserCheck className="w-4 h-4 mr-2" /> Approve Artisan
                  </Button>
                )}
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 h-11 font-bold uppercase tracking-wide text-xs border-border/50",
                    selectedTailor.status === 'blocked'
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border-amber-200"
                      : "text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                  )}
                  onClick={() => handleStatusChange(selectedTailor.id, selectedTailor.status === 'blocked' ? 'approved' : 'blocked' as any)}
                >
                  {selectedTailor.status === 'blocked' ? (
                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Unblock Access</>
                  ) : (
                    <><Ban className="w-4 h-4 mr-2" /> Suspend Account</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
