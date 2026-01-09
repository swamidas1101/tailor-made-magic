import { Link } from "react-router-dom";
import { Star, Clock, IndianRupee, Heart, ShoppingCart } from "lucide-react";
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
}: DesignCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      designId: id,
      name,
      image,
      price,
      withMaterial: false,
      size: "M", // Default size
    });
    toast.success("Added to cart!", {
      description: `${name} - ₹${price.toLocaleString()}`,
    });
  };

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
    <div className="group block bg-card rounded-xl overflow-hidden shadow-soft hover-lift">
      {/* Image */}
      <Link to={`/design/${id}`} className="block relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {isPopular && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground shadow-gold">
            Popular
          </Badge>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            wishlisted 
              ? "bg-destructive text-destructive-foreground" 
              : "bg-background/80 text-foreground hover:bg-background"
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>
        
        {/* Quick info overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 bg-background/90 rounded-full px-2 py-1 text-xs font-medium">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span>{timeInDays} days</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/design/${id}`}>
          <p className="text-xs text-accent font-medium uppercase tracking-wide mb-1">
            {category}
          </p>
          <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>
        
        <div className="flex items-baseline gap-1 mt-3 pt-3 border-t border-border">
          <IndianRupee className="w-4 h-4 text-primary" />
          <span className="text-lg font-bold text-primary">{price.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">onwards</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link to={`/design/${id}`}>Book Now</Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="px-3"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
