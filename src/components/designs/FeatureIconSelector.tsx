import {
    Diamond,
    Scissors,
    Ruler,
    Zap,
    Award,
    Sparkles,
    Palette,
    Cloud,
    ShieldCheck,
    Layers,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const FEATURE_ICONS = [
    { id: "premium-fabric", name: "Premium Fabric", icon: Diamond, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "hand-stitched", name: "Hand Stitched", icon: Scissors, color: "text-amber-600", bg: "bg-amber-50" },
    { id: "custom-fit", name: "Custom Fit", icon: Ruler, color: "text-purple-500", bg: "bg-purple-50" },
    { id: "express-delivery", name: "Express Delivery", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
    { id: "best-quality", name: "Best Quality", icon: Award, color: "text-gold", bg: "bg-amber-50" },
    { id: "trendy-design", name: "Trendy Design", icon: Sparkles, color: "text-pink-500", bg: "bg-pink-50" },
    { id: "hand-embroidery", name: "Hand Embroidery", icon: Palette, color: "text-indigo-500", bg: "bg-indigo-50" },
    { id: "pure-silk", name: "Pure Silk", icon: Cloud, color: "text-sky-400", bg: "bg-sky-50" },
    { id: "reinforced-seams", name: "Reinforced Seams", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: "perfect-lining", name: "Perfect Lining", icon: Layers, color: "text-rose-500", bg: "bg-rose-50" },
];

interface FeatureIconSelectorProps {
    selected: string[];
    onChange: (features: string[]) => void;
    className?: string;
}

export function FeatureIconSelector({ selected, onChange, className }: FeatureIconSelectorProps) {
    const toggleFeature = (id: string) => {
        if (selected.includes(id)) {
            onChange(selected.filter(item => item !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    return (
        <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3", className)}>
            {FEATURE_ICONS.map((feature) => {
                const Icon = feature.icon;
                const isSelected = selected.includes(feature.name); // Using name for compatibility with existing string arrays

                return (
                    <motion.button
                        key={feature.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                            e.preventDefault();
                            // Backwards compatibility: storing the name in the features array to match existing schema
                            if (selected.includes(feature.name)) {
                                onChange(selected.filter(item => item !== feature.name));
                            } else {
                                onChange([...selected, feature.name]);
                            }
                        }}
                        className={cn(
                            "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 group text-center",
                            isSelected
                                ? "border-amber-500 bg-amber-50/30"
                                : "border-gray-100 bg-white hover:border-amber-200 hover:bg-gray-50"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-110",
                            isSelected ? feature.bg : "bg-gray-50"
                        )}>
                            <Icon className={cn("w-5 h-5", isSelected ? feature.color : "text-gray-400")} />
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            isSelected ? "text-gray-900" : "text-gray-500"
                        )}>
                            {feature.name}
                        </span>

                        {isSelected && (
                            <div className="absolute top-1 right-1">
                                <div className="bg-amber-500 rounded-full p-0.5">
                                    <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                            </div>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}

// Compact version for display page
export function FeatureIconDisplay({ features, className }: { features: string[], className?: string }) {
    if (!features || features.length === 0) return null;

    return (
        <div className={cn("flex flex-wrap gap-2 sm:gap-4", className)}>
            {features.map((featureName, idx) => {
                const feature = FEATURE_ICONS.find(f => f.name === featureName);
                if (!feature) return (
                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                        <span className="text-xs font-medium text-gray-600">{featureName}</span>
                    </div>
                );

                const Icon = feature.icon;
                return (
                    <div
                        key={feature.id}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className={cn("p-1 sm:p-1.5 rounded-lg", feature.bg)}>
                            <Icon className={cn("w-3.5 h-3.5 sm:w-4 h-4", feature.color)} />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 whitespace-nowrap">
                            {feature.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
