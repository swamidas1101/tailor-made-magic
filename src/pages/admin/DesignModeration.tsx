import { useState, useEffect } from "react";
import { Search, CheckCircle2, XCircle, Eye, Clock, AlertCircle, MessageSquare, ArrowRight, Scissors, User, Calendar, Tag, Filter, ShieldCheck, ChevronRight, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { adminService } from "@/services/adminService";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function DesignModeration() {
  const [designs, setDesigns] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDesign, setSelectedDesign] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [correctionDialogOpen, setCorrectionDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const data = await adminService.getModerationDesigns();
      setDesigns(data);
    } catch (error) {
      console.error("Error fetching moderation designs:", error);
      toast.error("Failed to load designs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const filteredDesigns = designs.filter((design) => {
    const matchesSearch = (design.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (design.tailor || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || design.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (designId: string, newStatus: string, feedbackMsg?: string) => {
    const loadingToast = toast.loading(`Updating design status...`);
    try {
      await adminService.updateDesignStatus(designId, newStatus, feedbackMsg);
      setDesigns(designs.map(d =>
        d.id === designId ? { ...d, status: newStatus, adminFeedback: feedbackMsg } : d
      ));
      toast.success(`Design ${newStatus.replace('_', ' ')} successfully`, { id: loadingToast });
      if (newStatus === 'correction_requested') {
        setCorrectionDialogOpen(false);
        setFeedback("");
      }
      setSelectedDesign(null);
      setViewDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update status", { id: loadingToast });
    }
  };

  const stats = [
    { label: "Pending", value: designs.filter(d => d.status === "pending").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Approved", value: designs.filter(d => d.status === "approved").length, icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
    { label: "Revisions", value: designs.filter(d => d.status === "correction_requested").length, icon: History, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Rejected", value: designs.filter(d => d.status === "rejected").length, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        <div className="w-full px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Quality Assurance</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Design Moderation
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Review and approve artisan design submissions
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 border-amber-200 text-amber-700 hover:bg-amber-50 font-bold uppercase tracking-wider text-xs">
                Guidelines
              </Button>
              <Button
                onClick={fetchDesigns}
                size="sm"
                className="h-9 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 font-bold uppercase tracking-wider text-xs"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 pt-8 space-y-8">

        {/* Stats Cards - Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/40 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg font-bold text-foreground tracking-tight tabular-nums mt-0.5">{stat.value}</p>
                </div>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center opacity-80", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter - Responsive */}
        {/* Search & Filter - Responsive */}
        <div className="bg-white border border-border/50 shadow-sm rounded-xl overflow-hidden">
          <div className="p-3 flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search designs or tailors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border-border/50 bg-background focus-visible:ring-1 focus-visible:ring-amber-500"
              />
            </div>

            {/* Filter Tabs - Scrollable on Mobile */}
            <div className="overflow-x-auto scrollbar-hide -mx-3 px-3">
              <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full">
                <TabsList className="bg-muted/30 p-1 h-auto inline-flex w-auto min-w-full">
                  {["all", "pending", "approved", "correction_requested", "rejected"].map((status) => (
                    <TabsTrigger
                      key={status}
                      value={status}
                      className="data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg text-[10px] uppercase font-bold px-3 py-2 whitespace-nowrap transition-all"
                    >
                      {status.replace('_', ' ')}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Grid of Designs - 2 Cards on Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <Card key={i} className="aspect-[3/4] animate-pulse bg-muted/20 rounded-xl border-none" />
            ))
          ) : filteredDesigns.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <Scissors className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="font-medium">No designs found</p>
              <p className="text-xs mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filteredDesigns.map((design) => (
              <Card key={design.id} className="overflow-hidden border-border/40 shadow-sm group hover:shadow-md hover:border-amber-200/50 transition-all duration-300 cursor-pointer flex flex-col h-full rounded-xl" onClick={() => {
                setSelectedDesign(design);
                setViewDialogOpen(true);
              }}>
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={design.image}
                    alt={design.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className={cn(
                      "backdrop-blur-md border border-white/20 text-[9px] font-bold uppercase tracking-wider h-5 px-2",
                      design.status === 'approved' ? "bg-green-500/90 text-white" :
                        design.status === 'pending' ? "bg-amber-500/90 text-white" :
                          design.status === 'correction_requested' ? "bg-blue-500/90 text-white" :
                            "bg-red-500/90 text-white"
                    )}>
                      {design.status === 'correction_requested' ? 'Revision' : design.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-3 flex-1 flex flex-col bg-white">
                  <div className="flex-1">
                    <h3 className="font-bold text-xs text-foreground line-clamp-1">{design.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Avatar className="w-4 h-4">
                        <AvatarFallback className="text-[8px] bg-amber-50 text-amber-700">{(design.tailor || 'U').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-muted-foreground truncate font-medium">{design.tailor}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                    <p className="font-bold text-amber-700 text-xs">₹{(design.price || 0).toLocaleString()}</p>
                    {design.status === 'pending' && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">REVIEW</span>}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Design Details Dialog - Refined */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-5xl w-[95vw] h-[90vh] md:h-[85vh] p-0 overflow-hidden border-none shadow-2xl bg-white rounded-2xl flex flex-col md:flex-row">
            {selectedDesign && (
              <>
                {/* Left Column: Image/Carousel */}
                <div className="w-full md:w-1/2 bg-neutral-100 relative shrink-0 h-[40vh] md:h-auto group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {selectedDesign.images && selectedDesign.images.length > 0 ? (
                      <Carousel className="w-full h-full">
                        <CarouselContent className="h-full">
                          {selectedDesign.images.map((img: string, index: number) => (
                            <CarouselItem key={index} className="h-full">
                              <div className="h-full w-full flex items-center justify-center bg-neutral-100 p-4">
                                <img src={img} alt={`${selectedDesign.name} view ${index + 1}`} className="max-h-full max-w-full object-contain shadow-sm rounded-md" />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4 bg-white/80 hover:bg-white border-0 shadow-md transform translate-x-0" />
                        <CarouselNext className="right-4 bg-white/80 hover:bg-white border-0 shadow-md transform translate-x-0" />
                      </Carousel>
                    ) : (
                      <img src={selectedDesign.image} alt={selectedDesign.name} className="w-full h-full object-cover" />
                    )}
                  </div>

                  {/* Image Analysis Overlay */}
                  <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-lg text-white pointer-events-none z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Eye className="w-3 h-3 text-amber-400" /> AI Analysis</p>
                  </div>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="w-full md:w-1/2 flex flex-col h-full bg-white min-h-0">
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 rounded-md tracking-wider text-[10px] uppercase font-bold px-2 py-0.5">{selectedDesign.category}</Badge>
                        <p className="text-[10px] text-muted-foreground font-mono">ID: {selectedDesign.id}</p>
                      </div>
                      <DialogTitle className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight leading-tight">{selectedDesign.name}</DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground mt-2">
                        Review the details of this design submission.
                      </DialogDescription>
                      <div className="flex items-center gap-2 mt-2 text-xs md:text-sm text-muted-foreground">
                        <User className="w-4 h-4" /> <span>Submitted by <strong className="text-foreground">{selectedDesign.tailor}</strong></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/10 rounded-xl border border-border/40">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Base Price</p>
                        <p className="text-lg md:text-xl font-bold text-foreground">₹{selectedDesign.price.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">With Material</p>
                        <p className="text-lg md:text-xl font-bold text-amber-600">₹{selectedDesign.priceWithMaterial.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Description</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {selectedDesign.description || "No description provided."}
                      </p>
                    </div>

                    {selectedDesign.adminFeedback && (
                      <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-100 space-y-1">
                        <p className="text-xs font-bold flex items-center gap-2 text-amber-700">
                          <MessageSquare className="w-3 h-3" /> Previous Feedback
                        </p>
                        <p className="text-xs text-amber-900/80 italic">"{selectedDesign.adminFeedback}"</p>
                      </div>
                    )}
                  </div>

                  {/* Sticky Footer Actions */}
                  <div className="p-4 md:p-6 border-t border-border/40 bg-zinc-50/50 shrink-0">
                    {selectedDesign.status === 'pending' ? (
                      <div className="flex flex-col gap-3">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 shadow-lg shadow-emerald-900/10 text-xs md:text-sm uppercase tracking-wide" onClick={() => handleStatusChange(selectedDesign.id, "approved")}>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Approve Design
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="h-10 border-border/60 hover:bg-background text-xs font-bold uppercase tracking-wider" onClick={() => setCorrectionDialogOpen(true)}>
                            Request Edits
                          </Button>
                          <Button variant="outline" className="h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-xs font-bold uppercase tracking-wider" onClick={() => handleStatusChange(selectedDesign.id, "rejected")}>
                            Reject
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2 bg-muted/20 rounded-lg border border-border/40">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status: <span className={cn("text-foreground", selectedDesign.status === 'approved' ? 'text-emerald-600' : 'text-red-600')}>{selectedDesign.status}</span></p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Correction Request */}
        <Dialog open={correctionDialogOpen} onOpenChange={setCorrectionDialogOpen}>
          <DialogContent className="max-w-md rounded-2xl border-none shadow-xl">
            <DialogHeader>
              <DialogTitle className="font-display">Request Changes</DialogTitle>
              <DialogDescription>
                Feedback will be sent to the artisan immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Textarea
                placeholder="E.g., Please provide a clearer image of the embroidery..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px] resize-none bg-muted/10 border-border/50 focus:border-amber-500"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setCorrectionDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => selectedDesign && handleStatusChange(selectedDesign.id, 'correction_requested', feedback)} disabled={!feedback.trim()} className="bg-amber-600 hover:bg-amber-700">
                Send Feedback
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
