import { useState, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { filterOptions } from "@/data/mockData";

export interface ActiveFilters {
  neckTypes: string[];
  sleeveTypes: string[];
  backDesigns: string[];
  cutStyles: string[];
  workTypes: string[];
  occasions: string[];
  priceRange: [number, number];
  deliveryDays: number | null;
  // Half Saree specific
  dupattaStyles: string[];
  skirtTypes: string[];
  blousePatterns: string[];
}

interface DesignFiltersProps {
  filters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  onClearAll: () => void;
  categoryId?: string; // Current category for showing relevant filters
}

const defaultFilters: ActiveFilters = {
  neckTypes: [],
  sleeveTypes: [],
  backDesigns: [],
  cutStyles: [],
  workTypes: [],
  occasions: [],
  priceRange: [0, 10000],
  deliveryDays: null,
  dupattaStyles: [],
  skirtTypes: [],
  blousePatterns: [],
};

// Define which filters apply to which categories
const categoryFilterConfig: Record<string, string[]> = {
  blouse: ["neckTypes", "sleeveTypes", "backDesigns", "cutStyles", "workTypes", "occasions"],
  kurti: ["neckTypes", "sleeveTypes", "cutStyles", "workTypes", "occasions"],
  lehenga: ["workTypes", "occasions", "cutStyles"],
  halfsaree: ["dupattaStyles", "skirtTypes", "blousePatterns", "workTypes", "occasions"],
  saree: ["workTypes", "occasions"],
  frock: ["neckTypes", "sleeveTypes", "cutStyles", "occasions"],
  suits: ["neckTypes", "sleeveTypes", "workTypes", "occasions"],
  default: ["workTypes", "occasions"],
};

// Human-readable filter section names
const filterSectionNames: Record<string, string> = {
  neckTypes: "Neck Type",
  sleeveTypes: "Sleeve Type",
  backDesigns: "Back Design",
  cutStyles: "Cut Style",
  workTypes: "Work Type",
  occasions: "Occasion",
  dupattaStyles: "Dupatta Style",
  skirtTypes: "Skirt Type",
  blousePatterns: "Blouse Pattern",
};

export function DesignFilters({ filters, onFilterChange, onClearAll, categoryId }: DesignFiltersProps) {
  // Determine which filter sections to show based on category
  const visibleFilters = useMemo(() => {
    const config = categoryId 
      ? categoryFilterConfig[categoryId] || categoryFilterConfig.default
      : Object.keys(filterSectionNames); // Show all for general browse
    return config;
  }, [categoryId]);

  const [openSections, setOpenSections] = useState<string[]>(visibleFilters.slice(0, 2));

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleCheckboxChange = (
    category: keyof Omit<ActiveFilters, "priceRange" | "deliveryDays">,
    value: string
  ) => {
    const currentValues = filters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onFilterChange({ ...filters, [category]: newValues });
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleDeliveryChange = (days: number | null) => {
    onFilterChange({ ...filters, deliveryDays: days === filters.deliveryDays ? null : days });
  };

  const totalActiveFilters =
    filters.neckTypes.length +
    filters.sleeveTypes.length +
    filters.backDesigns.length +
    filters.cutStyles.length +
    filters.workTypes.length +
    filters.occasions.length +
    filters.dupattaStyles.length +
    filters.skirtTypes.length +
    filters.blousePatterns.length +
    (filters.deliveryDays ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0);

  // Get all active filter values for chip display
  const allActiveFilterValues = [
    ...filters.neckTypes,
    ...filters.sleeveTypes,
    ...filters.backDesigns,
    ...filters.cutStyles,
    ...filters.workTypes,
    ...filters.occasions,
    ...filters.dupattaStyles,
    ...filters.skirtTypes,
    ...filters.blousePatterns,
  ];

  const FilterSection = ({
    title,
    sectionKey,
    options,
    filterKey,
  }: {
    title: string;
    sectionKey: string;
    options: string[];
    filterKey: keyof Omit<ActiveFilters, "priceRange" | "deliveryDays">;
  }) => (
    <Collapsible open={openSections.includes(sectionKey)} onOpenChange={() => toggleSection(sectionKey)}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-medium border-b border-border hover:text-primary transition-colors">
        <span className="flex items-center gap-2">
          {title}
          {(filters[filterKey] as string[]).length > 0 && (
            <Badge className="h-5 px-1.5 text-[10px] bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
              {(filters[filterKey] as string[]).length}
            </Badge>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes(sectionKey) ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="py-3 space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={(filters[filterKey] as string[]).includes(option)}
              onCheckedChange={() => handleCheckboxChange(filterKey, option)}
              className="border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {option}
            </span>
          </label>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );

  // Map filter keys to their options
  const filterOptionsMap: Record<string, string[]> = {
    neckTypes: filterOptions.neckTypes,
    sleeveTypes: filterOptions.sleeveTypes,
    backDesigns: filterOptions.backDesigns,
    cutStyles: filterOptions.fitTypes || [],
    workTypes: filterOptions.workTypes,
    occasions: filterOptions.occasions,
    dupattaStyles: filterOptions.skirtTypes || [],
    skirtTypes: filterOptions.skirtTypes,
    blousePatterns: filterOptions.neckTypes || [],
  };

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {totalActiveFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="h-7 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50">
            Clear All ({totalActiveFilters})
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {totalActiveFilters > 0 && (
        <div className="flex flex-wrap gap-1 py-3 border-b border-border">
          {allActiveFilterValues.map((filter) => (
            <Badge key={filter} variant="outline" className="gap-1 text-xs cursor-pointer hover:bg-orange-50 border-orange-200 text-orange-700" onClick={() => {
              // Find which category this filter belongs to and remove it
              const categories: (keyof Omit<ActiveFilters, "priceRange" | "deliveryDays">)[] = [
                "neckTypes", "sleeveTypes", "backDesigns", "cutStyles", "workTypes", "occasions",
                "dupattaStyles", "skirtTypes", "blousePatterns"
              ];
              for (const cat of categories) {
                if ((filters[cat] as string[]).includes(filter)) {
                  handleCheckboxChange(cat, filter);
                  break;
                }
              }
            }}>
              {filter}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Dynamic Filter Sections based on category */}
      {visibleFilters.map((filterKey) => (
        <FilterSection
          key={filterKey}
          title={filterSectionNames[filterKey]}
          sectionKey={filterKey}
          options={filterOptionsMap[filterKey] || []}
          filterKey={filterKey as keyof Omit<ActiveFilters, "priceRange" | "deliveryDays">}
        />
      ))}

      {/* Price Range */}
      <Collapsible open={openSections.includes("price")} onOpenChange={() => toggleSection("price")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-medium border-b border-border hover:text-primary transition-colors">
          <span>Price Range</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes("price") ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="py-4">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            min={0}
            max={10000}
            step={100}
            className="mb-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹{filters.priceRange[0].toLocaleString()}</span>
            <span>₹{filters.priceRange[1].toLocaleString()}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Delivery Time */}
      <Collapsible open={openSections.includes("delivery")} onOpenChange={() => toggleSection("delivery")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-medium border-b border-border hover:text-primary transition-colors">
          <span>Delivery Time</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes("delivery") ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="py-3 space-y-2">
          {[3, 5, 7, 10].map((days) => (
            <label key={days} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={filters.deliveryDays === days}
                onCheckedChange={() => handleDeliveryChange(days)}
                className="border-orange-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Within {days} days
              </span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export { defaultFilters };
