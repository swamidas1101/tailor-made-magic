import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Loader2,
    MoreHorizontal,
    ArrowUpDown,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileUploader } from "@/components/ui/file-uploader";
import { categoryService } from "@/services/categoryService";
import { measurementService } from "@/services/measurementService";
import { Category, MeasurementConfig } from "@/types/database";

export default function CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [measurementConfigs, setMeasurementConfigs] = useState<MeasurementConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        type: "women" as "women" | "men",
        description: "",
        image: "",
        slug: "",
        displayOrder: 0,
        measurementConfigId: "none",
        isActive: true
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [categoryData, measurementData] = await Promise.all([
                categoryService.getCategories(),
                measurementService.getMeasurementConfigs()
            ]);
            setCategories(categoryData);
            setMeasurementConfigs(measurementData);
        } catch (error) {
            toast.error("Failed to load data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                type: category.type,
                description: category.description,
                image: category.image,
                slug: category.slug,
                displayOrder: category.displayOrder,
                measurementConfigId: category.measurementConfigId || "none",
                isActive: category.isActive
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: "",
                type: "women",
                description: "",
                image: "",
                slug: "",
                displayOrder: categories.length,
                measurementConfigId: "none",
                isActive: true
            });
        }
        setIsDialogOpen(true);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: !editingCategory ? generateSlug(name) : prev.slug
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.image) {
            toast.error("Name and Image are required");
            return;
        }

        try {
            setSubmitLoading(true);

            const submissionData = {
                ...formData,
                measurementConfigId: formData.measurementConfigId === "none" ? "" : formData.measurementConfigId
            };

            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, submissionData);
                toast.success("Category updated successfully");
            } else {
                await categoryService.createCategory({
                    ...submissionData,
                    createdBy: "admin" // TODO: Use actual admin ID
                });
                toast.success("Category created successfully");
            }

            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Failed to save category");
            console.error(error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await categoryService.deleteCategory(id);
            toast.success("Category deleted");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    const handleToggleStatus = async (category: Category) => {
        try {
            await categoryService.toggleCategoryStatus(category.id, !category.isActive);
            toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'}`);
            fetchData();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
                <div className="w-full px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Category Management
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Manage product categories and hierarchy
                            </p>
                        </div>
                        <Button
                            onClick={() => handleOpenDialog()}
                            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Category
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 pt-8 space-y-8">
                {/* Search */}
                <div className="relative max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
                    />
                </div>

                <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">Image</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1 group cursor-help" title="The unique URL identifier for this category (e.g., /category/blouse-designs)">
                                        Name <span className="text-[10px] text-muted-foreground font-normal">(Slug)</span>
                                    </div>
                                </TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-center">
                                    <div className="flex items-center justify-center gap-1 cursor-help" title="Determines the sorting order in the user-facing app (Lower numbers appear first)">
                                        Order <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredCategories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCategories.map((category) => (
                                    <TableRow key={category.id} className="h-12">
                                        <TableCell className="py-2">
                                            <div className="h-8 w-8 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                                {category.image ? (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop"; // Fallback placeholder
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Img</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <div className="font-medium text-sm">{category.name}</div>
                                            <div className="text-[10px] text-muted-foreground hidden sm:block">/{category.slug}</div>
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <Badge variant={category.type === 'women' ? 'default' : 'secondary'} className={`text-[10px] px-1.5 h-5 ${category.type === 'women' ? 'bg-pink-100 text-pink-700 hover:bg-pink-100' : 'bg-blue-100 text-blue-700 hover:bg-blue-100'}`}>
                                                {category.type === 'women' ? "Women" : "Men"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center py-2 text-xs">{category.displayOrder}</TableCell>
                                        <TableCell className="text-center py-2">
                                            <Switch
                                                checked={category.isActive}
                                                onCheckedChange={() => handleToggleStatus(category)}
                                                className="scale-75 origin-center"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right py-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-muted">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(category)}>
                                                        <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(category.id)}>
                                                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                            <DialogDescription>
                                Details about the category and how it appears in the store.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                        placeholder="e.g. Blouse Designs"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        placeholder="e.g. blouse-designs"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type *</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value: "men" | "women") => setFormData(prev => ({ ...prev, type: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="women">Women's Tailoring</SelectItem>
                                            <SelectItem value="men">Men's Tailoring</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="measurementConfig">Measurement Configuration</Label>
                                    <Select
                                        value={formData.measurementConfigId}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, measurementConfigId: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select measurement set" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            {measurementConfigs.map(config => (
                                                <SelectItem key={config.id} value={config.id}>
                                                    {config.icon} {config.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Display Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) }))}
                                    min={0}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Brief description of the category..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Category Image *</Label>
                                <FileUploader
                                    label="Upload Image"
                                    value={formData.image}
                                    onChange={(base64) => setFormData(prev => ({ ...prev, image: base64 }))}
                                    onRemove={() => setFormData(prev => ({ ...prev, image: "" }))}
                                    description="Optimal size: 600x800px. Used for category cards and headers."
                                />
                                <p className="text-xs text-muted-foreground">
                                    Optimal size: 600x800px. Used for category cards and headers.
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="active"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                                />
                                <Label htmlFor="active">Active (Visible to users)</Label>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitLoading} className="bg-amber-600 hover:bg-amber-700">
                                    {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {editingCategory ? "Update Category" : "Create Category"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
