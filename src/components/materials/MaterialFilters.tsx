import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { brands } from "@/data/materialData";

export interface MaterialFiltersState {
    types: string[];
    patterns: string[];
    colors: string[];
    brands: string[];
    gender: string[];
    priceRange: [number, number];
}

export const defaultMaterialFilters: MaterialFiltersState = {
    types: [],
    patterns: [],
    colors: [],
    brands: [],
    gender: [],
    priceRange: [0, 10000],
};

const filterColors = [
    { name: "Red", class: "bg-red-500" },
    { name: "Blue", class: "bg-blue-500" },
    { name: "Green", class: "bg-green-500" },
    { name: "Yellow", class: "bg-yellow-500" },
    { name: "Black", class: "bg-black" },
    { name: "White", class: "bg-white border md:border-gray-200" },
    { name: "Purple", class: "bg-purple-500" },
    { name: "Orange", class: "bg-orange-500" },
    { name: "Brown", class: "bg-amber-800" },
    { name: "Gold", class: "bg-yellow-600" },
];

interface MaterialFiltersProps {
    filters: MaterialFiltersState;
    onFilterChange: (filters: MaterialFiltersState) => void;
    onClearAll: () => void;
}

export function MaterialFilters({ filters, onFilterChange, onClearAll }: MaterialFiltersProps) {
    const handleCheckboxChange = (category: keyof MaterialFiltersState, value: string) => {
        const current = filters[category] as string[];
        const updated = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];

        onFilterChange({ ...filters, [category]: updated });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-lg">Filters</h3>
                <Button variant="ghost" size="sm" onClick={onClearAll} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
                    Clear All
                </Button>
            </div>

            {/* Gender */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium">Category</h4>
                <div className="space-y-2">
                    {["Men", "Women", "Unisex"].map((g) => (
                        <div key={g} className="flex items-center space-x-2">
                            <Checkbox
                                id={`gender-${g}`}
                                checked={filters.gender.includes(g)}
                                onCheckedChange={() => handleCheckboxChange("gender", g)}
                            />
                            <Label htmlFor={`gender-${g}`} className="text-sm font-normal cursor-pointer">{g}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium">Brands</h4>
                <ScrollArea className="h-32 pr-2">
                    <div className="space-y-2">
                        {brands.map((brand) => (
                            <div key={brand} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`brand-${brand}`}
                                    checked={filters.brands.includes(brand)}
                                    onCheckedChange={() => handleCheckboxChange("brands", brand)}
                                />
                                <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">{brand}</Label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Fabric Type */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium">Fabric Type</h4>
                <div className="space-y-2">
                    {["Silk", "Cotton", "Linen", "Velvet", "Denim", "Wool"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                                id={`type-${type}`}
                                checked={filters.types.includes(type)}
                                onCheckedChange={() => handleCheckboxChange("types", type)}
                            />
                            <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">{type}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Colors (Visual) */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium">Color</h4>
                <div className="flex flex-wrap gap-2">
                    {filterColors.map((color) => (
                        <div
                            key={color.name}
                            onClick={() => handleCheckboxChange("colors", color.name)}
                            className={`w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center ${color.class} ${filters.colors.includes(color.name) ? "ring-2 ring-primary ring-offset-2" : ""}`}
                            title={color.name}
                        >
                            {filters.colors.includes(color.name) && <span className="text-[10px] text-white/80">✓</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pattern */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium">Pattern</h4>
                <div className="space-y-2">
                    {["Solid", "Striped", "Checkered", "Floral", "Printed"].map((pattern) => (
                        <div key={pattern} className="flex items-center space-x-2">
                            <Checkbox
                                id={`pattern-${pattern}`}
                                checked={filters.patterns.includes(pattern)}
                                onCheckedChange={() => handleCheckboxChange("patterns", pattern)}
                            />
                            <Label htmlFor={`pattern-${pattern}`} className="text-sm font-normal cursor-pointer">{pattern}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium">Price Range (₹)</h4>
                <Slider
                    defaultValue={[0, 10000]}
                    max={10000}
                    step={500}
                    value={filters.priceRange}
                    onValueChange={(value) => onFilterChange({ ...filters, priceRange: value as [number, number] })}
                    className="my-4"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                </div>
            </div>
        </div>
    );
}
