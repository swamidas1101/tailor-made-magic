import { Link } from "react-router-dom";
import { GraduationCap, Briefcase, Users, ArrowRight, Check, Building2, Stethoscope, UtensilsCrossed, Shield, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const uniformTypes = [
  {
    id: "school",
    icon: GraduationCap,
    title: "School Uniforms",
    description: "Quality school uniforms for students of all ages.",
    features: ["Shirts & blouses", "Pants & skirts", "Ties & belts"],
    startingPrice: 500,
  },
  {
    id: "college",
    icon: Users,
    title: "College Uniforms",
    description: "Smart college uniforms with modern cuts.",
    features: ["Blazers & jackets", "Formal shirts", "Custom embroidery"],
    startingPrice: 800,
  },
  {
    id: "corporate",
    icon: Briefcase,
    title: "Corporate Wear",
    description: "Professional workwear for offices.",
    features: ["Business suits", "Staff uniforms", "Logo branding"],
    startingPrice: 1200,
  },
  {
    id: "hospitality",
    icon: UtensilsCrossed,
    title: "Hospitality",
    description: "Uniforms for hotels & restaurants.",
    features: ["Chef coats", "Server attire", "Front desk wear"],
    startingPrice: 900,
  },
  {
    id: "healthcare",
    icon: Stethoscope,
    title: "Healthcare",
    description: "Medical scrubs & lab coats.",
    features: ["Scrubs", "Lab coats", "Nurse uniforms"],
    startingPrice: 700,
  },
  {
    id: "security",
    icon: Shield,
    title: "Security",
    description: "Professional security guard uniforms.",
    features: ["Guard uniforms", "Badges", "Accessories"],
    startingPrice: 1000,
  },
];

export default function Uniforms() {
  return (
    <Layout>
      {/* Hero - Compact */}
      <section className="py-10 md:py-16 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
        <div className="container px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">
            Uniform Tailoring
          </h1>
          <p className="text-white/90 max-w-lg mx-auto text-sm md:text-base mb-6">
            Bulk orders with customization and competitive pricing.
          </p>
          <Button variant="hero" size="lg" className="bg-white text-orange-600 hover:bg-white/90">
            Get Bulk Quote <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Uniform Types - 2 columns on mobile */}
      <section className="py-10 md:py-16">
        <div className="container px-4">
          <div className="text-center mb-8">
            <p className="text-accent text-sm font-medium mb-1">Our Services</p>
            <h2 className="text-xl md:text-3xl font-display font-bold">Uniform Categories</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {uniformTypes.map((type) => (
              <div key={type.id} className="bg-card rounded-xl p-4 md:p-6 shadow-soft border border-border hover:shadow-md transition-shadow">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center mb-3 md:mb-4">
                  <type.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-sm md:text-lg font-display font-bold mb-1 md:mb-2 line-clamp-1">{type.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-3 line-clamp-2 hidden md:block">{type.description}</p>
                
                <ul className="space-y-1 mb-3 hidden md:block">
                  {type.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-border">
                  <p className="text-[10px] md:text-xs text-muted-foreground">From</p>
                  <p className="text-base md:text-xl font-bold text-primary">₹{type.startingPrice}</p>
                  <Button variant="default" size="sm" className="w-full mt-2 text-xs h-8">
                    Get Quote
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Order CTA - Compact */}
      <section className="py-10 md:py-16 bg-muted/50">
        <div className="container px-4">
          <div className="bg-card rounded-xl p-6 md:p-10 shadow-md flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-display font-bold mb-2">
                Need Bulk Uniforms?
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Special pricing for orders of 50+ pieces with custom sizing and branding.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button variant="gold" size="default">
                  Contact for Bulk Orders
                </Button>
                <Button variant="outline" size="default" asChild>
                  <Link to="/measurements">Size Guide</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 md:p-4 bg-muted rounded-lg text-center">
                <p className="text-xl md:text-2xl font-bold text-primary">50+</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Schools Served</p>
              </div>
              <div className="p-3 md:p-4 bg-muted rounded-lg text-center">
                <p className="text-xl md:text-2xl font-bold text-primary">10K+</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">Uniforms Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
