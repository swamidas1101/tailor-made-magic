import { useState, useEffect, useMemo } from "react";
import { ChevronDown, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { filterService } from "@/services/filterService";
import { FilterGroup, FilterOption } from "@/types/database";

export interface DynamicFiltersState {
    // Dynamic filters: groupId -> array of option (values or IDs)
    [groupId: string]: string[] | [number, number] | number | null;
    // Special keys:
    // 'priceRange': [number, number]
    // 'deliveryDays': number | null
}

interface DynamicFilterSidebarProps {
    categoryId?: string;
    gender?: "men" | "women";
    filters: DynamicFiltersState;
    onFilterChange: (filters: DynamicFiltersState) => void;
    onClearAll: () => void;
}

export function DynamicFilterSidebar({
    categoryId,
    gender,
    filters,
    onFilterChange,
    onClearAll
}: DynamicFilterSidebarProps) {
    const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
    const [filterOptions, setFilterOptions] = useState<Record<string, FilterOption[]>>({});
    const [loading, setLoading] = useState(false);

    // Initialize open sections with price and delivery, plus first 2 dynamic groups
    const [openSections, setOpenSections] = useState<string[]>(["price", "delivery"]);

    useEffect(() => {
        const loadFilters = async () => {
            // If no category selected, maybe show generic filters or nothing? 
            // For now, let's assume if no category, we show nothing or global filters.
            // But typically browsing is by category.
            if (!categoryId) {
                setFilterGroups([]);
                return;
            }

            try {
                setLoading(true);
                // Gender is optional, if not provided maybe fetch for both or infer?
                // We'll pass generic "women" if missing or handle in service
                const safeGender = gender || "women";

                const groups = await filterService.getFiltersForCategory(categoryId, safeGender);
                setFilterGroups(groups);

                // Load options for these groups
                const optionsMap: Record<string, FilterOption[]> = {};
                await Promise.all(groups.map(async (group) => {
                    const options = await filterService.getFilterOptions(group.id);
                    optionsMap[group.id] = options;
                }));
                setFilterOptions(optionsMap);

                // Auto-open first few groups
                if (groups.length > 0) {
                    setOpenSections(prev => [...prev, ...groups.slice(0, 2).map(g => g.id)]);
                }
            } catch (error) {
                console.error("Failed to load dynamic filters", error);
            } finally {
                setLoading(false);
            }
        };

        loadFilters();
    }, [categoryId, gender]);

    const toggleSection = (section: string) => {
        setOpenSections((prev) =>
            prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
        );
    };

    const handleCheckboxChange = (groupId: string, value: string) => {
        const currentValues = (filters[groupId] as string[]) || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value];

        onFilterChange({ ...filters, [groupId]: newValues });
    };

    const handlePriceChange = (value: number[]) => {
        onFilterChange({ ...filters, priceRange: [value[0], value[1]] });
    };

    const handleDeliveryChange = (days: number | null) => {
        onFilterChange({
            ...filters,
            deliveryDays: filters.deliveryDays === days ? null : days
        });
    };

    // Calculate distinct active filters count
    const totalActiveFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (key === 'priceRange') {
            const range = value as [number, number];
            return acc + (range[0] > 0 || range[1] < 10000 ? 1 : 0);
        }
        if (key === 'deliveryDays') return acc + (value ? 1 : 0);
        // Array filters
        return acc + (Array.isArray(value) ? value.length : 0);
    }, 0);

    // Helper to get option label
    const getOptionLabel = (groupId: string, value: string) => {
        const options = filterOptions[groupId];
        const option = options?.find(o => o.value === value);
        return option ? option.name : value;
    };

    // Helper to get group name
    const getGroupName = (groupId: string) => {
        const group = filterGroups.find(g => g.id === groupId);
        return group ? group.name : groupId;
    };

    if (loading) {
        return (
            <div className="space-y-4 p-1">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-20 bg-muted/50 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-muted/50 rounded animate-pulse" />
                </div>
                <div className="space-y-6 pt-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-5 w-3/4 bg-muted/50 rounded animate-pulse" />
                            <div className="space-y-2 pl-2">
                                <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
                                <div className="h-4 w-5/6 bg-muted/30 rounded animate-pulse" />
                                <div className="h-4 w-4/6 bg-muted/30 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (filterGroups.length === 0 && !filters.priceRange && !filters.deliveryDays) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-border/60 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-border/60 bg-muted/10 flex items-center justify-between">
                <div>
                    <h3 className="font-display font-bold text-lg text-foreground tracking-tight">Refine Collection</h3>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5 flex items-center gap-2">
                        <span>{totalActiveFilters} Active Filters</span>
                        {totalActiveFilters > 0 && <span className="h-1 w-1 rounded-full bg-amber-500" />}
                    </p>
                </div>
                {totalActiveFilters > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearAll}
                        className="h-8 px-2 text-xs hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                    >
                        Clear All
                        <X className="w-3 h-3 ml-1" />
                    </Button>
                )}
            </div>

            <div className="p-5 space-y-6">
                {/* Active Filter Chips */}
                {totalActiveFilters > 0 && (
                    <div className="flex flex-wrap gap-1.5 pb-4 border-b border-dashed border-border/80">
                        {Object.entries(filters).map(([key, value]) => {
                            if (key === 'priceRange' || key === 'deliveryDays') return null;
                            const values = value as string[];
                            return values.map(val => (
                                <Badge
                                    key={`${key}-${val}`}
                                    variant="secondary"
                                    className="gap-1.5 py-1 pl-2 pr-1.5 text-[10px] font-medium bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-100/50 transition-colors cursor-pointer group"
                                    onClick={() => handleCheckboxChange(key, val)}
                                >
                                    {getOptionLabel(key, val)}
                                    <div className="bg-amber-800/10 group-hover:bg-amber-800/20 rounded-full p-0.5 transition-colors">
                                        <X className="w-2.5 h-2.5" />
                                    </div>
                                </Badge>
                            ));
                        })}
                        {filters.deliveryDays && (
                            <Badge
                                variant="secondary"
                                className="gap-1.5 py-1 pl-2 pr-1.5 text-[10px] font-medium bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-100/50 transition-colors cursor-pointer group"
                                onClick={() => handleDeliveryChange(filters.deliveryDays as number)}
                            >
                                Delivery &lt; {filters.deliveryDays}d
                                <div className="bg-blue-800/10 group-hover:bg-blue-800/20 rounded-full p-0.5 transition-colors">
                                    <X className="w-2.5 h-2.5" />
                                </div>
                            </Badge>
                        )}
                        {(filters.priceRange as [number, number])[0] > 0 || (filters.priceRange as [number, number])[1] < 10000 ? (
                            <Badge
                                variant="secondary"
                                className="gap-1.5 py-1 pl-2 pr-1.5 text-[10px] font-medium bg-green-50 text-green-800 hover:bg-green-100 border border-green-100/50 transition-colors cursor-pointer group"
                                onClick={() => handlePriceChange([0, 10000])}
                            >
                                ₹{(filters.priceRange as [number, number])[0]} - ₹{(filters.priceRange as [number, number])[1]}
                                <div className="bg-green-800/10 group-hover:bg-green-800/20 rounded-full p-0.5 transition-colors">
                                    <X className="w-2.5 h-2.5" />
                                </div>
                            </Badge>
                        ) : null}
                    </div>
                )}

                {/* Price Range */}
                <Collapsible open={openSections.includes("price")} onOpenChange={() => toggleSection("price")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-1 text-sm font-semibold hover:text-amber-600 transition-colors group">
                        <span className="text-foreground/90 group-hover:text-amber-600 transition-colors flex items-center gap-2">
                            Price Range
                            <span className="text-[10px] text-muted-foreground font-normal">(In ₹)</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground/70 transition-transform duration-300 ${openSections.includes("price") ? "rotate-180 text-amber-600" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 pb-2 px-1">
                        <Slider
                            value={filters.priceRange as [number, number]}
                            onValueChange={handlePriceChange}
                            min={0}
                            max={10000}
                            step={100}
                            className="mb-4"
                        />
                        <div className="flex justify-between items-center text-xs">
                            <div className="px-2 py-1 rounded bg-muted/50 border border-border/50 text-muted-foreground font-mono">
                                ₹{(filters.priceRange as [number, number])[0].toLocaleString()}
                            </div>
                            <span className="text-muted-foreground/50">-</span>
                            <div className="px-2 py-1 rounded bg-muted/50 border border-border/50 text-muted-foreground font-mono">
                                ₹{(filters.priceRange as [number, number])[1].toLocaleString()}
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <div className="h-px bg-border/40" />

                {/* Delivery Time */}
                <Collapsible open={openSections.includes("delivery")} onOpenChange={() => toggleSection("delivery")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-1 text-sm font-semibold hover:text-amber-600 transition-colors group">
                        <span className="text-foreground/90 group-hover:text-amber-600 transition-colors">Delivery Time</span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground/70 transition-transform duration-300 ${openSections.includes("delivery") ? "rotate-180 text-amber-600" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3 space-y-2.5">
                        {[3, 5, 7, 10].map((days) => (
                            <label key={days} className="flex items-center gap-3 cursor-pointer group select-none">
                                <Checkbox
                                    checked={filters.deliveryDays === days}
                                    onCheckedChange={() => handleDeliveryChange(days)}
                                    className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 w-4 h-4 rounded-[4px]"
                                />
                                <span className={`text-sm transition-colors ${filters.deliveryDays === days ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground"}`}>
                                    Within {days} days
                                </span>
                            </label>
                        ))}
                    </CollapsibleContent>
                </Collapsible>

                {/* Dynamic Filter Sections */}
                {filterGroups.map((group) => {
                    const options = filterOptions[group.id] || [];
                    if (options.length === 0) return null;

                    const activeCount = (filters[group.id] as string[] || []).length;

                    return (
                        <div key={group.id}>
                            <div className="h-px bg-border/40 my-4" />
                            <Collapsible open={openSections.includes(group.id)} onOpenChange={() => toggleSection(group.id)}>
                                <CollapsibleTrigger className="flex items-center justify-between w-full py-1 text-sm font-semibold hover:text-amber-600 transition-colors group">
                                    <span className="flex items-center gap-2 text-foreground/90 group-hover:text-amber-600 transition-colors">
                                        {group.name}
                                        {activeCount > 0 && (
                                            <span className="flex items-center justify-center bg-amber-100 text-amber-700 text-[9px] font-bold h-4 w-4 rounded-full">
                                                {activeCount}
                                            </span>
                                        )}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-muted-foreground/70 transition-transform duration-300 ${openSections.includes(group.id) ? "rotate-180 text-amber-600" : ""}`} />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pt-3 space-y-2.5">
                                    {options.map((option) => {
                                        const isChecked = (filters[group.id] as string[] || []).includes(option.value);
                                        return (
                                            <label key={option.id} className="flex items-center gap-3 cursor-pointer group select-none">
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={() => handleCheckboxChange(group.id, option.value)}
                                                    className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 w-4 h-4 rounded-[4px]"
                                                />
                                                <span className={`text-sm transition-colors ${isChecked ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                                                    {option.name}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
