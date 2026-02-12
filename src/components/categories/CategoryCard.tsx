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
      className="group block relative h-48 md:h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Background Image */}
      <img
        src={firstDesignImage || image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        {/* Coming Soon Badge (Mock logic, can be real prop) */}
        {designCount === 0 && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
            Coming Soon
          </div>
        )}

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
