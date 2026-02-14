import { Link } from "react-router-dom";
import { ShoppingBag, X, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WishlistCardProps {
    item: {
        id: string;
        name: string;
        image: string;
        price: number;
        category: string;
        tailorId?: string;
        shopName?: string;
    };
    onMoveToCart: (item: any) => void;
    onRemove: (id: string) => void;
}

export function WishlistCard({ item, onMoveToCart, onRemove }: WishlistCardProps) {
    const isMaterial = item.id.startsWith('m');
    const detailsUrl = isMaterial ? `/material/${item.id}` : `/design/${item.id}`;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="group bg-card rounded-xl overflow-hidden border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Link to={detailsUrl} className="block w-full h-full">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                </Link>

                {/* Persistent but subtle delete icon */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(item.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-white transition-all z-10"
                    title="Remove from wishlist"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Minimal Category Badge */}
                <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[10px] font-medium uppercase tracking-wider border border-border/30 text-foreground/80">
                        {item.category}
                    </span>
                </div>
            </div>

            <div className="p-3 md:p-4 space-y-3">
                <div className="space-y-0.5">
                    <Link to={detailsUrl} className="hover:text-primary transition-colors block">
                        <h3 className="font-body font-semibold text-sm md:text-base line-clamp-1 truncate tracking-tight text-foreground/90">
                            {item.name}
                        </h3>
                    </Link>
                    <div className="flex items-center text-foreground font-bold">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                        <span className="text-base md:text-lg tabular-nums tracking-tight">
                            {item.price.toLocaleString()}
                        </span>
                    </div>
                </div>

                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMoveToCart(item);
                    }}
                    className="w-full rounded-lg h-9 md:h-10 font-bold text-xs md:text-sm bg-primary hover:bg-primary/90 text-white shadow-sm active:scale-95 transition-transform"
                >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Cart
                </Button>
            </div>
        </motion.div>
    );
}
