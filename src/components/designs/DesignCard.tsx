import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, IndianRupee, Heart, Bookmark, ShoppingCart, ShoppingBag, Check, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { LikeButton } from "./LikeButton";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

export interface DesignCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  images?: string[];
  price: number;
  priceWithMaterial: number;
  rating: number;
  reviewCount: number;
  timeInDays: number;
  isPopular?: boolean;
  neckType?: string | string[];
  workType?: string | string[];
  variant?: "default" | "compact";
  tailorId?: string;
  shopName?: string;
  likesCount?: number;
}

export function DesignCard({
  id,
  name,
  category,
  image,
  images,
  price,
  rating,
  reviewCount,
  timeInDays,
  isPopular,
  neckType,
  workType,
  variant = "default",
  tailorId,
  shopName,
  likesCount: initialLikesCount = 0,
}: DesignCardProps) {
  const isCompact = variant === "compact";
  const { addToCart, items: cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(id);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Combine main image with additional images
  const allImages = useMemo(() => {
    const imageList = [image];
    if (images && images.length > 0) {
      imageList.push(...images);
    }
    return imageList;
  }, [image, images]);

  const hasMultipleImages = allImages.length > 1;

  const cartItemCount = useMemo(() => {
    return cartItems.filter(item => item.designId === id).reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems, id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      designId: id,
      name,
      image,
      price,
      withMaterial: false,
      size: "custom",
      orderType: "stitching",
      measurementType: null,
      tailorId: tailorId || "platform_admin",
      shopName: shopName || "Tailo Premium",
      category: category,
    });
    setJustAddedToCart(true);
    toast.success("Added to cart!", {
      description: `${name} - ₹${price.toLocaleString()}`,
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
      addToWishlist({ id, name, image, price, category });
      toast.success("Saved to wishlist!");
    }
  };

  // Touch handlers for mobile swipe
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

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < allImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
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
        <Link to={`/design/${id}`} className="block w-full h-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={allImages[currentImageIndex]}
              alt={name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>
        </Link>

        {/* Popular Badge - Vibrant */}
        {isPopular && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] px-2 py-0.5 font-semibold border-0">
            Trending
          </Badge>
        )}

        {/* Wishlist Button (Changed to Bookmark) */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${wishlisted
            ? "bg-amber-500 text-white"
            : "bg-white/90 text-foreground hover:bg-white"
            }`}
        >
          <Bookmark className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Image Navigation - Desktop arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 text-foreground hidden md:flex items-center justify-center transition-opacity ${currentImageIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-white"
                }`}
              disabled={currentImageIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 text-foreground hidden md:flex items-center justify-center transition-opacity ${currentImageIndex === allImages.length - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-white"
                }`}
              disabled={currentImageIndex === allImages.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Dots Indicator */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToImage(index, e)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentImageIndex
                  ? "bg-white w-3"
                  : "bg-white/50 hover:bg-white/70"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Delivery time badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 text-[10px] font-medium text-foreground">
          <Clock className="w-3 h-3" />
          {timeInDays}d
        </div>
      </div>

      {/* Content - Compact */}
      <div className={cn("p-2", !isCompact && "sm:p-3")}>
        <Link to={`/design/${id}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide truncate">
              {category}
            </span>
            {!isCompact && workType && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {Array.isArray(workType) ? workType.join(", ") : workType}
                </span>
              </>
            )}
          </div>
          <h3 className={cn("font-medium text-foreground line-clamp-1 mb-1", isCompact ? "text-xs" : "text-sm")}>
            {name}
          </h3>
        </Link>

        {/* Price & Rating (Stacked) */}
        <div className="mb-1.5 mt-1 flex flex-col gap-0.5">
          <div className="flex items-baseline gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-foreground" />
            <span className={cn("font-bold text-foreground truncate tracking-tight", isCompact ? "text-base" : "text-base")}>
              {price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-500">{rating.toFixed(1)}</span>
            <span className="text-[9px] text-muted-foreground ml-0.5">({reviewCount})</span>
          </div>
        </div>

        {/* Action Buttons Row (Justified) */}
        <div className="flex items-center justify-between pt-1.5 border-t border-border/50 gap-2">
          <LikeButton
            designId={id}
            initialLikesCount={initialLikesCount}
            size="sm"
          />

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="h-7 px-3 text-[10px] font-medium bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
              asChild
            >
              <Link to={`/design/${id}`}>Book</Link>
            </Button>

            <Button
              variant={justAddedToCart || cartItemCount > 0 ? "default" : "outline"}
              size="sm"
              className={cn("h-7 w-7 p-0 rounded-lg border-orange-200 relative overflow-visible", !isCompact && "sm:h-8 sm:w-8", justAddedToCart
                ? "bg-green-600 hover:bg-green-700 border-green-600 text-white"
                : cartItemCount > 0
                  ? "bg-orange-600 text-white hover:bg-orange-700 border-orange-600"
                  : "text-orange-600 hover:bg-orange-50"
              )}
              onClick={handleAddToCart}
            >
              <div className="flex items-center justify-center w-full h-full">
                {justAddedToCart ? (
                  <Check className="w-3.5 h-3.5" />
                ) : cartItemCount > 0 ? (
                  <ShoppingBag className="w-3.5 h-3.5" />
                ) : (
                  <ShoppingCart className="w-3.5 h-3.5" />
                )}
              </div>
              {cartItemCount > 0 && !justAddedToCart && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[8px] font-bold text-orange-600 shadow-sm border border-orange-100 ring-1 ring-orange-50 z-10">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}