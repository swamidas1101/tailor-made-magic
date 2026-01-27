import { useState } from "react";
import { Link } from "react-router-dom";
import { Shirt, ArrowRight, Check, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface MenService {
  id: string;
  title: string;
  description: string;
  images: string[];
  priceFrom: number;
  features: string[];
}

const menServices: MenService[] = [
  {
    id: "shirts",
    title: "Formal Shirts",
    description: "Crisp, well-fitted formal shirts tailored to your exact measurements.",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
    ],
    priceFrom: 1200,
    features: ["Premium cotton", "Custom collar", "Monogramming"],
  },
  {
    id: "pants",
    title: "Trousers & Pants",
    description: "Perfectly fitted trousers for formal and casual occasions.",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
    ],
    priceFrom: 1500,
    features: ["Multiple fabrics", "Custom fit", "Pleated/flat"],
  },
  {
    id: "suits",
    title: "Full Suits",
    description: "Complete suit tailoring including jacket and trousers.",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    ],
    priceFrom: 8000,
    features: ["Premium wool", "Full custom", "Multiple fittings"],
  },
  {
    id: "kurta",
    title: "Kurta Pajama",
    description: "Traditional kurta sets for festivals and weddings.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop",
    ],
    priceFrom: 2000,
    features: ["Silk & cotton", "Embroidery", "Festival ready"],
  },
];

function MenServiceCard({ service }: { service: MenService }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = service.images;

  const handleSwipe = (e: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 50) {
      if (info.offset.x > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (info.offset.x < 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-soft border border-border">
      {/* Image Carousel */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={service.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleSwipe}
          />
        </AnimatePresence>

        {/* Navigation Arrows - Desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md items-center justify-center hidden group-hover:flex transition-opacity ${currentIndex === 0 ? 'opacity-50' : 'opacity-100'}`}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md items-center justify-center hidden group-hover:flex transition-opacity ${currentIndex === images.length - 1 ? 'opacity-50' : 'opacity-100'}`}
              disabled={currentIndex === images.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-display font-bold text-sm md:text-base mb-1 line-clamp-1">{service.title}</h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 hidden md:block">{service.description}</p>
        
        <ul className="space-y-0.5 mb-2 hidden md:block">
          {service.features.map((f, i) => (
            <li key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Check className="w-3 h-3 text-accent" /> {f}
            </li>
          ))}
        </ul>
        
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">From</p>
            <p className="text-sm md:text-base font-bold text-primary">₹{service.priceFrom.toLocaleString()}</p>
          </div>
          <Button variant="default" size="sm" className="text-xs h-7 md:h-8">Book Now</Button>
        </div>
      </div>
    </div>
  );
}

export default function MensTailoring() {
  return (
    <Layout>
      {/* Hero - Compact */}
      <section className="py-10 md:py-16 gradient-hero">
        <div className="container px-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-gold mb-2">
              <Shirt className="w-4 h-4" />
              <span className="text-sm font-medium">Men's Tailoring</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-display font-bold text-primary-foreground mb-3">
              Bespoke Tailoring<br />for the Modern Man
            </h1>
            <p className="text-primary-foreground/80 text-sm md:text-base mb-6">
              From sharp formal shirts to elegant suits, experience expert craftsmanship.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="default">
                Explore <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="heroOutline" size="default" asChild>
                <Link to="/measurements">Get Measured</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services - 2 columns mobile, 4 desktop */}
      <section className="py-10 md:py-16">
        <div className="container px-4">
          <div className="text-center mb-8">
            <p className="text-accent text-sm font-medium mb-1">Our Services</p>
            <h2 className="text-xl md:text-3xl font-display font-bold">Men's Collection</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {menServices.map((service) => (
              <MenServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Material Info - Compact */}
      <section className="py-10 md:py-16 bg-muted/50">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-accent text-sm font-medium mb-1">Fabric Options</p>
              <h2 className="text-xl md:text-2xl font-display font-bold mb-4">Bring Your Own Material</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Have a favorite fabric? Bring your own material or choose from our premium collection.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg shadow-soft">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Your Material</p>
                    <p className="text-xs text-muted-foreground">Pay only for tailoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg shadow-soft">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Our Premium Fabrics</p>
                    <p className="text-xs text-muted-foreground">Curated imported materials</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=300&fit=crop" alt="Fabric" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden mt-6">
                <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop" alt="Fabric" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
