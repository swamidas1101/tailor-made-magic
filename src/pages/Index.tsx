import { Link } from "react-router-dom";
import { ArrowRight, Star, Clock, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { DesignCard } from "@/components/designs/DesignCard";
import { categories, designs, testimonials } from "@/data/mockData";
import heroImage from "@/assets/hero-tailoring.jpg";

const Index = () => {
  const featuredDesigns = designs.filter((d) => d.isPopular).slice(0, 4);
  const featuredCategories = categories.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section - Full Width */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0 w-full">
          <img src={heroImage} alt="Premium Tailoring" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-80" />
        </div>
        
        <div className="w-full relative z-10 px-4 md:px-8 lg:px-16 py-16">
          <div className="max-w-2xl stagger-children">
            <p className="text-gold font-medium mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Premium Online Tailoring
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Crafting Elegance,<br />
              <span className="text-gradient-gold">Stitch by Stitch</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg">
              Experience bespoke tailoring from the comfort of your home. Choose from 500+ designs, 
              get measured online, and receive perfectly fitted garments at your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/categories">Explore Designs <ArrowRight className="w-5 h-5 ml-1" /></Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/measurements">Take Measurements</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/50 pattern-fabric">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Star, title: "500+ Designs", desc: "Curated collection" },
              { icon: Clock, title: "3-7 Days", desc: "Quick delivery" },
              { icon: Shield, title: "Quality Assured", desc: "Expert tailors" },
              { icon: Sparkles, title: "AI Measurements", desc: "Coming soon" },
            ].map((f, i) => (
              <div key={i} className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-accent font-medium mb-2">Browse by Category</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold">Our Services</h2>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/categories">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredCategories.map((cat) => (
              <CategoryCard key={cat.id} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Designs */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-10">
            <p className="text-accent font-medium mb-2">Trending Now</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Popular Designs</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredDesigns.map((design) => (
              <DesignCard key={design.id} {...design} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="default" size="lg" asChild>
              <Link to="/categories">View All Designs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="text-center mb-10">
            <p className="text-accent font-medium mb-2">What Our Customers Say</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Happy Customers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-card p-6 rounded-xl shadow-soft hover-lift">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Book your first tailoring order today and get 10% off with code FIRST10
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/categories">Start Designing <ArrowRight className="w-5 h-5 ml-1" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
