import { Eye, Trash2, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TailorDesignCardProps {
    design: any;
    onView: (design: any) => void;
    onEdit: (design: any) => void;
    onDelete: (designId: string) => void;
}

export function TailorDesignCard({
    design,
    onView,
    onEdit,
    onDelete
}: TailorDesignCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // Ensure all unique images are included, starting with the main image
    const images = (() => {
        const imgs = design.images && design.images.length > 0 ? [...design.images] : [];
        if (design.image && !imgs.includes(design.image)) {
            imgs.unshift(design.image);
        }
        return imgs.length > 0 ? imgs : (design.image ? [design.image] : []);
    })();

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Image Container */}
            <div
                className="aspect-[3/4] relative bg-gray-100 overflow-hidden cursor-pointer"
                onClick={() => onView(design)}
            >
                <img
                    src={images[currentImageIndex]}
                    alt={design.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {/* Carousel Navigation */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        {/* Dots */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {images.map((_: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full shadow-sm transition-colors",
                                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                                    )}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Status Badge - Top Right */}
                <div className="absolute top-2 right-2 z-10">
                    <div className={cn(
                        "text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md",
                        design.status === 'approved' ? "bg-emerald-500 text-white" :
                            design.status === 'pending' ? "bg-amber-500 text-white" :
                                "bg-gray-500 text-white"
                    )}>
                        {design.status || 'DRAFT'}
                    </div>
                </div>

                {/* Time Badge - Bottom Left */}
                <div className="absolute bottom-2 left-2 z-10">
                    <div className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{design.timeInDays || 7}d</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                {/* Title */}
                <h3
                    className="font-bold text-gray-900 text-sm mb-0.5 line-clamp-1 cursor-pointer hover:text-amber-600 transition-colors"
                    onClick={() => onView(design)}
                >
                    {design.name}
                </h3>

                {/* Category */}
                <p className="text-xs text-gray-400 font-medium mb-3 truncate">
                    {design.categoryName || design.category || 'Uncategorized'}
                </p>

                {/* Footer: Price Left, Actions Right */}
                <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-600 text-sm">₹{design.price?.toLocaleString()}</span>

                    <div className="flex items-center gap-3">
                        <button
                            className="text-gray-400 hover:text-gray-900 transition-colors focus:outline-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(design);
                            }}
                            title="View Details"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(design.id);
                            }}
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
