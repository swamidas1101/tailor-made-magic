import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Loader2,
    Ruler,
    ChevronDown,
    ChevronUp,
    Save,
    X,
    Database
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
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { measurementService } from "@/services/measurementService";
import { MeasurementConfig, MeasurementField } from "@/types/database";
import { seedMeasurements } from "@/scripts/seedMeasurements";

export default function MeasurementManagement() {
    const [configs, setConfigs] = useState<MeasurementConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingConfig, setEditingConfig] = useState<MeasurementConfig | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [seedLoading, setSeedLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Omit<MeasurementConfig, "id" | "createdAt" | "updatedAt">>({
        name: "",
        icon: "📏",
        description: "",
        categoryIds: [],
        fields: [],
        isActive: true
    });

    const fetchConfigs = async () => {
        try {
            setLoading(true);
            const data = await measurementService.getMeasurementConfigs();
            setConfigs(data);
        } catch (error) {
            toast.error("Failed to load measurement configurations");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const handleOpenDialog = (config?: MeasurementConfig) => {
        if (config) {
            setEditingConfig(config);
            setFormData({
                name: config.name,
                icon: config.icon,
                description: config.description || "",
                categoryIds: config.categoryIds,
                fields: config.fields,
                isActive: config.isActive
            });
        } else {
            setEditingConfig(null);
            setFormData({
                name: "",
                icon: "📏",
                description: "",
                categoryIds: [],
                fields: [],
                isActive: true
            });
        }
        setIsDialogOpen(true);
    };

    const handleAddField = () => {
        const newField: MeasurementField = {
            id: crypto.randomUUID(),
            name: "",
            key: "",
            hint: "",
            displayOrder: formData.fields.length + 1,
            isActive: true
        };
        setFormData(prev => ({
            ...prev,
            fields: [...prev.fields, newField]
        }));
    };

    const handleRemoveField = (id: string) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.filter(f => f.id !== id)
        }));
    };

    const handleFieldChange = (id: string, field: keyof MeasurementField, value: any) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.map(f => f.id === id ? { ...f, [field]: value } : f)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.fields.length === 0) {
            toast.error("Name and at least one field are required");
            return;
        }

        try {
            setSubmitLoading(true);
            if (editingConfig) {
                await measurementService.updateMeasurementConfig(editingConfig.id, formData);
                toast.success("Configuration updated successfully");
            } else {
                await measurementService.createMeasurementConfig(formData);
                toast.success("Configuration created successfully");
            }
            setIsDialogOpen(false);
            fetchConfigs();
        } catch (error) {
            toast.error("Failed to save configuration");
            console.error(error);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This may affect products in linked categories.")) return;
        try {
            await measurementService.deleteMeasurementConfig(id);
            toast.success("Configuration deleted");
            fetchConfigs();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const handleSeed = async () => {
        if (!confirm("Seed initial measurement data? This will link to existing categories based on slugs.")) return;
        try {
            setSeedLoading(true);
            await seedMeasurements();
            toast.success("Seeding completed!");
            fetchConfigs();
        } catch (error) {
            toast.error("Seeding failed");
        } finally {
            setSeedLoading(false);
        }
    };

    const filteredConfigs = configs.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
                <div className="w-full px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Measurement Management
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Define measurement sets for different apparel types
                            </p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                onClick={handleSeed}
                                disabled={seedLoading}
                                variant="outline"
                                className="border-amber-200 hover:bg-amber-50"
                            >
                                {seedLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
                                Seed Initial Data
                            </Button>
                            <Button
                                onClick={() => handleOpenDialog()}
                                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Configuration
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 pt-8 space-y-8">
                <div className="relative max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search configurations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 border-gray-300 focus:border-amber-500 rounded-xl"
                    />
                </div>

                <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Icon</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Fields Count</TableHead>
                                <TableHead>Linked Categories</TableHead>
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
                            ) : filteredConfigs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No measurement configurations found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredConfigs.map((config) => (
                                    <TableRow key={config.id}>
                                        <TableCell className="text-2xl">{config.icon}</TableCell>
                                        <TableCell className="font-medium">{config.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{config.fields.length} Fields</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{config.categoryIds?.length || 0} Categories</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={config.isActive ? "default" : "secondary"}>
                                                {config.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(config)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(config.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingConfig ? "Edit Configuration" : "Add New Configuration"}</DialogTitle>
                        <DialogDescription>
                            Define the measurement fields required for this apparel type.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon (Emoji)</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                    className="text-center text-xl"
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="name">Configuration Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. Blouse"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Short description..."
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <Label className="text-base font-semibold">Measurement Fields</Label>
                                <Button type="button" size="sm" onClick={handleAddField} className="h-8">
                                    <Plus className="w-4 h-4 mr-1" /> Add Field
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {formData.fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-2 items-start bg-gray-50 p-3 rounded-lg border group relative">
                                        <div className="col-span-3 space-y-1">
                                            <Label className="text-[10px]">Label</Label>
                                            <Input
                                                value={field.name}
                                                onChange={(e) => handleFieldChange(field.id, "name", e.target.value)}
                                                placeholder="Bust"
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                        <div className="col-span-3 space-y-1">
                                            <Label className="text-[10px]">DB Key</Label>
                                            <Input
                                                value={field.key}
                                                onChange={(e) => handleFieldChange(field.id, "key", e.target.value)}
                                                placeholder="bust"
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                        <div className="col-span-5 space-y-1">
                                            <Label className="text-[10px]">Hint/Instruction</Label>
                                            <Input
                                                value={field.hint}
                                                onChange={(e) => handleFieldChange(field.id, "hint", e.target.value)}
                                                placeholder="Fullest part..."
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                        <div className="col-span-1 flex items-center justify-center pt-5">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveField(field.id)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {formData.fields.length === 0 && (
                                    <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                                        No fields added yet. Click "Add Field" to start.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="active"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                            />
                            <Label htmlFor="active">Active</Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitLoading || formData.fields.length === 0} className="bg-amber-600">
                                {submitLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {editingConfig ? "Update Configuration" : "Create Configuration"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
