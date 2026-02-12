import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  designCount: number;
  firstDesignImage?: string;
}

export function CategoryCard({ id, name, description, image, designCount, firstDesignImage }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${id}`}
      className="group block bg-card rounded-2xl overflow-hidden border border-border/40 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      {/* Image - compact square */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={firstDesignImage || image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Design count chip */}
        {designCount > 0 && (
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border border-border/50">
            {designCount}+ designs
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="p-2.5 md:p-3">
        <h3 className="font-semibold text-sm text-foreground line-clamp-1 mb-0.5">{name}</h3>
        <p className="text-muted-foreground text-[11px] line-clamp-2 leading-relaxed mb-1.5">{description}</p>
        <div className="flex items-center gap-1 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Explore</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
