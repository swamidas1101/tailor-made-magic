import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, IndianRupee, Heart, ShoppingCart, Check, Plus, Sparkles } from "lucide-react";
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
  const { addToCart, items: cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(id);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    <motion.div
      className="group block bg-card rounded-2xl overflow-hidden shadow-soft border border-border/50 hover:shadow-luxury transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image Container */}
      <Link to={`/design/${id}`} className="block relative aspect-[3/4] overflow-hidden">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Shine effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        
        {/* Popular Badge */}
        {isPopular && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-rose to-gold text-white shadow-glow text-[10px] px-3 py-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Trending
          </Badge>
        )}

        {/* Wishlist Button */}
        <motion.button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${
            wishlisted 
              ? "bg-rose text-white shadow-rose" 
              : "bg-white/90 text-foreground hover:bg-white hover:shadow-card"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
        </motion.button>
        
        {/* Quick Info Overlay */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-soft">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">{timeInDays} days</span>
            </div>
            {workType && (
              <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium shadow-soft">
                {workType}
              </div>
            )}
          </div>
        </motion.div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/design/${id}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-rose font-semibold uppercase tracking-wider bg-rose/10 px-2 py-0.5 rounded-full">
              {category}
            </span>
            {neckType && (
              <span className="text-[10px] text-muted-foreground">{neckType}</span>
            )}
          </div>
          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "fill-gold text-gold" : "fill-muted text-muted"}`} 
              />
            ))}
          </div>
          <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>
          <span className="text-[10px] text-muted-foreground">({reviewCount})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-1 mt-3 pt-3 border-t border-border">
          <IndianRupee className="w-4 h-4 text-primary" />
          <span className="text-xl font-bold text-primary font-display">{price.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground ml-1">onwards</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button 
            variant="rose" 
            size="sm" 
            className="flex-1 h-10"
            asChild
          >
            <Link to={`/design/${id}`}>Book Now</Link>
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant={justAddedToCart || cartItemCount > 0 ? "default" : "outline"}
              size="sm" 
              className={`h-10 min-w-10 p-0 transition-all duration-300 ${
                justAddedToCart 
                  ? "bg-green-500 hover:bg-green-600 border-green-500" 
                  : cartItemCount > 0
                    ? "bg-primary hover:bg-primary/90 border-primary"
                    : ""
              }`}
              onClick={handleAddToCart}
            >
              {justAddedToCart ? (
                <Check className="w-4 h-4 text-white" />
              ) : cartItemCount > 0 ? (
                <div className="flex items-center gap-0.5 px-2">
                  <ShoppingCart className="w-3.5 h-3.5 text-primary-foreground" />
                  <span className="text-xs font-bold text-primary-foreground">{cartItemCount}</span>
                  <Plus className="w-3 h-3 text-primary-foreground" />
                </div>
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
