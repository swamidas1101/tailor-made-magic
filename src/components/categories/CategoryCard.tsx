import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  designCount: number;
}

export function CategoryCard({ id, name, description, image, designCount }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/category/${id}`}
      className="group relative block rounded-2xl overflow-hidden aspect-[4/3]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Zoom */}
      <motion.div 
        className="absolute inset-0"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/50 to-transparent" />
      
      {/* Animated Shine Effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      
      {/* Decorative Border */}
      <motion.div 
        className="absolute inset-3 border border-white/30 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Floating Sparkle */}
      <motion.div
        className="absolute top-4 right-4"
        animate={{ 
          rotate: isHovered ? 180 : 0,
          scale: isHovered ? 1.2 : 1
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose/80 to-gold/80 backdrop-blur-sm flex items-center justify-center shadow-glow">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        {/* Design Count Badge */}
        <motion.div 
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose/90 to-gold/90 backdrop-blur-sm rounded-full px-3 py-1 mb-3 w-fit shadow-rose"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">{designCount}+ Designs</span>
        </motion.div>
        
        {/* Title */}
        <h3 className="font-display text-2xl font-bold text-white mb-1 drop-shadow-lg">{name}</h3>
        
        {/* Description */}
        <p className="text-white/80 text-sm line-clamp-1 mb-3">{description}</p>
        
        {/* CTA */}
        <motion.div 
          className="flex items-center gap-2 text-rose-light text-sm font-semibold"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          transition={{ duration: 0.3 }}
        >
          <span>Explore Collection</span>
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </Link>
  );
}
