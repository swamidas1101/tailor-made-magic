import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterChipSelectorProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    className?: string;
}

export function FilterChipSelector({ options, selected, onChange, className }: FilterChipSelectorProps) {
    const toggleOption = (option: string) => {
        const isSelected = selected.includes(option);
        if (isSelected) {
            onChange(selected.filter((item) => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div className={cn("flex flex-wrap gap-1.5 sm:gap-2", className)}>
            {options.map((option) => {
                const isSelected = selected.includes(option);

                return (
                    <motion.button
                        key={option}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => toggleOption(option)}
                        className={cn(
                            "relative flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium tracking-wide transition-all duration-300 border",
                            isSelected
                                ? "bg-amber-50 border-amber-600 text-amber-700 shadow-sm shadow-amber-900/5"
                                : "bg-white border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600 hover:shadow-sm"
                        )}
                    >
                        <AnimatePresence initial={false}>
                            {isSelected && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0, scale: 0 }}
                                    animate={{ width: "auto", opacity: 1, scale: 1 }}
                                    exit={{ width: 0, opacity: 0, scale: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    <Check className="w-3 h-3 sm:w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <span>{option}</span>
                    </motion.button>
                );
            })}
        </div>
    );
}
