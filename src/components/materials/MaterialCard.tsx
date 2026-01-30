import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, Check, IndianRupee, Info } from "lucide-react";
import { Material } from "@/data/materialData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function MaterialCard({ id, name, type, price, image, brand, rating, inStock, color, pattern }: Material) {
    const [wishlisted, setWishlisted] = useState(false);
    const [justAddedToCart, setJustAddedToCart] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setJustAddedToCart(true);
        toast.success("Added to cart!", {
            description: `${name} - ₹${price}/m`,
        });
        setTimeout(() => setJustAddedToCart(false), 2000);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlisted(!wishlisted);
        toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
    };

    return (
        <motion.div
            className="group block bg-card rounded-xl overflow-hidden border border-border/30 hover:border-border/60 transition-all duration-300"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <Link to={`/material/${id}`} className="block w-full h-full">
                    {/* Note: In a real app, this would link to detail page e.g. /material/${id} */}
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {!inStock && (
                        <Badge variant="destructive" className="uppercase text-[10px] tracking-wider font-semibold">
                            Out of Stock
                        </Badge>
                    )}
                    {inStock && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] px-2 py-0.5 font-semibold border-0">
                            {type}
                        </Badge>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${wishlisted
                        ? "bg-rose-500 text-white"
                        : "bg-white/90 text-foreground hover:bg-white"
                        }`}
                >
                    <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
                </button>

                {/* Brand Badge */}
                <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-xs font-medium shadow-sm">
                        {brand}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                        {color}
                    </span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-[10px] text-muted-foreground">{pattern}</span>
                </div>

                <h3 className="font-medium text-sm text-foreground line-clamp-1 mb-1" title={name}>
                    {name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span className="text-xs font-medium text-foreground">{rating}</span>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-baseline gap-0.5">
                        <IndianRupee className="w-3 h-3 text-foreground" />
                        <span className="text-base font-bold text-foreground">{price}</span>
                        <span className="text-xs text-muted-foreground">/m</span>
                    </div>

                    <div className="flex gap-1.5">
                        <Button
                            variant="default"
                            size="sm"
                            className="h-8 px-3 text-xs"
                            asChild
                        >
                            <Link to={`/materials`}>Book</Link>
                        </Button>
                        <Button
                            variant={justAddedToCart ? "default" : "outline"}
                            size="sm"
                            className={`h-8 w-8 p-0 ${justAddedToCart
                                ? "bg-green-600 hover:bg-green-700 border-green-600"
                                : ""
                                }`}
                            onClick={handleAddToCart}
                        >
                            {justAddedToCart ? (
                                <Check className="w-3.5 h-3.5" />
                            ) : (
                                <ShoppingCart className="w-3.5 h-3.5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
