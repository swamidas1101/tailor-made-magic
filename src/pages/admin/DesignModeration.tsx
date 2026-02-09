import { useState } from "react";
import { Search, CheckCircle2, XCircle, Eye, Clock, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { designs as initialMockDesigns, Design } from "@/data/mockData";
import { cn } from "@/lib/utils";

// Using designs from mockData
const initialDesigns = initialMockDesigns.map(d => ({
  ...d,
  tailor: "Meera Kumari", // Mock tailor name for all
})) as (Design & { tailor: string })[];

type ModerationDesign = Design & { tailor: string };

export default function DesignModeration() {
  const [designs, setDesigns] = useState<ModerationDesign[]>(initialDesigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDesign, setSelectedDesign] = useState<ModerationDesign | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [correctionDialogOpen, setCorrectionDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const filteredDesigns = designs.filter((design) => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.tailor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || design.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (designId: string | number, newStatus: Design['status'], feedbackMsg?: string) => {
    setDesigns(designs.map(d =>
      d.id === designId ? { ...d, status: newStatus, adminFeedback: feedbackMsg } : d
    ));
    toast.success(`Design ${newStatus.replace('_', ' ')} successfully`);
    if (newStatus === 'correction_requested') {
      setCorrectionDialogOpen(false);
      setFeedback("");
    }
  };

  const stats = [
    { label: "Pending", value: designs.filter(d => d.status === "pending").length, icon: Clock, color: "text-amber-600" },
    { label: "Approved", value: designs.filter(d => d.status === "approved").length, icon: CheckCircle2, color: "text-green-600" },
    { label: "Correction", value: designs.filter(d => d.status === "correction_requested").length, icon: AlertCircle, color: "text-blue-600" },
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
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "approved", "rejected", "correction_requested"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                >
                  {status === 'correction_requested' ? "Correction" : status}
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
                className={cn(
                  "absolute top-3 right-3 shadow-sm",
                  design.status === 'approved' ? "bg-green-500 hover:bg-green-600" :
                    design.status === 'pending' ? "bg-amber-500 hover:bg-amber-600" :
                      design.status === 'correction_requested' ? "bg-blue-500 hover:bg-blue-600" :
                        "bg-red-500 hover:bg-red-600"
                )}
              >
                {design.status === 'correction_requested' ? "CORRECTION" : design.status.toUpperCase()}
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
                      className="bg-green-600 hover:bg-green-700 h-8 px-2"
                      onClick={() => handleStatusChange(design.id, "approved")}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 h-8 px-2"
                      onClick={() => {
                        setSelectedDesign(design);
                        setCorrectionDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 px-2"
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

      {/* Correction Request Dialog */}
      <Dialog open={correctionDialogOpen} onOpenChange={setCorrectionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Correction</DialogTitle>
            <DialogDescription>
              Provide clear feedback to the tailor on what needs to be fixed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Correction Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="e.g., Please update the image resolution or clarify the fabric type..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCorrectionDialogOpen(false)}>Cancel</Button>
            <Button
              disabled={!feedback.trim()}
              onClick={() => selectedDesign && handleStatusChange(selectedDesign.id, 'correction_requested', feedback)}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
