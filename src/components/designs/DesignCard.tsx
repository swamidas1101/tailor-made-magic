import { Link } from "react-router-dom";
import { Star, Clock, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Link
      to={`/design/${id}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-soft hover-lift"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
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
        
        {/* Quick info overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 bg-background/90 rounded-full px-2 py-1 text-xs font-medium">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span>{timeInDays} days</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-accent font-medium uppercase tracking-wide mb-1">
          {category}
        </p>
        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h3>
        
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
      </div>
    </Link>
  );
}
