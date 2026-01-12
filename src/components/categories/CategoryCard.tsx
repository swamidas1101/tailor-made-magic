import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  designCount: number;
}

export function CategoryCard({ id, name, description, image, designCount }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${id}`}
      className="group relative block rounded-xl overflow-hidden aspect-[4/3] hover-lift"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
      
      {/* Decorative border */}
      <div className="absolute inset-3 border border-background/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <p className="text-gold text-xs font-medium mb-0.5">{designCount}+ Designs</p>
        <h3 className="font-display text-lg font-bold text-background mb-1">{name}</h3>
        <p className="text-background/70 text-xs line-clamp-1 mb-2">{description}</p>
        
        <div className="flex items-center gap-2 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          <span>Explore Designs</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
