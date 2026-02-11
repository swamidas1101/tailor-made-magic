import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesignCard } from "@/components/designs/DesignCard";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { Material } from "@/data/materialData";
import { Design } from "@/types/database";

interface SimilarProductsProps {
    items: (Material | Design)[];
    type: "material" | "design";
    title?: string;
}

export function SimilarProducts({ items, type, title = "You May Also Like" }: SimilarProductsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === "left" ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="py-8 border-t border-border">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">{title}</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-2 md:gap-3 overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {items.map((item) => (
                    <div key={item.id} className="w-[calc(50%-12px)] min-w-[140px] sm:w-[calc(33.33%-12px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-12px)] xl:w-[calc(14.28%-12px)] flex-shrink-0 snap-center">
                        {type === "material" ? (
                            <MaterialCard {...(item as Material)} />
                        ) : (
                            <DesignCard
                                {...(item as any)}
                                category={(item as any).categoryName || (item as any).category || "Premium"}
                                variant="compact"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
