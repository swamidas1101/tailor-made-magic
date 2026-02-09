import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, CheckCircle2, XCircle, Eye, Ban, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tailor {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "blocked" | "submitted"; // 'submitted' is the KYT status 'submitted' which we treat as pending approval
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

  useEffect(() => {
    fetchTailors();
  }, []);

  const fetchTailors = async () => {
    try {
      const q = query(collection(db, "users"), where("roles", "array-contains", "tailor"));
      const querySnapshot = await getDocs(q);
      const tailorData: Tailor[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let status: any = 'pending';

        if (data.kytStatus === 'approved') status = 'approved';
        else if (data.kytStatus === 'submitted') status = 'submitted'; // Special status for admin to see
        else if (data.kytStatus === 'rejected') status = 'blocked'; // Map rejected to blocked for now
        else status = 'pending'; // Default or in_progress

        tailorData.push({
          id: doc.id,
          name: data.name || "Unknown",
          email: data.email,
          phone: data.tailorProfile?.phone || data.phoneNumber || "N/A",
          status: status,
          designs: data.designsCount || 0,
          orders: data.ordersCount || 0,
          rating: data.rating || 0,
          joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A",
          specialty: data.tailorProfile?.specialization?.join(", ") || "N/A",
          kytData: data.kytData
        });
      });
      setTailors(tailorData);
    } catch (error) {
      console.error("Error fetching tailors:", error);
      toast.error("Failed to load tailors");
    } finally {
      setLoading(false);
    }
  };

  const filteredTailors = tailors.filter((tailor) => {
    const matchesSearch = tailor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tailor.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter mapping
    let matchesFilter = true;
    if (filterStatus === 'pending_approval') {
      matchesFilter = tailor.status === 'submitted';
    } else if (filterStatus !== 'all') {
      matchesFilter = tailor.status === filterStatus;
    }

    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (tailorId: string, newStatus: "approved" | "blocked") => {
    try {
      const kytStatus = newStatus === 'approved' ? 'approved' : 'rejected';
      await updateDoc(doc(db, "users", tailorId), {
        kytStatus: kytStatus
      });

      setTailors(tailors.map(t =>
        t.id === tailorId ? { ...t, status: newStatus } : t
      ));
      toast.success(`Tailor ${newStatus === "approved" ? "approved" : "blocked"} successfully`);
      setViewDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleViewTailor = (tailor: Tailor) => {
    setSelectedTailor(tailor);
    setViewDialogOpen(true);
  };

  const stats = [
    { label: "Total Tailors", value: tailors.length, color: "text-primary" },
    { label: "Pending Approval", value: tailors.filter(t => t.status === "submitted").length, color: "text-yellow-600" },
    { label: "Active Tailors", value: tailors.filter(t => t.status === "approved").length, color: "text-green-600" },
    { label: "Blocked", value: tailors.filter(t => t.status === "blocked").length, color: "text-red-600" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Tailor Management</h1>
        <p className="text-muted-foreground mt-1">Approve, manage, and monitor tailors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tailors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending_approval">Pending Approval</TabsTrigger>
                <TabsTrigger value="approved">Active</TabsTrigger>
                <TabsTrigger value="blocked">Blocked</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Tailors List */}
      <Card>
        <CardHeader>
          <CardTitle>Tailors ({filteredTailors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading tailors...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tailor</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Specialty</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Designs</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Orders</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTailors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">No tailors found</td>
                    </tr>
                  ) : (
                    filteredTailors.map((tailor) => (
                      <tr key={tailor.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {tailor.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{tailor.name}</p>
                              <p className="text-xs text-muted-foreground">{tailor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell text-sm">{tailor.specialty}</td>
                        <td className="py-4 px-4 hidden lg:table-cell text-sm">{tailor.designs}</td>
                        <td className="py-4 px-4 hidden lg:table-cell text-sm">{tailor.orders}</td>
                        <td className="py-4 px-4">
                          <Badge variant={
                            tailor.status === "approved" ? "default" :
                              tailor.status === "submitted" ? "secondary" :
                                tailor.status === "pending" ? "outline" : "destructive"
                          }>
                            {tailor.status === 'submitted' ? 'Pending Approval' : tailor.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewTailor(tailor)}>
                                  <Eye className="w-4 h-4 mr-2" /> View Details
                                </DropdownMenuItem>
                                {tailor.status !== "approved" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(tailor.id, "approved")}>
                                    <UserCheck className="w-4 h-4 mr-2" /> Approve
                                  </DropdownMenuItem>
                                )}
                                {tailor.status !== "blocked" && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(tailor.id, "blocked")}
                                    className="text-destructive"
                                  >
                                    <Ban className="w-4 h-4 mr-2" /> Block
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Tailor Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tailor Details</DialogTitle>
            <DialogDescription>View complete tailor information</DialogDescription>
          </DialogHeader>
          {selectedTailor && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {selectedTailor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedTailor.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTailor.specialty}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{selectedTailor.email}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{selectedTailor.phone}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Designs</p>
                  <p className="text-sm font-medium">{selectedTailor.designs}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="text-sm font-medium">{selectedTailor.orders}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="text-sm font-medium">{selectedTailor.rating || "N/A"}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium">{selectedTailor.joinDate}</p>
                </div>
              </div>

              {/* KYT Details Section */}
              {selectedTailor.kytData && (
                <div className="border-t pt-4 mt-2">
                  <h4 className="font-semibold mb-2">KYT Verification Data</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs block">Aadhar</span>
                      {selectedTailor.kytData.documents?.aadharNumber || "N/A"}
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block">PAN</span>
                      {selectedTailor.kytData.documents?.panNumber || "N/A"}
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground text-xs block">Shop Address</span>
                      {selectedTailor.kytData.address?.shopAddress || "N/A"}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedTailor.status !== "approved" && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (selectedTailor) handleStatusChange(selectedTailor.id, "approved");
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                  </Button>
                )}
                {selectedTailor.status !== "blocked" && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      if (selectedTailor) handleStatusChange(selectedTailor.id, "blocked");
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Block
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
