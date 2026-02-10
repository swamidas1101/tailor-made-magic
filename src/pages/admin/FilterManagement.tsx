import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Loader2,
    ChevronDown,
    ChevronRight,
    GripVertical,
    Check,
    X,
    Filter,
    Users,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { filterService } from "@/services/filterService";
import { categoryService } from "@/services/categoryService";
import { FilterGroup, FilterOption, Category } from "@/types/database";

export default function FilterManagement() {
    const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Dialog States
    const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
    const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);

    // Editing States
    const [editingGroup, setEditingGroup] = useState<FilterGroup | null>(null);
    const [editingOption, setEditingOption] = useState<FilterOption | null>(null);
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

    // Options State (fetched on demand)
    const [groupOptions, setGroupOptions] = useState<Record<string, FilterOption[]>>({});
    const [loadingOptions, setLoadingOptions] = useState<Record<string, boolean>>({});

    // Forms
    const [groupForm, setGroupForm] = useState({
        name: "",
        description: "",
        applicableGender: "both" as "men" | "women" | "both",
        applicableCategories: [] as string[],
        displayOrder: 0,
        isActive: true
    });

    const [optionForm, setOptionForm] = useState({
        name: "",
        value: "",
        displayOrder: 0,
        isActive: true
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [groups, cats] = await Promise.all([
                filterService.getFilterGroups(),
                categoryService.getCategories()
            ]);
            setFilterGroups(groups);
            setCategories(cats);
        } catch (error) {
            toast.error("Failed to load filter data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOptionsForGroup = async (groupId: string) => {
        if (groupOptions[groupId]) return; // Already loaded

        try {
            setLoadingOptions(prev => ({ ...prev, [groupId]: true }));
            const options = await filterService.getAllFilterOptions(groupId);
            setGroupOptions(prev => ({ ...prev, [groupId]: options }));
        } catch (error) {
            console.error("Failed to load options", error);
        } finally {
            setLoadingOptions(prev => ({ ...prev, [groupId]: false }));
        }
    };

    // Group Management
    const handleOpenGroupDialog = (group?: FilterGroup) => {
        if (group) {
            setEditingGroup(group);
            setGroupForm({
                name: group.name,
                description: group.description,
                applicableGender: group.applicableGender,
                applicableCategories: group.applicableCategories,
                displayOrder: group.displayOrder,
                isActive: group.isActive
            });
        } else {
            setEditingGroup(null);
            setGroupForm({
                name: "",
                description: "",
                applicableGender: "both",
                applicableCategories: [],
                displayOrder: filterGroups.length,
                isActive: true
            });
        }
        setIsGroupDialogOpen(true);
    };

    const handleGroupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingGroup) {
                await filterService.updateFilterGroup(editingGroup.id, groupForm);
                toast.success("Filter group updated");
            } else {
                await filterService.createFilterGroup({
                    ...groupForm,
                    createdBy: "admin"
                });
                toast.success("Filter group created");
            }
            setIsGroupDialogOpen(false);
            fetchInitialData();
        } catch (error) {
            toast.error("Failed to save filter group");
        }
    };

    const handleDeleteGroup = async (id: string) => {
        if (!confirm("Delete this group and all its options?")) return;
        try {
            await filterService.deleteFilterGroup(id);
            toast.success("Filter group deleted");
            fetchInitialData();
        } catch (error) {
            toast.error("Failed to delete group");
        }
    };

    // Option Management
    const handleOpenOptionDialog = (groupId: string, option?: FilterOption) => {
        setActiveGroupId(groupId);
        if (option) {
            setEditingOption(option);
            setOptionForm({
                name: option.name,
                value: option.value,
                displayOrder: option.displayOrder,
                isActive: option.isActive
            });
        } else {
            setEditingOption(null);
            const currentOptions = groupOptions[groupId] || [];
            setOptionForm({
                name: "",
                value: "",
                displayOrder: currentOptions.length,
                isActive: true
            });
        }
        setIsOptionDialogOpen(true);
    };

    const handleOptionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeGroupId) return;

        try {
            const value = optionForm.value || optionForm.name.toLowerCase().replace(/\s+/g, "-");

            if (editingOption) {
                await filterService.updateFilterOption(editingOption.id, {
                    ...optionForm,
                    value
                });
                toast.success("Option updated");
            } else {
                await filterService.createFilterOption({
                    filterGroupId: activeGroupId,
                    ...optionForm,
                    value,
                    createdBy: "admin"
                });
                toast.success("Option created");
            }

            // Refresh options for this group
            const updatedOptions = await filterService.getAllFilterOptions(activeGroupId);
            setGroupOptions(prev => ({ ...prev, [activeGroupId]: updatedOptions }));
            setIsOptionDialogOpen(false);
        } catch (error) {
            toast.error("Failed to save option");
        }
    };

    const handleDeleteOption = async (groupId: string, optionId: string) => {
        if (!confirm("Delete this option?")) return;
        try {
            await filterService.deleteFilterOption(optionId);
            toast.success("Option deleted");
            const updatedOptions = await filterService.getAllFilterOptions(groupId);
            setGroupOptions(prev => ({ ...prev, [groupId]: updatedOptions }));
        } catch (error) {
            toast.error("Failed to delete option");
        }
    };

    const filteredGroups = filterGroups.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
                <div className="w-full px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Filter Management
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Manage and organize your product filtering options
                            </p>
                        </div>
                        <Button
                            onClick={() => handleOpenGroupDialog()}
                            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            New Filter Group
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 pt-8 space-y-8">
                {/* Search & Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber-500">
                            <Search className="w-4 h-4" />
                        </div>
                        <Input
                            placeholder="Search filter groups by name, category, or gender..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-14 h-14 rounded-2xl border-gray-200 bg-white shadow-sm focus:border-amber-400 focus:ring-amber-400/20 text-base"
                        />
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Filter className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-amber-100 text-xs font-medium uppercase tracking-wider">Total Groups</p>
                            <p className="text-2xl font-bold">{filteredGroups.length}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Filter className="w-6 h-6 text-amber-500" />
                                </div>
                            </div>
                            <p className="mt-6 text-lg font-medium text-gray-900">Loading filters...</p>
                            <p className="text-gray-500">Please wait while we fetch the configuration.</p>
                        </div>
                    ) : filteredGroups.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
                            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                                <Filter className="w-10 h-10 text-orange-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Filter Groups Found</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-8">
                                {searchTerm ? "No filters match your search criteria. Try a different term." : "Get started by creating your first filter group to categorize your products."}
                            </p>
                            <Button
                                onClick={() => handleOpenGroupDialog()}
                                variant="outline"
                                className="border-orange-200 text-orange-700 hover:bg-orange-50 h-10 px-8"
                            >
                                {searchTerm ? "Clear Search" : "Create Group"}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredGroups.map(group => (
                                <Collapsible
                                    key={group.id}
                                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 overflow-hidden"
                                    onOpenChange={(open) => {
                                        if (open) fetchOptionsForGroup(group.id);
                                    }}
                                >
                                    <div className="p-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl bg-white group-data-[state=open]:bg-gray-50/50 transition-colors gap-4">
                                            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                                    <Filter className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                        <h3 className="font-bold text-lg sm:text-xl text-gray-900 leading-none">
                                                            {group.name}
                                                        </h3>
                                                        {!group.isActive ? (
                                                            <Badge variant="destructive" className="h-5 px-2 text-[10px] uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 hover:bg-red-100">Inactive</Badge>
                                                        ) : (
                                                            <Badge className="h-5 px-2 text-[10px] uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100">Active</Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
                                                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 pl-2 pr-3 py-1 rounded-full">
                                                            <Users className="w-3.5 h-3.5" />
                                                            {group.applicableGender === 'both' ? 'All Genders' : group.applicableGender === 'women' ? "Women's" : "Men's"}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 pl-2 pr-3 py-1 rounded-full">
                                                            <Layers className="w-3.5 h-3.5" />
                                                            {group.applicableCategories.length === 0 ? "All Categories" : `${group.applicableCategories.length} Categories`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenGroupDialog(group);
                                                        }}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteGroup(group.id);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="hidden sm:block w-px h-8 bg-gray-200" />
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="gap-2 px-3 sm:px-4 h-9 sm:h-10 rounded-full font-semibold text-gray-600 hover:text-amber-600 hover:bg-amber-50 group-data-[state=open]:bg-amber-50 group-data-[state=open]:text-amber-700 text-xs sm:text-sm ml-auto sm:ml-0"
                                                    >
                                                        <span className="group-data-[state=open]:hidden">View</span>
                                                        <span className="hidden group-data-[state=open]:inline">Hide</span>
                                                        <ChevronDown className="w-4 h-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                                                    </Button>
                                                </CollapsibleTrigger>
                                            </div>
                                        </div>
                                    </div>

                                    <CollapsibleContent>
                                        <div className="p-6 pt-2">
                                            <div className="bg-gray-50/80 rounded-2xl p-4 sm:p-6 border border-gray-100">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                                            <Filter className="w-4 h-4" />
                                                        </div>
                                                        <h4 className="font-bold text-gray-900">
                                                            Filter Options
                                                            <span className="ml-2 px-2 py-0.5 rounded-md bg-white border border-gray-200 text-xs text-gray-500 font-medium">
                                                                {groupOptions[group.id]?.length || 0}
                                                            </span>
                                                        </h4>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleOpenOptionDialog(group.id)}
                                                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-none shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] h-10 px-6 rounded-xl"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Add New Option
                                                    </Button>
                                                </div>

                                                {loadingOptions[group.id] ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                                                        {[1, 2, 3, 4].map(i => (
                                                            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                                                        {groupOptions[group.id]?.map(option => (
                                                            <div
                                                                key={option.id}
                                                                className="group/option relative flex flex-col justify-center p-2 sm:p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-200 min-h-[60px] sm:min-h-[80px]"
                                                            >
                                                                <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-0">
                                                                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${option.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-gray-300'}`}></div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                                                                            {option.name}
                                                                        </p>
                                                                        <p className="text-[9px] sm:text-xs text-gray-400 font-mono sm:mt-0.5 truncate">
                                                                            {option.value}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-end gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover/option:opacity-100 transition-opacity">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg"
                                                                        onClick={() => handleOpenOptionDialog(group.id, option)}
                                                                    >
                                                                        <Pencil className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg"
                                                                        onClick={() => handleDeleteOption(group.id, option.id)}
                                                                    >
                                                                        <Trash2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {(!groupOptions[group.id] || groupOptions[group.id].length === 0) && (
                                                            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                                                                    <Layers className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                                <p className="text-gray-900 font-medium">No options defined</p>
                                                                <p className="text-gray-500 text-sm mt-1">This group doesn't have any filter choices yet.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Group Dialog */}
            <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
                <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl">
                    <DialogHeader className="pb-4 border-b border-gray-100">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            {editingGroup ? "Edit Filter Group" : "Create Filter Group"}
                        </DialogTitle>
                        <DialogDescription>
                            Configure the properties for this filter category.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleGroupSubmit} className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Group Name</Label>
                            <Input
                                value={groupForm.name}
                                onChange={e => setGroupForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., Color, Size, Material"
                                className="h-11 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">Display Order</Label>
                                <Input
                                    type="number"
                                    value={groupForm.displayOrder}
                                    onChange={e => setGroupForm(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                                    className="h-11 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">Gender</Label>
                                <Select
                                    value={groupForm.applicableGender}
                                    onValueChange={(val: any) => setGroupForm(prev => ({ ...prev, applicableGender: val }))}
                                >
                                    <SelectTrigger className="h-11 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="both">Both</SelectItem>
                                        <SelectItem value="men">Men</SelectItem>
                                        <SelectItem value="women">Women</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700">Applicable Categories</Label>
                            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 max-h-48 overflow-y-auto custom-scrollbar">
                                <div className="flex flex-wrap gap-2">
                                    {categories
                                        .filter(c => groupForm.applicableGender === 'both' || c.type === groupForm.applicableGender)
                                        .map(cat => (
                                            <Badge
                                                key={cat.id}
                                                variant={groupForm.applicableCategories.includes(cat.id) ? "default" : "outline"}
                                                className={`cursor-pointer px-3 py-1.5 transition-all text-sm ${groupForm.applicableCategories.includes(cat.id)
                                                    ? "bg-amber-500 hover:bg-amber-600 text-white border-transparent"
                                                    : "bg-white hover:bg-gray-100 text-gray-600 border-gray-200"
                                                    }`}
                                                onClick={() => {
                                                    setGroupForm(prev => {
                                                        const newCats = prev.applicableCategories.includes(cat.id)
                                                            ? prev.applicableCategories.filter(id => id !== cat.id)
                                                            : [...prev.applicableCategories, cat.id];
                                                        return { ...prev, applicableCategories: newCats };
                                                    });
                                                }}
                                            >
                                                {cat.name}
                                                {groupForm.applicableCategories.includes(cat.id) && <Check className="w-3.5 h-3.5 ml-1.5" />}
                                            </Badge>
                                        ))}
                                    {categories.length === 0 && <p className="text-sm text-gray-400 italic">No categories available.</p>}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                Select categories to limit this filter, or leave empty for all.
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <Label className="text-sm font-semibold text-gray-700">Status</Label>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm ${groupForm.isActive ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                                    {groupForm.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <Switch
                                    checked={groupForm.isActive}
                                    onCheckedChange={checked => setGroupForm(prev => ({ ...prev, isActive: checked }))}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4 mt-6 border-t border-gray-100">
                            <Button type="button" variant="ghost" onClick={() => setIsGroupDialogOpen(false)} className="hover:bg-gray-100">Cancel</Button>
                            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-8">
                                {editingGroup ? "Save Changes" : "Create Group"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Option Dialog */}
            <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
                <DialogContent className="sm:max-w-[400px] border-0 shadow-2xl">
                    <DialogHeader className="pb-4 border-b border-gray-100">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            {editingOption ? "Edit Option" : "Add Option"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleOptionSubmit} className="space-y-5 pt-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Option Name</Label>
                            <Input
                                value={optionForm.name}
                                onChange={e => setOptionForm(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., Small, Red, Cotton"
                                className="h-11 border-gray-200 focus:border-amber-500 focus:ring-amber-500/20"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Value ID (Slug)</Label>
                            <Input
                                value={optionForm.value}
                                onChange={e => setOptionForm(prev => ({ ...prev, value: e.target.value }))}
                                placeholder="auto-generated-slug"
                                className="h-11 border-gray-200 bg-gray-50/50 font-mono text-xs focus:border-amber-500 focus:ring-amber-500/20"
                            />
                            <p className="text-[10px] text-gray-400">Unique identifier for system use.</p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <Label className="text-sm font-semibold text-gray-700">Status</Label>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm ${optionForm.isActive ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                                    {optionForm.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <Switch
                                    checked={optionForm.isActive}
                                    onCheckedChange={checked => setOptionForm(prev => ({ ...prev, isActive: checked }))}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4 mt-6 border-t border-gray-100">
                            <Button type="button" variant="ghost" onClick={() => setIsOptionDialogOpen(false)} className="hover:bg-gray-100">Cancel</Button>
                            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">
                                {editingOption ? "Update Option" : "Add Option"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
