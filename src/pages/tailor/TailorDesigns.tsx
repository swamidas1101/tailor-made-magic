import { useState, useRef, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Upload,
  X,
  ChevronRight,
  Check,
  Edit,
  Trash2,
  Eye,
  Trash,
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Clock,
  IndianRupee,
  Calendar,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FileUploader } from "@/components/ui/file-uploader";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAuth } from "@/contexts/AuthContext";
import { designService } from "@/services/designService";
import { womenCategories, menCategories, filterOptions, Design } from "@/data/mockData";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Define broader categories to group the sub-categories
const mainCategories = [
  { id: "women", name: "Women's Tailoring", subCats: womenCategories },
  { id: "men", name: "Men's Tailoring", subCats: menCategories },
];

export default function TailorDesigns() {
  const { user, kytData } = useAuth();
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [myDesigns, setMyDesigns] = useState<Design[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const shopName = kytData?.address?.shopName || "My Shop";

  // Fetch designs for the current tailor
  useEffect(() => {
    const fetchDesigns = async () => {
      if (!user?.uid) return;
      try {
        setFetchLoading(true);
        const fetched = await designService.getTailorDesigns(user.uid);
        setMyDesigns(fetched);
      } catch (error) {
        console.error("Error fetching designs:", error);
        toast.error("Failed to load designs");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchDesigns();
  }, [user?.uid]);

  // Combined categorization for filtering
  const allSubCategories = useMemo(() => {
    return [...womenCategories, ...menCategories];
  }, []);

  // Apply filters
  const filteredDesigns = useMemo(() => {
    return myDesigns.filter(design => {
      const matchStatus = statusFilter === "all" || design.status === statusFilter;
      const matchCategory = categoryFilter === "all" || design.category === categoryFilter;
      return matchStatus && matchCategory;
    });
  }, [myDesigns, statusFilter, categoryFilter]);

  // Handle delete design
  const handleDelete = async (designId: string) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;

    try {
      await designService.deleteDesign(designId);
      setMyDesigns(prev => prev.filter(d => d.id !== designId));
      toast.success("Design deleted successfully");
    } catch (error) {
      console.error("Error deleting design:", error);
      toast.error("Failed to delete design");
    }
  };

  // Design Form State
  const initialState = {
    name: "",
    mainCategory: "",
    subCategory: "",
    description: "",
    price: "",
    priceWithMaterial: "",
    timeInDays: "7",
    image: "",
    images: [] as string[],
    // Dynamic attributes (Multi-Select)
    neckType: [] as string[],
    backDesign: [] as string[],
    sleeveType: [] as string[],
    workType: [] as string[],
    occasion: [] as string[],
    fabrics: [] as string[],
    // Mens Specific
    fitType: [] as string[],
    collarType: [] as string[],
    cuffType: [] as string[],
    pocketStyles: [] as string[],
    // Women/Bottom Specific
    skirtTypes: [] as string[],
    // Metadata
    status: "pending" as const,
    submittedAt: new Date().toISOString(),
  };

  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (field: string, value: any) => {
    if (field === "mainCategory") {
      // Reset logic: If main category changes, reset EVERYTHING below it
      setFormData({
        ...initialState,
        mainCategory: value,
      });
      toast.info(`Switched to ${value === 'men' ? "Men's" : "Women's"} tailoring. Form reset.`);
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Dedicated Main Image Handler (Accepts base64 string from FileUploader)
  const handleMainImageUpload = (base64: string) => {
    handleInputChange("image", base64);
    toast.success("Main image set");
  };

  // Dedicated Additional Images Handler
  const handleAdditionalImageUpload = (file: File) => {
    if (formData.images.length >= 4) {
      toast.error("Maximum 5 images allowed (1 Main + 4 Additional)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      handleInputChange("images", [...formData.images, base64]);
      toast.success("Image added");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number, isMain: boolean) => {
    if (isMain) {
      handleInputChange("image", "");
    } else {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      handleInputChange("images", newImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Verification logic
    if (!formData.name || !formData.mainCategory || !formData.subCategory || !formData.price || !formData.image) {
      toast.error("Please fill in all required fields marked with *");
      setLoading(false);
      return;
    }

    try {
      const designData: Omit<Design, "id"> = {
        ...formData,
        tailorId: user?.uid || "",
        shopName: shopName,
        rating: 0,
        reviewCount: 0,
        timeInDays: Number(formData.timeInDays),
        category: formData.subCategory || formData.mainCategory,
        price: Number(formData.price),
        priceWithMaterial: Number(formData.priceWithMaterial),
        submittedAt: new Date().toISOString(),
      } as unknown as Omit<Design, "id">;

      await designService.createDesign(designData);

      // Refresh list
      if (user?.uid) {
        const fetched = await designService.getTailorDesigns(user.uid);
        setMyDesigns(fetched);
      }

      toast.success("Design submitted successfully! It is now pending admin approval.");
      setViewMode("list");
      setFormData(initialState);
    } catch (error) {
      console.error("Error creating design:", error);
      toast.error("Failed to submit design");
    } finally {
      setLoading(false);
    }
  };

  const getSubCategories = () => {
    const cat = mainCategories.find(c => c.id === formData.mainCategory);
    return cat ? cat.subCats : [];
  };

  const isWomen = formData.mainCategory === "women";
  const isMen = formData.mainCategory === "men";

  // VIEW: FORM MODE
  if (viewMode === "form") {
    return (
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4 border-b pb-4">
          <Button variant="ghost" size="icon" onClick={() => setViewMode("list")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">Add New Design</h1>
            <p className="text-muted-foreground text-sm">Fill in the details to list your creation.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Form Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* 1. Categorization */}
            <section className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                Classification
              </h3>
              <div className="grid sm:grid-cols-2 gap-6 p-6 bg-card rounded-xl border shadow-sm">
                <div className="space-y-2">
                  <Label>Category <span className="text-red-500">*</span></Label>
                  <Select value={formData.mainCategory} onValueChange={(v) => handleInputChange("mainCategory", v)}>
                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                    <SelectContent>
                      {mainCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sub-Category <span className="text-red-500">*</span></Label>
                  <Select value={formData.subCategory} onValueChange={(v) => handleInputChange("subCategory", v)} disabled={!formData.mainCategory}>
                    <SelectTrigger><SelectValue placeholder="Select Item" /></SelectTrigger>
                    <SelectContent>
                      {getSubCategories().map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* 2. Basic Info */}
            <section className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                Design Details
              </h3>
              <div className="p-6 bg-card rounded-xl border shadow-sm space-y-6">
                <div className="space-y-2">
                  <Label>Design Name <span className="text-red-500">*</span></Label>
                  <Input placeholder="e.g. Royal Blue Silk Blouse" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Stitching Price (₹) <span className="text-red-500">*</span></Label>
                    <Input type="number" placeholder="0.00" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>With Material (₹) <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
                    <Input type="number" placeholder="Optional" value={formData.priceWithMaterial} onChange={(e) => handleInputChange("priceWithMaterial", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Estimated Days to Complete <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      className="pl-9"
                      placeholder="e.g. 7"
                      value={formData.timeInDays}
                      onChange={(e) => handleInputChange("timeInDays", e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">The time you need from receiving measurements to delivery.</p>
                </div>

                <div className="space-y-2">
                  <Label>Description <span className="text-red-500">*</span></Label>
                  <Textarea placeholder="Describe the design..." value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} className="min-h-[100px] resize-none" />
                </div>
              </div>
            </section>

            {/* 3. Detailed Attributes (Based on Category) */}
            {formData.subCategory && (
              <section className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  Design Options <span className="text-sm font-normal text-muted-foreground ml-2">(Select all that apply)</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Common */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Work Type</Label>
                    <MultiSelect
                      options={filterOptions.workTypes}
                      selected={formData.workType}
                      onChange={(selected) => handleInputChange("workType", selected)}
                      placeholder="Select work types..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Common Fabrics</Label>
                    <MultiSelect
                      options={filterOptions.fabrics}
                      selected={formData.fabrics}
                      onChange={(selected) => handleInputChange("fabrics", selected)}
                      placeholder="Select fabrics..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Occasions</Label>
                    <MultiSelect
                      options={filterOptions.occasions}
                      selected={formData.occasion}
                      onChange={(selected) => handleInputChange("occasion", selected)}
                      placeholder="Select occasions..."
                    />
                  </div>

                  {/* Womens Specific */}
                  {isWomen && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Neck Designs</Label>
                        <MultiSelect
                          options={filterOptions.neckTypes}
                          selected={formData.neckType}
                          onChange={(selected) => handleInputChange("neckType", selected)}
                          placeholder="Select neck types..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Sleeve Styles</Label>
                        <MultiSelect
                          options={filterOptions.sleeveTypes}
                          selected={formData.sleeveType}
                          onChange={(selected) => handleInputChange("sleeveType", selected)}
                          placeholder="Select sleeve styles..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Back Designs</Label>
                        <MultiSelect
                          options={filterOptions.backDesigns}
                          selected={formData.backDesign}
                          onChange={(selected) => handleInputChange("backDesign", selected)}
                          placeholder="Select back designs..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Skirt/Gher Styles</Label>
                        <MultiSelect
                          options={filterOptions.skirtTypes}
                          selected={formData.skirtTypes}
                          onChange={(selected) => handleInputChange("skirtTypes", selected)}
                          placeholder="Select skirt types..."
                        />
                      </div>
                    </>
                  )}

                  {/* Mens Specific */}
                  {isMen && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Fit Type</Label>
                        <MultiSelect
                          options={filterOptions.fitTypes}
                          selected={formData.fitType}
                          onChange={(selected) => handleInputChange("fitType", selected)}
                          placeholder="Select fit types..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Collar Styles</Label>
                        <MultiSelect
                          options={filterOptions.collarTypes}
                          selected={formData.collarType}
                          onChange={(selected) => handleInputChange("collarType", selected)}
                          placeholder="Select collar styles..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Cuff Styles</Label>
                        <MultiSelect
                          options={filterOptions.cuffTypes}
                          selected={formData.cuffType}
                          onChange={(selected) => handleInputChange("cuffType", selected)}
                          placeholder="Select cuff styles..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">Pocket Styles</Label>
                        <MultiSelect
                          options={filterOptions.pocketStyles}
                          selected={formData.pocketStyles}
                          onChange={(selected) => handleInputChange("pocketStyles", selected)}
                          placeholder="Select pocket styles..."
                        />
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Images & Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <section className="space-y-4 sticky top-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                Images
              </h3>
              <div className="p-6 bg-card rounded-xl border shadow-sm space-y-6">
                <div className="space-y-3">
                  <Label>Main Image <span className="text-red-500">*</span></Label>
                  <FileUploader
                    label="Main Image"
                    value={formData.image}
                    onChange={(base64) => handleMainImageUpload(base64)}
                    onRemove={() => removeImage(0, true)}
                    className="h-48 w-full"
                    icon={ImageIcon}
                    description={formData.image ? "Main image selected" : "Upload hero image"}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Additional Images (Max 4)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx, false)} className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    {formData.images.length < 4 && (
                      <div className="aspect-square rounded-lg border-2 border-dashed border-muted hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer bg-muted/5 transition-colors hover:bg-muted/10"
                        onClick={() => document.getElementById('hidden-add-more')?.click()}>
                        <Plus className="w-6 h-6 mb-1 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground font-medium">Add</span>
                        <input id="hidden-add-more" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleAdditionalImageUpload(e.target.files[0])} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t">
                <Button variant="outline" className="w-full h-11" onClick={() => setShowPreview(true)} disabled={!formData.name || !formData.image}>
                  <Eye className="w-4 h-4 mr-2" /> Preview Card
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-lg font-semibold shadow-md shadow-amber-900/10">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Check className="w-5 h-5 mr-2" />}
                  Publish Design
                </Button>
              </div>
            </section>
          </div>
        </div>

        {/* PREVIEW DIALOG */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-background shadow-2xl">
            <div className="relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center overflow-hidden">
              <img src={formData.image || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 text-black shadow-sm font-bold">New</Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white pt-20">
                <h3 className="text-xl font-bold mb-1 leading-tight">{formData.name || "Design Name"}</h3>
                <p className="text-sm text-white/80 mb-3 line-clamp-2">{formData.description || "Design description..."}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-amber-400">₹{formData.price || "0"}</p>
                    {formData.priceWithMaterial && <p className="text-xs text-white/60">Includes material</p>}
                  </div>
                  <Button size="sm" className="bg-white text-black hover:bg-white/90 font-semibold rounded-full px-6">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
            {(formData.neckType.length > 0 || formData.workType.length > 0) && (
              <div className="p-4 bg-muted/30 border-t">
                <div className="flex flex-wrap gap-2 justify-center">
                  {formData.neckType.slice(0, 3).map(t => <Badge key={t} variant="outline" className="bg-background text-[10px]">{t}</Badge>)}
                  {formData.workType.slice(0, 3).map(t => <Badge key={t} variant="outline" className="bg-background text-[10px]">{t}</Badge>)}
                  {(formData.neckType.length + formData.workType.length) > 6 && (
                    <Badge variant="secondary" className="text-[10px]">+{formData.neckType.length + formData.workType.length - 6} more</Badge>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // VIEW: LIST MODE
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">My Designs</h1>
          <p className="text-muted-foreground text-sm">Manage and showcase your portfolio from {shopName}</p>
        </div>
        <Button onClick={() => setViewMode("form")} className="bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-900/10 h-10 px-6 font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add New Design
        </Button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex items-center gap-3 bg-card p-3 rounded-xl border shadow-sm">
        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Filter:</span>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="correction_requested">Correction Requested</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] h-9 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allSubCategories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-xs text-muted-foreground ml-auto">
            {filteredDesigns.length}/{myDesigns.length}
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex md:hidden items-center gap-3 flex-1">
          <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {(statusFilter !== "all" || categoryFilter !== "all") && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-primary"></span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[400px]">
              <SheetHeader>
                <SheetTitle>Filter Designs</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="correction_requested">Correction Requested</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {allSubCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setStatusFilter("all");
                      setCategoryFilter("all");
                    }}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="flex-1 bg-primary"
                    onClick={() => setFilterSheetOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="text-xs text-muted-foreground ml-auto">
            {filteredDesigns.length}/{myDesigns.length}
          </div>
        </div>
      </div>

      {fetchLoading ? (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
          <p className="text-muted-foreground animate-pulse">Loading your designs...</p>
        </div>
      ) : filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredDesigns.map((design) => (
            <Card key={design.id} className="overflow-hidden hover-lift group border-border/50 shadow-soft flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={design.image}
                  alt={design.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <Badge
                    className={cn(
                      "text-[10px] font-bold shadow-sm border-0",
                      design.status === 'approved' ? "bg-green-500 text-white" :
                        design.status === 'pending' ? "bg-amber-500 text-white" :
                          design.status === 'correction_requested' ? "bg-blue-500 text-white" :
                            "bg-red-500 text-white"
                    )}
                  >
                    {design.status === 'correction_requested' ? "Needs Correction" : design.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Compact Delivery Badge */}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {design.timeInDays}d
                </div>

                {/* Desktop Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="secondary" className="rounded-full shadow-lg h-8 w-8" onClick={() => setSelectedDesign(design)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    {selectedDesign && (
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-display">{selectedDesign.name}</DialogTitle>
                          <DialogDescription>Full details for this design</DialogDescription>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-4">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden border">
                              <img src={selectedDesign.image} alt={selectedDesign.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {selectedDesign.images?.map((img, i) => (
                                <div key={i} className="aspect-square rounded-lg overflow-hidden border">
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Price</Label>
                                <p className="text-2xl font-bold text-primary flex items-center">
                                  <IndianRupee className="w-5 h-5" />
                                  {selectedDesign.price.toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right space-y-1">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Status</Label>
                                <div>
                                  <Badge className={cn(
                                    design.status === 'approved' ? "bg-green-500" :
                                      design.status === 'pending' ? "bg-amber-500" :
                                        design.status === 'correction_requested' ? "bg-blue-50" : "bg-red-500"
                                  )}>
                                    {(selectedDesign.status || 'PENDING').toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Category</Label>
                                <p className="font-semibold">{selectedDesign.category}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Delivery Time</Label>
                                <p className="font-semibold flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {selectedDesign.timeInDays} Days
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Attributes</Label>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedDesign.neckType && (Array.isArray(selectedDesign.neckType) ? selectedDesign.neckType : [selectedDesign.neckType]).map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                                {selectedDesign.workType && (Array.isArray(selectedDesign.workType) ? selectedDesign.workType : [selectedDesign.workType]).map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                                {selectedDesign.sleeveType && (Array.isArray(selectedDesign.sleeveType) ? selectedDesign.sleeveType : [selectedDesign.sleeveType]).map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                                {selectedDesign.occasion && (Array.isArray(selectedDesign.occasion) ? selectedDesign.occasion : [selectedDesign.occasion]).map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Description</Label>
                              <p className="text-sm leading-relaxed">{selectedDesign.description}</p>
                            </div>

                            {selectedDesign.adminFeedback && (
                              <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                                <Label className="text-orange-800 text-xs font-bold uppercase tracking-wider ">Admin Feedback</Label>
                                <p className="text-sm text-orange-900 mt-1 italic">"{selectedDesign.adminFeedback}"</p>
                              </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t">
                              <Button variant="outline" className="flex-1"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                              <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(design.id!);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full shadow-lg h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(design.id!);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-bold text-sm line-clamp-1">{design.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xs font-bold text-primary">₹{design.price.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">{design.category}</span>
                </div>

                {design.status === 'correction_requested' && (
                  <div className="bg-blue-50 border border-blue-100 p-2 rounded text-[9px] text-blue-700 animate-pulse mb-2">
                    <p className="font-semibold uppercase tracking-wider">Feedback Received</p>
                  </div>
                )}

                {/* Mobile Action Buttons */}
                <div className="flex gap-2 md:hidden mt-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="h-9 w-9 p-0" onClick={() => setSelectedDesign(design)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    {selectedDesign && (
                      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-display">{selectedDesign.name}</DialogTitle>
                          <DialogDescription>Full details for this design</DialogDescription>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                          <div className="space-y-4">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden border">
                              <img src={selectedDesign.image} alt={selectedDesign.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {selectedDesign.images?.map((img, i) => (
                                <div key={i} className="aspect-square rounded-lg overflow-hidden border">
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Price</Label>
                                <p className="text-2xl font-bold text-primary flex items-center">
                                  <IndianRupee className="w-5 h-5" />
                                  {selectedDesign.price.toLocaleString()}
                                </p>
                              </div>
                              {selectedDesign.priceWithMaterial && (
                                <div className="space-y-1 text-right">
                                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">With Material</Label>
                                  <p className="text-xl font-bold text-muted-foreground flex items-center justify-end">
                                    <IndianRupee className="w-4 h-4" />
                                    {selectedDesign.priceWithMaterial.toLocaleString()}
                                  </p>
                                </div>
                              )}
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Category</Label>
                                <p className="text-sm font-semibold">{selectedDesign.category}</p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Delivery Time</Label>
                                <p className="text-sm font-semibold flex items-center">
                                  <Clock className="w-4 h-4 mr-1" /> {selectedDesign.timeInDays} days
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Description</Label>
                              <p className="text-sm text-foreground leading-relaxed">{selectedDesign.description}</p>
                            </div>

                            {Array.isArray(selectedDesign.neckType) && selectedDesign.neckType.length > 0 && (
                              <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Neck Types</Label>
                                <div className="flex flex-wrap gap-2">
                                  {selectedDesign.neckType.map(type => (
                                    <Badge key={type} variant="outline" className="bg-background">{type}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {Array.isArray(selectedDesign.workType) && selectedDesign.workType.length > 0 && (
                              <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Work Types</Label>
                                <div className="flex flex-wrap gap-2">
                                  {selectedDesign.workType.map(type => (
                                    <Badge key={type} variant="outline" className="bg-background">{type}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {Array.isArray(selectedDesign.backDesign) && selectedDesign.backDesign.length > 0 && (
                              <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Back Design Options</Label>
                                <div className="flex flex-wrap gap-2">
                                  {selectedDesign.backDesign.map(type => (
                                    <Badge key={type} variant="outline" className="bg-background">{type}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {Array.isArray(selectedDesign.sleeveType) && selectedDesign.sleeveType.length > 0 && (
                              <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Sleeve Types</Label>
                                <div className="flex flex-wrap gap-2">
                                  {selectedDesign.sleeveType.map(type => (
                                    <Badge key={type} variant="outline" className="bg-background">{type}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {selectedDesign.status === 'correction_requested' && selectedDesign.adminFeedback && (
                              <>
                                <Separator />
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
                                  <Label className="text-blue-700 text-xs uppercase tracking-wider font-bold">Admin Feedback</Label>
                                  <p className="text-sm text-blue-900">{selectedDesign.adminFeedback}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-9 w-9 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(design.id!);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted rounded-xl p-12 text-center space-y-4 bg-muted/10 h-[60vh] flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-background shadow-inner">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No Designs Found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm">
            {statusFilter !== 'all' || categoryFilter !== 'all'
              ? "Try adjusting your filters to find what you're looking for."
              : "Start building your portfolio to attract customers. Upload your best work now."}
          </p>
          <Button variant="outline" onClick={statusFilter !== 'all' || categoryFilter !== 'all'
            ? () => { setStatusFilter('all'); setCategoryFilter('all') }
            : () => setViewMode("form")} className="mt-4 border-primary/20 hover:border-primary/50">
            {statusFilter !== 'all' || categoryFilter !== 'all' ? "Clear Filters" : "Upload First Design"}
          </Button>
        </div>
      )}
    </div>
  );
}
