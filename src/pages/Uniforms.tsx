import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Factory, GraduationCap, Stethoscope, Briefcase, Mail, Phone, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Uniforms() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 flex items-center justify-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />

          <div className="container relative z-10 px-4 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
                <Briefcase className="w-3.5 h-3.5" />
                Professional Solutions
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Premium Corporate & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                  Institutional Uniforms
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                Elevate your brand identity with tailored perfection. We specialize in high-quality uniforms for schools, hospitals, hospitality, and corporate sectors.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                  Request a Quote
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                  View Catalog
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-muted/10">
          <div className="container px-4">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">Industries We Serve</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2">Tailored for Every Profession</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: GraduationCap, title: "Schools", desc: "Durable, comfortable, and smart uniforms for students of all ages.", bg: "bg-orange-100", text: "text-orange-600" },
                { icon: Stethoscope, title: "Healthcare", desc: "Antimicrobial fabrics designed for comfort during long shifts.", bg: "bg-teal-100", text: "text-teal-600" },
                { icon: Briefcase, title: "Corporate", desc: "Sharp, professional attire that reflects your company's prestige.", bg: "bg-blue-100", text: "text-blue-600" },
                { icon: Factory, title: "Industrial", desc: "Rugged, safety-compliant workwear built for tough environments.", bg: "bg-gray-100", text: "text-gray-600" }
              ].map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-border/50">
                  <div className={`w-14 h-14 ${item.bg} ${item.text} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="container px-4">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=2000&auto=format&fit=crop"
                  alt="Quality Craftsmanship"
                  className="rounded-2xl shadow-2xl w-full h-full object-cover"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Why Partner With Us?</h2>
                <div className="space-y-6">
                  {[
                    "Precision Sizing & Custom Fits",
                    "Premium, Durable Fabrics",
                    "Timely Bulk Delivery",
                    "Logo Embroidery & Custom Branding"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-lg text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>
                <Button className="mt-8 bg-blue-900 hover:bg-blue-800 text-white px-8" size="lg">
                  Learn More About Process
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Bulk Order CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-900 to-black text-white text-center">
          <div className="container px-4 max-w-4xl mx-auto">
            <Users className="w-16 h-16 text-blue-300 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Start Your Bulk Order Today</h2>
            <p className="text-xl text-blue-100/70 mb-10">Get a competitive quote within 24 hours. We handle orders from 20 to 2000+ units with ease.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
              <Button className="w-full bg-white text-blue-900 hover:bg-blue-50 h-14 text-lg">
                <Mail className="w-5 h-5 mr-2" /> Contact Sales
              </Button>
              <Button variant="outline" className="w-full border-blue-400 text-blue-100 hover:bg-blue-900 hover:text-white h-14 text-lg">
                <Phone className="w-5 h-5 mr-2" /> (555) 123-4567
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
