import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Filter, Loader2, ArrowLeft, Check, ChevronDown, Scissors, Eye } from "lucide-react";
import { toast } from "sonner";
import { TailorDesignCard } from "@/components/designs/TailorDesignCard";
import { DesignPreviewDialog } from "@/components/designs/DesignPreviewDialog";
import { MultiSelect } from "@/components/ui/multi-select";
import { designService } from "@/services/designService";
import { useAuth } from "@/contexts/AuthContext";
import { FileUploader } from "@/components/ui/file-uploader";
import { categoryService } from "@/services/categoryService";
import { filterService } from "@/services/filterService";
import { Category, FilterGroup, FilterOption, Design } from "@/types/database";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface DesignFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  priceWithMaterial: string;
  timeInDays: string;
  images: string[];
  gender: "women" | "men";
  filters: Record<string, string[]>;
}

export default function TailorDesigns() {
  const { user, kytData } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  // Shop Name from KYT
  const shopName = kytData?.address?.shopName || "My Boutique";

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all"); // 'all', 'men', 'women'
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Dynamic Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [filterOptions, setFilterOptions] = useState<Record<string, FilterOption[]>>({});
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Form State
  const initialFormState: DesignFormData = {
    name: "",
    category: "",
    description: "",
    price: "",
    priceWithMaterial: "",
    timeInDays: "",
    images: [],
    gender: "women",
    filters: {}
  };

  const [formData, setFormData] = useState<DesignFormData>(initialFormState);

  useEffect(() => {
    if (user?.uid) {
      loadDesigns();
    }
  }, [user]);

  useEffect(() => {
    if (designs.length > 0) {
      console.log("🔥 Current Designs Data:", designs);
      console.log("🔥 Sample Design 0:", designs[0]);
    }
  }, [designs]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getActiveCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadFilters = async () => {
      if (!formData.category) {
        setFilterGroups([]);
        return;
      }

      try {
        setLoadingFilters(true);
        const groups = await filterService.getFiltersForCategory(formData.category, formData.gender);
        setFilterGroups(groups);

        const optionsMap: Record<string, FilterOption[]> = {};
        await Promise.all(groups.map(async (group) => {
          const options = await filterService.getFilterOptions(group.id);
          optionsMap[group.id] = options;
        }));
        setFilterOptions(optionsMap);
      } catch (error) {
        console.error("Failed to load filters", error);
        toast.error("Failed to load design options");
      } finally {
        setLoadingFilters(false);
      }
    };

    if (isCreating || editingId) {
      loadFilters();
    }
  }, [formData.category, formData.gender, isCreating, editingId]);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      if (user?.uid) {
        const data = await designService.getTailorDesigns(user.uid);
        // Normalize data to handle legacy fields and fix bad gender tagging
        const normalizedData = data.map(d => {
          const catId = (d.categoryId || (d as any).category || "").toString();
          const catName = (d.categoryName || (d as any).category || "").toString();

          // Auto-correct gender if category explicitly says "Men" (fixes user's data issue)
          let gender = (d.gender || (d as any).mainCategory || "women").toLowerCase();
          if (catId.toLowerCase().includes('men') || catName.toLowerCase().startsWith('men')) {
            gender = 'men';
          }

          return {
            ...d,
            id: d.id,
            gender: gender as "men" | "women",
            categoryId: catId,
            categoryName: catName,
            status: d.status || 'pending',
            price: typeof d.price === 'string' ? parseFloat(d.price) : (d.price || 0),
            images: d.images || (d.image ? [d.image] : []),
            filters: d.filters || {}
          };
        });
        setDesigns(normalizedData as Design[]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load designs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof DesignFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'category' || field === 'gender') {
      setFormData(prev => ({ ...prev, filters: {} }));
    }
  };

  const handleFilterChange = (groupId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [groupId]: [value]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    if (!formData.name || !formData.category || !formData.price || formData.images.length === 0) {
      toast.error("Please fill in all required fields and add at least one image");
      return;
    }

    try {
      setSubmitting(true);

      const designData: Partial<Design> = {
        name: formData.name,
        categoryId: formData.category,
        categoryName: categories.find(c => c.id === formData.category)?.name || "",
        description: formData.description,
        price: parseFloat(formData.price),
        priceWithMaterial: parseFloat(formData.priceWithMaterial) || 0,
        timeInDays: parseInt(formData.timeInDays) || 7,
        images: formData.images,
        image: formData.images[0],
        gender: formData.gender,
        filters: formData.filters,
        tailorId: user.uid,
        shopName: user.displayName || "Tailor Shop",
        updatedAt: new Date().toISOString(),
      };

      // Explicitly handle status and new design fields
      if (editingId) {
        await designService.updateDesign(editingId, designData);
        toast.success("Design updated successfully");
      } else {
        const newDesign = {
          ...designData,
          status: 'pending' as const,
          reviewCount: 0,
          rating: 0,
          submittedAt: new Date().toISOString()
        };
        await designService.createDesign(newDesign as Omit<Design, 'id'>);
        toast.success("Design submitted successfully");
      }

      setIsCreating(false);
      setEditingId(null);
      setFormData(initialFormState);
      loadDesigns();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save design");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate category counts using robust matching (matches the filter logic)
  const categoryCounts = categories.reduce((acc, cat) => {
    const count = designs.filter(d => {
      // Apply other active filters to the count (optional, but good UX - usually counts show "available in current view")
      const matchesGender = genderFilter === 'all' || d.gender === genderFilter;
      if (!matchesGender) return false;

      const designCat = (d.categoryId || (d as any).category || d.categoryName || "").toString().toLowerCase().trim();
      const catId = cat.id.toLowerCase().trim();
      const catName = cat.name.toLowerCase().trim();

      return designCat === catId ||
        designCat === catName ||
        (catId && (catId.includes(designCat) || designCat.includes(catId))) ||
        (catName && (catName.includes(designCat) || designCat.includes(catName)));
    }).length;
    acc[cat.id] = count;
    return acc;
  }, {} as Record<string, number>);

  const handleEdit = (design: any) => {
    setEditingId(design.id);
    setIsCreating(true);
    setIsPreviewOpen(false);

    // Ensure main image is included in images array
    const existingImages = design.images && design.images.length > 0 ? [...design.images] : [];
    if (design.image && !existingImages.includes(design.image)) {
      existingImages.unshift(design.image);
    }
    const finalImages = existingImages.length > 0 ? existingImages : (design.image ? [design.image] : []);

    setFormData({
      name: design.name,
      category: design.categoryId || (design as any).category,
      description: design.description || "",
      price: design.price.toString(),
      priceWithMaterial: (design.priceWithMaterial || "").toString(),
      timeInDays: (design.timeInDays || "").toString(),
      images: finalImages,
      gender: design.gender || "women",
      filters: (design.filters as Record<string, string[]>) || {}
    });
  };

  const handlePreview = () => {
    const previewDesign: any = {
      ...formData,
      id: "preview",
      price: parseFloat(formData.price) || 0,
      image: formData.images[0] || "",
      status: 'draft',
      categoryName: categories.find(c => c.id === formData.category)?.name || "Category",
      tailorId: user?.uid || "",
      shopName: shopName
    };
    setSelectedDesign(previewDesign);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (designId: string) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;
    try {
      await designService.deleteDesign(designId);
      toast.success("Design deleted");
      setIsPreviewOpen(false);
      loadDesigns();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete design");
    }
  };

  const handleView = (design: Design) => {
    console.log("👀 Viewing Design:", design);
    setSelectedDesign(design);
    setIsPreviewOpen(true);
  };

  // Filter Logic
  const filteredDesigns = designs.filter(d => {
    // Debug logging for first few designs to see what we are dealing with
    if (designs.indexOf(d) < 2) {
      console.log("🔍 Filtering Design:", d.name, "catId:", d.categoryId, "category:", (d as any).category, "catName:", d.categoryName);
      console.log("🎯 Filter value:", categoryFilter);
    }
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesGender = genderFilter === 'all' || d.gender === genderFilter;

    // Highly robust category matching (handles ID, Name, singular/plural, and case)
    const designCat = (d.categoryId || (d as any).category || d.categoryName || "").toString().toLowerCase().trim();
    const filterId = categoryFilter.toLowerCase().trim();
    const filterName = categories.find(c => c.id === categoryFilter)?.name?.toLowerCase().trim() || "";

    const matchesCategory = categoryFilter === 'all' ||
      designCat === filterId ||
      designCat === filterName ||
      (filterId && (filterId.includes(designCat) || designCat.includes(filterId))) ||
      (filterName && (filterName.includes(designCat) || designCat.includes(filterName)));

    return matchesSearch && matchesStatus && matchesGender && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  // Create/Edit View
  if (isCreating) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-20">
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm sticky top-0 z-20">
          <div className="w-full px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  setFormData(initialFormState);
                }}
                className="text-gray-500 hover:text-gray-900 -ml-2 h-8 w-8 p-0 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2 text-amber-600 mb-0.5">
                  <Scissors className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{shopName}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {editingId ? "Edit Design" : "Create New Design"}
                </h1>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto hidden sm:flex">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!formData.name || formData.images.length === 0}
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white min-w-[100px]"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Design"}
              </Button>
            </div>
          </div>
        </div>

        {/* Removed max-w-5xl, using w-full with some padding */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column: Form (Takes 8 columns on large screens) */}
            <div className="xl:col-span-8 space-y-6">
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Basic Details</h3>
                    <p className="text-sm text-gray-500">Product information and categorization</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase text-gray-500">Design Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="e.g. Traditional Silk Blouse"
                        className="font-medium h-10"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase text-gray-500">Gender</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => handleInputChange("gender", value)}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="men">Men</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase text-gray-500">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                          disabled={!formData.gender}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {categories
                              .filter(c => c.type === formData.gender)
                              .map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase text-gray-500">Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                        className="resize-none"
                        placeholder="Describe the styling, fabric, and details..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              {formData.category && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Key Features</h3>
                      <p className="text-sm text-gray-500">Specific attributes for this category</p>
                    </div>
                    {loadingFilters ? (
                      <div className="py-8 flex justify-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /></div>
                    ) : filterGroups.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                        {filterGroups.map(group => (
                          <div key={group.id} className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-gray-500">{group.name}</Label>
                            <MultiSelect
                              options={filterOptions[group.id]?.map(opt => opt.value) || []}
                              selected={formData.filters[group.id] || []}
                              onChange={(values) => handleInputChange("filters", {
                                ...formData.filters,
                                [group.id]: values
                              })}
                              placeholder={`Select ${group.name.toLowerCase()}...`}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No specific attributes needed.</p>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Pricing & Delivery</h3>
                    <p className="text-sm text-gray-500">Service charges and timeline</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase text-gray-500">Stitching Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                          className="pl-7 font-bold h-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase text-gray-500">With Material</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                        <Input
                          type="number"
                          value={formData.priceWithMaterial}
                          onChange={(e) => handleInputChange("priceWithMaterial", e.target.value)}
                          className="pl-7 h-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase text-gray-500">Delivery Days</Label>
                      <Input
                        type="number"
                        value={formData.timeInDays}
                        onChange={(e) => handleInputChange("timeInDays", e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Images (Takes 4 columns on large screens) */}
            <div className="xl:col-span-4 space-y-6">
              <Card className="border-0 shadow-sm h-full">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Gallery</h3>
                    <p className="text-sm text-gray-500">Add up to 5 images</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className={cn(
                        "relative rounded-lg overflow-hidden group shadow-sm bg-gray-50 border border-gray-100",
                        index === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"
                      )}>
                        <img src={img} alt="" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...formData.images];
                            newImages.splice(index, 1);
                            handleInputChange("images", newImages);
                          }}
                          className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                        >
                          <Plus className="w-4 h-4 rotate-45" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-bold uppercase text-center py-1">Cover Image</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {formData.images.length < 5 && (
                    <FileUploader
                      label={formData.images.length === 0 ? "Upload Cover Image" : "Add More"}
                      value=""
                      onChange={(base64) => handleInputChange("images", [...formData.images, base64])}
                      onRemove={() => { }}
                      className="h-32 rounded-lg border-dashed border-2 hover:border-amber-400 hover:bg-amber-50/50 transition-colors"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Bar for Form Actions */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-2 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <Button
            variant="outline"
            onClick={() => setIsCreating(false)}
            className="flex-1 border-gray-200 text-gray-700 h-12 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={!formData.name || formData.images.length === 0}
            className="flex-1 border-amber-200 text-amber-700 h-12 rounded-xl"
          >
            Preview
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-[1.5] bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold h-12 rounded-xl"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Design"}
          </Button>
        </div>

        {/* Preview Dialog for Edit Mode */}
        <DesignPreviewDialog
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          design={selectedDesign}
          onEdit={() => setIsPreviewOpen(false)} // Already editing
          onDelete={() => { }} // Can't delete in preview
          hideActions={true}
        />
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm transition-all duration-200">
        <div className="w-full px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Scissors className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{shopName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                My Designs
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your portfolio and track performance
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:flex-1 md:justify-end">
              <div className="relative flex-1 md:w-64 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search designs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10 border-gray-200 hover:border-amber-400 focus:ring-amber-400/20 rounded-xl bg-gray-50/50 focus:bg-white transition-all shadow-sm"
                />
              </div>
              <Button
                onClick={() => setIsCreating(true)}
                className="hidden sm:flex bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 font-bold uppercase tracking-wider text-xs px-6 h-10 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Design
              </Button>
            </div>
          </div>

          {/* Mobile Filter Card (Matches User Screenshot) */}
          <div className="mt-6 md:hidden">
            <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl px-6 h-11 transition-all active:scale-95"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <div className="text-gray-400 font-medium text-sm">
                  {filteredDesigns.length}/{designs.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar - Desktop Only */}
          <div className="mt-6 hidden md:flex flex-col xl:flex-row xl:items-center gap-4 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 px-1 text-gray-500">
              <Filter className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Filters:</span>
            </div>

            <div className="flex flex-wrap flex-1 gap-3">
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-dashed border-gray-300 bg-transparent hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 min-w-[120px] justify-between text-xs font-medium">
                    {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1).replace('_', ' ')}
                    <ChevronDown className="w-3 h-3 opacity-50 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Status
                    {statusFilter === 'all' && <Check className="w-3 h-3 ml-auto text-amber-500" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                    Approved
                    {statusFilter === 'approved' && <Check className="w-3 h-3 ml-auto text-amber-500" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    Pending
                    {statusFilter === 'pending' && <Check className="w-3 h-3 ml-auto text-amber-500" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('correction_requested')}>
                    Correction Requested
                    {statusFilter === 'correction_requested' && <Check className="w-3 h-3 ml-auto text-amber-500" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                    Rejected
                    {statusFilter === 'rejected' && <Check className="w-3 h-3 ml-auto text-amber-500" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Gender Segment */}
              <div className="bg-gray-100/80 p-0.5 rounded-lg flex items-center h-8 self-start sm:self-auto">
                <button
                  onClick={() => setGenderFilter('all')}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-md transition-all h-full",
                    genderFilter === 'all' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  ALL
                </button>
                <button
                  onClick={() => setGenderFilter('men')}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-md transition-all h-full",
                    genderFilter === 'men' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  MEN
                </button>
                <button
                  onClick={() => setGenderFilter('women')}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-md transition-all h-full",
                    genderFilter === 'women' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  WOMEN
                </button>
              </div>

              {/* Categories Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-dashed border-gray-300 bg-transparent hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 min-w-[140px] justify-between text-xs font-medium">
                    {categoryFilter === 'all' ? 'All Categories' : categories.find(c => c.id === categoryFilter)?.name || 'Category'}
                    <ChevronDown className="w-3 h-3 opacity-50 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[220px] max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                    All Categories
                    {categoryFilter === 'all' && <Check className="w-3 h-3 ml-auto text-amber-500" />}
                  </DropdownMenuItem>
                  {categories.map(cat => {
                    const count = categoryCounts[cat.id] || 0;
                    return (
                      <DropdownMenuItem
                        key={cat.id}
                        onClick={() => setCategoryFilter(cat.id)}
                        disabled={count === 0}
                        className={cn("flex justify-between", count === 0 && "opacity-50 cursor-not-allowed")}
                      >
                        <span>{cat.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 rounded-full">{count}</span>
                          {categoryFilter === cat.id && <Check className="w-3 h-3 text-amber-500" />}
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="hidden xl:block px-2 text-xs text-gray-400 font-medium ml-auto">
              Showing {filteredDesigns.length} of {designs.length} designs
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 pt-8 space-y-6">
        {filteredDesigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
              <Plus className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Designs Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' ? "No designs match your filters." : "Start building your portfolio by adding your first design using the plus button."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredDesigns.map((design) => (
              <TailorDesignCard
                key={design.id}
                design={design}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <DesignPreviewDialog
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          design={selectedDesign}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Mobile Filter Drawer */}
      <Sheet open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-12 pt-2 h-[80vh] flex flex-col">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 flex-shrink-0" />
          <SheetHeader className="mb-6 flex-shrink-0">
            <SheetTitle className="text-2xl font-bold text-gray-900">Filters</SheetTitle>
            <SheetDescription>Refine your design list</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-8 pb-4">
            {/* Status Section */}
            <div className="space-y-4">
              <Label className="text-sm font-bold uppercase tracking-widest text-gray-500">Status</Label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'approved', 'pending', 'correction_requested', 'rejected'].map((s) => (
                  <Button
                    key={s}
                    variant={statusFilter === s ? "default" : "outline"}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "justify-start text-xs h-10 rounded-xl",
                      statusFilter === s ? "bg-amber-600 hover:bg-amber-700" : "border-gray-100"
                    )}
                  >
                    {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Gender Section */}
            <div className="space-y-4">
              <Label className="text-sm font-bold uppercase tracking-widest text-gray-500">Gender</Label>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {['all', 'men', 'women'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                      genderFilter === g ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    )}
                  >
                    {g.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Section */}
            <div className="space-y-4">
              <Label className="text-sm font-bold uppercase tracking-widest text-gray-500">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full h-11 rounded-xl bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} ({categoryCounts[cat.id] || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl text-gray-500 hover:text-gray-900 border-gray-200"
              onClick={() => {
                setStatusFilter('all');
                setGenderFilter('all');
                setCategoryFilter('all');
              }}
            >
              Reset
            </Button>
            <Button
              className="flex-[2] h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20"
              onClick={() => setIsFilterDrawerOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent >
      </Sheet >

      {/* Floating Action Button for Mobile */}
      <Button
        onClick={() => setIsCreating(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xl shadow-amber-500/40 border-none sm:hidden flex items-center justify-center z-50 active:scale-95 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </Button>
    </div >
  );
}
