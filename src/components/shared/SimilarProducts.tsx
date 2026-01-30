import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesignCard } from "@/components/designs/DesignCard";
import { MaterialCard } from "@/components/materials/MaterialCard";
import { Material } from "@/data/materialData";
import { Design } from "@/data/mockData";

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
        <div className="py-12 border-t border-border">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold text-foreground">{title}</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-9 w-9"
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-9 w-9"
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 md:gap-5 overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory scrollbar-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {items.map((item) => (
                    <div key={item.id} className="min-w-[45%] md:min-w-[220px] lg:min-w-[200px] snap-center">
                        {type === "material" ? (
                            <MaterialCard {...(item as Material)} />
                        ) : (
                            <DesignCard {...(item as any)} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
