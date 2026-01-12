import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, IndianRupee, Heart, ShoppingCart, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

export interface DesignCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  priceWithMaterial: number;
  rating: number;
  reviewCount: number;
  timeInDays: number;
  isPopular?: boolean;
  neckType?: string;
  workType?: string;
}

export function DesignCard({
  id,
  name,
  category,
  image,
  price,
  rating,
  reviewCount,
  timeInDays,
  isPopular,
  neckType,
  workType,
}: DesignCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(id);
  const [justAddedToCart, setJustAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      designId: id,
      name,
      image,
      price,
      withMaterial: false,
      size: "M",
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
      toast.success("Added to wishlist!");
    }
  };

  return (
    <div className="group block bg-card rounded-lg overflow-hidden shadow-soft hover-lift">
      {/* Image - More compact */}
      <Link to={`/design/${id}`} className="block relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {isPopular && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground shadow-gold text-[10px] px-2 py-0.5">
            Popular
          </Badge>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            wishlisted 
              ? "bg-destructive text-destructive-foreground" 
              : "bg-background/80 text-foreground hover:bg-background"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-current" : ""}`} />
        </button>
        
        {/* Quick info overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 bg-background/90 rounded-full px-2 py-0.5 text-[10px] font-medium">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span>{timeInDays}d</span>
          </div>
          {workType && (
            <div className="bg-background/90 rounded-full px-2 py-0.5 text-[10px] font-medium">
              {workType}
            </div>
          )}
        </div>
      </Link>

      {/* Content - Compact */}
      <div className="p-3">
        <Link to={`/design/${id}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-[10px] text-accent font-medium uppercase tracking-wide">
              {category}
            </p>
            {neckType && (
              <>
                <span className="text-muted-foreground">•</span>
                <p className="text-[10px] text-muted-foreground">{neckType}</p>
              </>
            )}
          </div>
          <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3 h-3 fill-accent text-accent" />
          <span className="text-xs font-medium">{rating.toFixed(1)}</span>
          <span className="text-[10px] text-muted-foreground">({reviewCount})</span>
        </div>
        
        <div className="flex items-baseline gap-0.5 mt-2 pt-2 border-t border-border">
          <IndianRupee className="w-3 h-3 text-primary" />
          <span className="text-base font-bold text-primary">{price.toLocaleString()}</span>
          <span className="text-[10px] text-muted-foreground ml-0.5">onwards</span>
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex gap-1.5 mt-3">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 h-8 text-xs"
            asChild
          >
            <Link to={`/design/${id}`}>Book Now</Link>
          </Button>
          <Button 
            variant={justAddedToCart ? "default" : "outline"}
            size="sm" 
            className={`h-8 w-8 p-0 transition-all duration-300 ${
              justAddedToCart 
                ? "bg-green-500 hover:bg-green-600 border-green-500 scale-110" 
                : ""
            }`}
            onClick={handleAddToCart}
          >
            {justAddedToCart ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
