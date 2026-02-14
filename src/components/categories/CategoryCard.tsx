import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  designCount: number;
  firstDesignImage?: string;
}

export function CategoryCard({ id, name, description, image, designCount, firstDesignImage }: CategoryCardProps) {
  const [hasError, setHasError] = useState(false);
  const imgSrc = firstDesignImage || image || '/placeholder.svg';

  return (
    <Link
      to={`/category/${id}`}
      className="group block relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="absolute inset-0 w-full h-full bg-gray-200">
        <img
          key={imgSrc}
          src={imgSrc}
          alt={name}
          onError={(e) => {
            if (!hasError) {
              setHasError(true);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }
          }}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        {/* Status Badges */}
        <div className="mb-2">
          {designCount === 0 ? (
            <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Coming Soon
            </span>
          ) : (
            <span className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
              {designCount} Designs
            </span>
          )}
        </div>

        <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{name}</h3>
        <p className="text-white/70 text-xs line-clamp-2 mb-2">{description}</p>

        <div className="flex items-center gap-1 text-orange-400 text-xs font-semibold opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span>Explore</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
