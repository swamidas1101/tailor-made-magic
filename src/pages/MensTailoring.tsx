import { Link } from "react-router-dom";
import { Shirt, ArrowRight, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const menServices = [
  {
    id: "shirts",
    title: "Formal Shirts",
    description: "Crisp, well-fitted formal shirts tailored to your exact measurements.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
    priceFrom: 1200,
    features: ["Premium cotton", "Custom collar styles", "Monogramming available"],
  },
  {
    id: "pants",
    title: "Trousers & Pants",
    description: "Perfectly fitted trousers for formal and casual occasions.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
    priceFrom: 1500,
    features: ["Multiple fabrics", "Custom fit", "Pleated or flat front"],
  },
  {
    id: "suits",
    title: "Full Suits",
    description: "Complete suit tailoring including jacket, trousers, and optional waistcoat.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop",
    priceFrom: 8000,
    features: ["Premium wool", "Full customization", "Multiple fittings"],
  },
  {
    id: "kurta",
    title: "Kurta Pajama",
    description: "Traditional kurta sets for festivals, weddings, and special occasions.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
    priceFrom: 2000,
    features: ["Silk & cotton options", "Embroidery available", "Festival ready"],
  },
];

export default function MensTailoring() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 gradient-hero">
        <div className="container px-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-gold mb-4">
              <Shirt className="w-5 h-5" />
              <span className="font-medium">Men's Tailoring</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Bespoke Tailoring<br />for the Modern Man
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-8">
              From sharp formal shirts to elegant suits, experience the art of menswear tailoring 
              with premium fabrics and expert craftsmanship.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl">
                Explore Collection <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/measurements">Get Measured</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="text-center mb-12">
            <p className="text-accent font-medium mb-2">Our Services</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Men's Collection</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menServices.map((service) => (
              <div key={service.id} className="group bg-card rounded-xl overflow-hidden shadow-soft hover-lift">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-1 mb-4">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-accent" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="text-lg font-bold text-primary">₹{service.priceFrom.toLocaleString()}</p>
                    </div>
                    <Button variant="default" size="sm">Book Now</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Material Info */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent font-medium mb-2">Fabric Options</p>
              <h2 className="text-3xl font-display font-bold mb-6">Bring Your Own Material</h2>
              <p className="text-muted-foreground mb-6">
                Have a favorite fabric? Bring your own material and we'll stitch it to perfection. 
                Or choose from our premium collection of cottons, linens, and wools.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-soft">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Your Material</p>
                    <p className="text-sm text-muted-foreground">Save on fabric costs - pay only for tailoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-soft">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Our Premium Fabrics</p>
                    <p className="text-sm text-muted-foreground">Curated collection of premium imported materials</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=300&fit=crop" alt="Fabric" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden mt-8">
                <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop" alt="Fabric" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
