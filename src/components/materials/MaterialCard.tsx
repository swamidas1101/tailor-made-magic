import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ShoppingCart, Check, IndianRupee, ChevronLeft, ChevronRight } from "lucide-react";
import { Material } from "@/data/materialData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

export function MaterialCard({ id, name, type, price, image, brand, rating, inStock, color, pattern }: Material) {
    const { addToCart, items: cartItems } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const wishlisted = isInWishlist(id);
    const [justAddedToCart, setJustAddedToCart] = useState(false);

    // Image handling - aligned with DesignCard even for single image to maintain structure
    const allImages = useMemo(() => [image], [image]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const hasMultipleImages = allImages.length > 1;

    // Touch handlers (simplified for single image but structure kept)
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentImageIndex < allImages.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        }
        if (isRightSwipe && currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };

    const cartItemCount = useMemo(() => {
        return cartItems.filter(item => item.designId === id).reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems, id]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!inStock) {
            toast.error("Item is out of stock");
            return;
        }
        addToCart({
            designId: id,
            name,
            image,
            price,
            withMaterial: true,
            size: "M", // Default for material? Or maybe just 1 meter unit logic implies size irrelevant
            tailorId: "platform_admin",
            shopName: "Tailo Premium",
            category: type,
        });
        setJustAddedToCart(true);
        toast.success("Added to cart!", {
            description: `${name} - ₹${price.toLocaleString()}/m`,
        });
    };

    useEffect(() => {
        if (justAddedToCart) {
            const timer = setTimeout(() => setJustAddedToCart(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [justAddedToCart]);

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishlisted) {
            removeFromWishlist(id);
            toast.info("Removed from wishlist");
        } else {
            addToWishlist({ id, name, image, price, category: type });
            toast.success("Added to wishlist!");
        }
    };

    return (
        <motion.div
            className="group block bg-card rounded-xl overflow-hidden border border-border/30 hover:border-border/60 transition-all duration-300"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Image Container - Compact aspect ratio */}
            <div
                className="relative aspect-[4/5] overflow-hidden bg-muted"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <Link to={`/materials`} className="block w-full h-full">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={allImages[currentImageIndex]}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    </AnimatePresence>
                </Link>

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {!inStock ? (
                        <Badge variant="destructive" className="uppercase text-[10px] tracking-wider font-semibold">
                            Out of Stock
                        </Badge>
                    ) : (
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

                {/* Brand Badge (Bottom Left) */}
                <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-xs font-medium shadow-sm">
                        {brand}
                    </Badge>
                </div>
            </div>

            {/* Content - Compact */}
            <div className="p-2 sm:p-3">
                <Link to={`/materials`}>
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide truncate">
                            {color}
                        </span>
                        <span className="text-muted-foreground/40">•</span>
                        <span className="text-[10px] text-muted-foreground truncate">{pattern}</span>
                    </div>

                    <h3 className="font-medium text-sm text-foreground line-clamp-1 mb-1" title={name}>
                        {name}
                    </h3>
                </Link>

                {/* Rating - Compact */}
                <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span className="text-xs font-medium text-foreground">{rating}</span>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50 gap-1">
                    <div className="flex items-baseline gap-0.5 min-w-0">
                        <IndianRupee className="w-3 h-3 text-foreground" />
                        <span className="text-sm sm:text-base font-bold text-foreground truncate">{price.toLocaleString()}</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">/m</span>
                    </div>

                    <div className="flex gap-1.5 flex-shrink-0">
                        <Button
                            variant="default"
                            size="sm"
                            className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs"
                            disabled={!inStock}
                            asChild
                        >
                            <Link to={`/materials`}>Book</Link>
                        </Button>
                        <Button
                            variant={justAddedToCart || cartItemCount > 0 ? "default" : "outline"}
                            size="sm"
                            className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${justAddedToCart
                                ? "bg-green-600 hover:bg-green-700 border-green-600"
                                : ""
                                }`}
                            onClick={handleAddToCart}
                            disabled={!inStock}
                        >
                            <div className="relative">
                                {justAddedToCart ? (
                                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                ) : (
                                    <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                )}
                                {cartItemCount > 0 && !justAddedToCart && (
                                    <span className="absolute -top-2 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-orange-600 shadow-sm border border-orange-100">
                                        {cartItemCount}
                                    </span>
                                )}
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
