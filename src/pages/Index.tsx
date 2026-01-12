import { Link } from "react-router-dom";
import { ArrowRight, Star, Clock, Shield, Sparkles, Ruler, Shirt, Users, GraduationCap, Heart, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { DesignCard } from "@/components/designs/DesignCard";
import { categories, designs, testimonials } from "@/data/mockData";
import heroImage from "@/assets/hero-tailoring.jpg";

const Index = () => {
  const featuredDesigns = designs.filter((d) => d.isPopular).slice(0, 8);
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

      {/* Quick Access Services */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <div className="text-center mb-10">
            <p className="text-accent font-medium mb-2">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Tailoring Services</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Menswear Card */}
            <Link to="/mens" className="group">
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-card hover-lift">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop" 
                  alt="Men's Tailoring"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shirt className="w-5 h-5 text-accent" />
                    <span className="text-accent text-sm font-medium">Men's Collection</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-1">Men's Tailoring</h3>
                  <p className="text-white/70 text-sm">Shirts, Pants, Suits & More</p>
                </div>
              </div>
            </Link>

            {/* Uniforms Card */}
            <Link to="/uniforms" className="group">
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-card hover-lift">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop" 
                  alt="School Uniforms"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-accent" />
                    <span className="text-accent text-sm font-medium">Bulk Orders</span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-1">Uniforms</h3>
                  <p className="text-white/70 text-sm">Schools, Offices & Institutions</p>
                </div>
              </div>
            </Link>

            {/* Measurements Card */}
            <Link to="/measurements" className="group">
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-card hover-lift bg-gradient-to-br from-primary to-primary/80">
                <div className="absolute inset-0 pattern-fabric opacity-20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Ruler className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Save Your Measurements</h3>
                  <p className="text-white/80 text-sm mb-4">Enter once, use for all future orders</p>
                  <Button variant="hero" size="sm">
                    Get Started <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-accent font-medium mb-2">Browse by Category</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold">Women's Collection</h2>
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
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <div className="text-center mb-10">
            <p className="text-accent font-medium mb-2">Trending Now</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Popular Designs</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <p className="text-accent font-medium mb-2">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Choose Design", desc: "Browse 500+ designs or upload your own", icon: Heart },
              { step: "02", title: "Add Measurements", desc: "Use our guide or AI tool (coming soon)", icon: Ruler },
              { step: "03", title: "Place Order", desc: "Select material option and checkout", icon: TrendingUp },
              { step: "04", title: "Get Delivered", desc: "Receive your perfect fit at home", icon: CheckCircle2 },
            ].map((item, i) => (
              <div key={i} className="relative text-center p-6">
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/4 right-0 w-full h-0.5 bg-border/50 -z-10" />
                )}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center shadow-card">
                  <item.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-xs text-accent font-bold">{item.step}</span>
                <h3 className="font-display font-bold text-lg mt-1 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent font-medium mb-2">Why Tailo?</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">The Tailo Difference</h2>
              <div className="space-y-4">
                {[
                  { title: "Expert Tailors", desc: "Verified professionals with 10+ years experience" },
                  { title: "Quality Materials", desc: "Premium fabrics and threads for lasting garments" },
                  { title: "Perfect Fit Guarantee", desc: "Free alterations if it doesn't fit perfectly" },
                  { title: "Easy Returns", desc: "7-day hassle-free return policy" },
                  { title: "Transparent Pricing", desc: "No hidden costs, what you see is what you pay" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=700&fit=crop" 
                alt="Tailor at work" 
                className="rounded-2xl shadow-card w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold">10K+</p>
                    <p className="text-xs text-muted-foreground">Happy Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-muted/30">
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
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/categories">Start Designing <ArrowRight className="w-5 h-5 ml-1" /></Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/measurements">Save Measurements</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
