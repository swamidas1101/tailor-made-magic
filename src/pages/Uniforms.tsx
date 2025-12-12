import { Link } from "react-router-dom";
import { GraduationCap, Briefcase, Users, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const uniformTypes = [
  {
    id: "school",
    icon: GraduationCap,
    title: "School Uniforms",
    description: "Quality school uniforms for students of all ages. Durable fabrics that last the academic year.",
    features: ["Shirts & blouses", "Pants & skirts", "Ties & belts", "Bulk discounts"],
    startingPrice: 500,
  },
  {
    id: "college",
    icon: Users,
    title: "College Uniforms",
    description: "Smart college uniforms with modern cuts. Perfect for institutions requiring a professional look.",
    features: ["Blazers & jackets", "Formal shirts", "Trousers & skirts", "Custom embroidery"],
    startingPrice: 800,
  },
  {
    id: "corporate",
    icon: Briefcase,
    title: "Corporate Uniforms",
    description: "Professional workwear for offices, hospitality, and healthcare. Custom branding available.",
    features: ["Business suits", "Staff uniforms", "Logo embroidery", "Volume pricing"],
    startingPrice: 1200,
  },
];

export default function Uniforms() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 gradient-hero">
        <div className="container px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            Uniform Tailoring
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg mb-8">
            Professional uniforms for schools, colleges, and corporates. 
            Bulk orders with customization and competitive pricing.
          </p>
          <Button variant="hero" size="xl">
            Get Bulk Quote <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Uniform Types */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {uniformTypes.map((type) => (
              <div key={type.id} className="bg-card rounded-2xl p-8 shadow-card hover-lift">
                <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-6">
                  <type.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{type.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{type.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {type.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                  <p className="text-2xl font-bold text-primary">₹{type.startingPrice}</p>
                  <p className="text-xs text-muted-foreground mb-4">per piece</p>
                  <Button variant="default" className="w-full">
                    Request Quote
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Order CTA */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4">
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-elevated flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Need Bulk Uniforms?
              </h2>
              <p className="text-muted-foreground mb-6">
                Get special pricing for orders of 50+ pieces. We handle schools, colleges, 
                and corporate orders with custom sizing and branding.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="gold" size="lg">
                  Contact for Bulk Orders
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/measurements">Size Guide</Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-3xl font-bold text-primary">50+</p>
                  <p className="text-xs text-muted-foreground">Schools Served</p>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-3xl font-bold text-primary">10K+</p>
                  <p className="text-xs text-muted-foreground">Uniforms Delivered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
