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
      className="group relative block rounded-xl overflow-hidden aspect-[3/4] md:aspect-[4/3] shadow-md"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={firstDesignImage || image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end">
        {/* Design Count Badge */}
        <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-amber-500 rounded-full px-2 py-0.5 mb-2 w-fit">
          <span className="text-[10px] font-bold text-white">{designCount}+ Designs</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-base md:text-lg font-bold text-white mb-0.5 line-clamp-1">{name}</h3>

        {/* Description - hidden on mobile */}
        <p className="text-white/70 text-xs line-clamp-1 hidden md:block">{description}</p>

        {/* CTA on hover */}
        <div className="flex items-center gap-1 text-amber-300 text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Explore</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
