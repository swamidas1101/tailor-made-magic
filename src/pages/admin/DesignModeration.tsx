import { useState } from "react";
import { Search, CheckCircle2, XCircle, Eye, Clock } from "lucide-react";
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
import { toast } from "sonner";

interface Design {
  id: number;
  name: string;
  category: string;
  tailor: string;
  price: number;
  priceWithMaterial: number;
  status: "pending" | "approved" | "rejected";
  image: string;
  submittedAt: string;
  description: string;
}

const initialDesigns: Design[] = [
  { id: 1, name: "Elegant Silk Blouse", category: "Blouse", tailor: "Priya Patel", price: 1200, priceWithMaterial: 2400, status: "pending", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", submittedAt: "2 hours ago", description: "Beautiful silk blouse with intricate embroidery work." },
  { id: 2, name: "Wedding Sherwani", category: "Men's Wear", tailor: "Rajesh Sharma", price: 8000, priceWithMaterial: 15000, status: "pending", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400", submittedAt: "5 hours ago", description: "Premium wedding sherwani with gold zari work." },
  { id: 3, name: "Kids Party Dress", category: "Kids Wear", tailor: "Suresh Kumar", price: 800, priceWithMaterial: 1500, status: "approved", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400", submittedAt: "1 day ago", description: "Colorful party dress for kids aged 4-8 years." },
  { id: 4, name: "Corporate Blazer", category: "Formal Wear", tailor: "Mohammed Khan", price: 3500, priceWithMaterial: 6000, status: "pending", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", submittedAt: "3 hours ago", description: "Professional blazer for corporate settings." },
  { id: 5, name: "Traditional Lehenga", category: "Ethnic Wear", tailor: "Lakshmi Iyer", price: 5000, priceWithMaterial: 12000, status: "rejected", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400", submittedAt: "2 days ago", description: "Traditional lehenga with mirror work." },
];

export default function DesignModeration() {
  const [designs, setDesigns] = useState<Design[]>(initialDesigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filteredDesigns = designs.filter((design) => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.tailor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || design.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (designId: number, newStatus: "approved" | "rejected") => {
    setDesigns(designs.map(d => 
      d.id === designId ? { ...d, status: newStatus } : d
    ));
    toast.success(`Design ${newStatus} successfully`);
  };

  const stats = [
    { label: "Pending Review", value: designs.filter(d => d.status === "pending").length, icon: Clock, color: "text-yellow-600" },
    { label: "Approved", value: designs.filter(d => d.status === "approved").length, icon: CheckCircle2, color: "text-green-600" },
    { label: "Rejected", value: designs.filter(d => d.status === "rejected").length, icon: XCircle, color: "text-red-600" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-bold">Design Moderation</h1>
        <p className="text-muted-foreground mt-1">Review and approve tailor designs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
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
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
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

      {/* Designs Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDesigns.map((design) => (
          <Card key={design.id} className="overflow-hidden hover-lift">
            <div className="relative aspect-[4/3]">
              <img src={design.image} alt={design.name} className="w-full h-full object-cover" />
              <Badge 
                className="absolute top-3 right-3"
                variant={
                  design.status === "approved" ? "default" :
                  design.status === "pending" ? "secondary" : "destructive"
                }
              >
                {design.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{design.name}</h3>
              <p className="text-sm text-muted-foreground">{design.category} • by {design.tailor}</p>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-lg font-bold text-primary">₹{design.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">₹{design.priceWithMaterial.toLocaleString()} with material</p>
                </div>
                <p className="text-xs text-muted-foreground">{design.submittedAt}</p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedDesign(design);
                    setViewDialogOpen(true);
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" /> View
                </Button>
                {design.status === "pending" && (
                  <>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleStatusChange(design.id, "approved")}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleStatusChange(design.id, "rejected")}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Design Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Design Details</DialogTitle>
            <DialogDescription>Review design submission</DialogDescription>
          </DialogHeader>
          {selectedDesign && (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img src={selectedDesign.image} alt={selectedDesign.name} className="w-full h-full object-cover" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">{selectedDesign.name}</h3>
                <p className="text-muted-foreground">{selectedDesign.category}</p>
              </div>

              <p className="text-sm">{selectedDesign.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Tailor</p>
                  <p className="font-medium">{selectedDesign.tailor}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="font-medium">{selectedDesign.submittedAt}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Price (Without Material)</p>
                  <p className="font-medium">₹{selectedDesign.price.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Price (With Material)</p>
                  <p className="font-medium">₹{selectedDesign.priceWithMaterial.toLocaleString()}</p>
                </div>
              </div>

              {selectedDesign.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1" 
                    onClick={() => {
                      handleStatusChange(selectedDesign.id, "approved");
                      setViewDialogOpen(false);
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve Design
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => {
                      handleStatusChange(selectedDesign.id, "rejected");
                      setViewDialogOpen(false);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
