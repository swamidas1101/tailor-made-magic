import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, Shield, Sparkles, Ruler, Shirt, Users, GraduationCap, Heart, TrendingUp, CheckCircle2, Flower2, Crown, Gem, Award, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { DesignCard } from "@/components/designs/DesignCard";
import { testimonials, designs as mockDesigns, categories as mockCategories, menCategories as mockMenCategories } from "@/data/mockData";
import { designService, categoryService } from "@/services/designService";
import { useState, useEffect } from "react";
import { Design, Category } from "@/data/mockData";
import heroImage from "@/assets/hero-tailoring.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const Index = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menCategories, setMenCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, activeRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && activeRole) {
      if (activeRole === 'tailor') {
        navigate('/tailor');
      } else if (activeRole === 'admin') {
        navigate('/admin');
      }
    }
  }, [user, activeRole, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedDesigns, fetchedCategories] = await Promise.all([
          designService.getFeaturedDesigns(8),
          categoryService.getAllCategories()
        ]);

        // Fallback to mock data if Firestore is empty
        if (fetchedDesigns.length === 0) {
          console.warn("Firestore is empty, using mock data. Please seed the database at /seed");
          setDesigns(mockDesigns.filter(d => d.isPopular).slice(0, 8));
        } else {
          setDesigns(fetchedDesigns);
        }

        if (fetchedCategories.length === 0) {
          console.warn("Firestore categories empty, using mock data");
          setCategories(mockCategories.slice(0, 4));
          setMenCategories(mockMenCategories.slice(0, 4));
        } else {
          // Filter categories by type
          const womenCats = fetchedCategories.filter(c => c.type === "women").slice(0, 4);
          const menCats = fetchedCategories.filter(c => c.type === "men").slice(0, 4);

          setCategories(womenCats);
          setMenCategories(menCats);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to mock data on error
        setDesigns(mockDesigns.filter(d => d.isPopular).slice(0, 8));
        setCategories(mockCategories.slice(0, 4));
        setMenCategories(mockMenCategories.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prevent flash of content if we are going to redirect or still loading auth
  if (authLoading || (user && activeRole && (activeRole === 'tailor' || activeRole === 'admin'))) {
    return (
      <div className="flex bg-background h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-rose/20 border-t-rose animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-gold/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-muted-foreground animate-pulse font-medium">Loading Tailo...</p>
        </div>
      </div>
    );
  }

  const featuredDesigns = designs;
  const featuredCategories = categories;
  const featuredMenCategories = menCategories;

  return (
    <Layout>
      {/* Hero Section - Stunning Full Width */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background with Parallax Effect */}
        <div className="absolute inset-0 w-full">
          <motion.img
            src={heroImage}
            alt="Premium Tailoring"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-noir/95 via-noir/70 to-noir/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent" />
        </div>

        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-rose/30 to-gold/20 blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-1/3 w-48 h-48 rounded-full bg-gradient-to-br from-gold/20 to-rose/10 blur-3xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="w-full relative z-10 px-4 md:px-8 lg:px-16 py-16">
          <motion.div
            className="max-w-3xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Premium Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose/20 to-gold/20 backdrop-blur-md border border-rose/30 rounded-full px-5 py-2 mb-6"
            >
              <Crown className="w-4 h-4 text-gold" />
              <span className="text-rose-light font-medium text-sm">Premium Online Tailoring</span>
              <Sparkles className="w-4 h-4 text-gold" />
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-[1.1]"
            >
              Crafting Elegance,<br />
              <span className="text-gradient-luxury">Stitch by Stitch</span>
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              variants={itemVariants}
              className="text-white/80 text-lg md:text-xl mb-8 max-w-xl leading-relaxed"
            >
              Experience bespoke tailoring from the comfort of your home. Choose from 500+ curated designs
              and receive perfectly fitted garments at your doorstep.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
              <Button variant="hero" size="xl" asChild className="group">
                <Link to="/categories">
                  Explore Designs
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/measurements">
                  <Play className="w-5 h-5 mr-1" />
                  How It Works
                </Link>
              </Button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 pt-8 border-t border-white/10"
            >
              {[
                { value: "500+", label: "Designs", icon: Gem },
                { value: "10K+", label: "Happy Customers", icon: Heart },
                { value: "4.9", label: "Rating", icon: Star },
                { value: "3-7", label: "Days Delivery", icon: Clock },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose/30 to-gold/30 backdrop-blur-sm flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                    <p className="text-white/60 text-xs">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-rose"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Marquee */}
      <section className="py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-12">
              {[
                { icon: Star, text: "500+ Premium Designs" },
                { icon: Clock, text: "3-7 Days Delivery" },
                { icon: Shield, text: "Quality Guaranteed" },
                { icon: Award, text: "Expert Tailors" },
                { icon: Sparkles, text: "AI Measurements Coming" },
                { icon: Heart, text: "10,000+ Happy Customers" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white">
                  <item.icon className="w-4 h-4" />
                  <span className="font-semibold text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Quick Access Services */}
      <section className="py-20 md:py-28 gradient-mesh">
        <div className="container px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-foreground/5 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-foreground font-medium text-sm whitespace-nowrap">What We Offer</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Tailoring Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                to: "/categories",
                image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=600&fit=crop",
                icon: Flower2,
                badge: "Women's Collection",
                title: "Women's Tailoring",
                desc: "Blouses, Kurtis, Lehengas & More"
              },
              {
                to: "/mens",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
                icon: Shirt,
                badge: "Men's Collection",
                title: "Men's Tailoring",
                desc: "Shirts, Pants, Suits & More"
              },
              {
                to: "/uniforms",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop",
                icon: GraduationCap,
                badge: "Bulk Orders",
                title: "Uniforms",
                desc: "Schools, Offices & Institutions"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-full"
              >
                <Link to={card.to} className="group block h-full">
                  <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500">
                    <motion.img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/40 to-transparent" />
                    <motion.div
                      className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2 md:mb-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <card.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white/80 text-sm font-medium">{card.badge}</span>
                        </div>
                        <h3 className="text-3xl font-display font-bold text-white mb-1">{card.title}</h3>
                        <p className="text-white/70 text-base">{card.desc}</p>
                      </div>
                      <div className="hidden md:block">
                        <Button variant="white" size="sm" className="rounded-full px-6">Explore</Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Measurements Card - Special with gradient */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full"
            >
              <Link to="/measurements" className="group block">
                <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 pattern-luxury opacity-20" />
                  <motion.div
                    className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/20 blur-3xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <motion.div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center mb-4 md:mb-6 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Ruler className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">Save Measurements</h3>
                    <p className="text-white/90 text-sm mb-6">Enter once, use for all orders</p>
                    <Button variant="heroOutline" size="lg" className="group">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted/30 pattern-dots">
        <div className="container px-4">
          <motion.div
            className="flex justify-between items-end mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-foreground/5 rounded-full px-4 py-1.5 mb-4">
                <Gem className="w-4 h-4 text-foreground" />
                <span className="text-foreground font-medium text-sm">Browse by Category</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold">Women's <span className="text-gradient-rose">Collection</span></h2>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex group">
              <Link to="/categories">
                View All
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredCategories.map((cat, i) => (
              <motion.div key={cat.id} variants={itemVariants}>
                <CategoryCard {...cat} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Men's Categories - New Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container px-4">
          <motion.div
            className="flex justify-between items-end mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-foreground/5 rounded-full px-4 py-1.5 mb-4">
                <Shirt className="w-4 h-4 text-foreground" />
                <span className="text-foreground font-medium text-sm">For Him</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold">Men's <span className="text-gradient-gold">Collection</span></h2>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex group">
              <Link to="/mens">
                View All
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredMenCategories.map((cat, i) => (
              <motion.div key={cat.id} variants={itemVariants}>
                <CategoryCard {...cat} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Designs */}
      <section className="py-20 md:py-28">
        <div className="container px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-1.5 mb-4">
              <TrendingUp className="w-4 h-4 text-gold" />
              <span className="text-gold-dark font-semibold text-sm">Trending Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold">Popular <span className="text-gradient-gold">Designs</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {featuredDesigns.map((design, i) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <DesignCard {...design} />
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button variant="rose" size="xl" asChild className="group">
              <Link to="/categories">
                View All Designs
                <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background">
        <div className="container px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-burgundy/10 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-burgundy" />
              <span className="text-burgundy font-semibold text-sm">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold">How It <span className="text-gradient-rose">Works</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 relative">
            {/* Connection Line - Desktop Only */}
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-rose via-gold to-burgundy opacity-30" />

            {[
              { step: "01", title: "Choose", desc: "Browse designs", icon: Heart, color: "from-rose to-rose-dark" },
              { step: "02", title: "Measure", desc: "Add details", icon: Ruler, color: "from-gold to-gold-dark" },
              { step: "03", title: "Order", desc: "Checkout", icon: TrendingUp, color: "from-burgundy to-burgundy-light" },
              { step: "04", title: "Receive", desc: "Home delivery", icon: CheckCircle2, color: "from-rose to-gold" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="bg-card/50 backdrop-blur-sm md:bg-transparent p-3 rounded-2xl md:p-0 border border-border/30 md:border-0 h-full flex flex-col items-center justify-center">
                  <motion.div
                    className={`w-12 h-12 md:w-20 md:h-20 mx-auto mb-3 md:mb-6 rounded-xl md:rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-luxury`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <item.icon className="w-6 h-6 md:w-9 md:h-9 text-white" />
                  </motion.div>
                  <span className="text-[10px] md:text-xs text-rose font-bold tracking-widest block mb-1">{item.step}</span>
                  <h3 className="font-display font-bold text-sm md:text-xl mb-1 md:mb-2">{item.title}</h3>
                  <p className="text-[10px] md:text-sm text-muted-foreground md:max-w-[200px] mx-auto leading-tight">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-rose/10 rounded-full px-4 py-1.5 mb-4">
                <Award className="w-4 h-4 text-rose" />
                <span className="text-rose font-semibold text-sm">Why Tailo?</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">The Tailo <span className="text-gradient-rose">Difference</span></h2>
              <div className="space-y-4">
                {[
                  { title: "Expert Tailors", desc: "Verified professionals with 10+ years experience" },
                  { title: "Quality Materials", desc: "Premium fabrics and threads for lasting garments" },
                  { title: "Perfect Fit Guarantee", desc: "Free alterations if it doesn't fit perfectly" },
                  { title: "Easy Returns", desc: "7-day hassle-free return policy" },
                  { title: "Transparent Pricing", desc: "No hidden costs, what you see is what you pay" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-4 items-start p-5 bg-card rounded-2xl border border-border/50 hover:shadow-card hover:border-rose/30 transition-all duration-300 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose/20 to-gold/20 flex items-center justify-center flex-shrink-0 group-hover:from-rose/30 group-hover:to-gold/30 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-rose" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <motion.img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=700&fit=crop"
                  alt="Tailor at work"
                  className="rounded-3xl shadow-luxury w-full"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 rounded-3xl border border-rose/20" />
              </div>

              {/* Floating Stats Card */}
              <motion.div
                className="absolute -bottom-8 -left-8 bg-card p-5 rounded-2xl shadow-luxury border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose to-gold flex items-center justify-center shadow-rose">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-bold text-gradient-rose">10K+</p>
                    <p className="text-sm text-muted-foreground">Happy Customers</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Rating Card */}
              <motion.div
                className="absolute -top-4 -right-4 bg-card p-4 rounded-2xl shadow-luxury border border-border/50"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                animate={{
                  y: [0, -10, 0],
                  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="font-bold text-foreground">4.9</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">2,500+ Reviews</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background">
        <div className="container px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-1.5 mb-4">
              <Heart className="w-4 h-4 text-gold" />
              <span className="text-gold-dark font-semibold text-sm">What Our Customers Say</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold">Happy <span className="text-gradient-gold">Customers</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                className="bg-card p-7 rounded-3xl shadow-soft border border-border/50 hover:shadow-luxury hover:border-rose/30 transition-all duration-500 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-foreground/90 mb-6 text-lg leading-relaxed">"{t.comment}"</p>
                <div className="flex items-center gap-4 pt-5 border-t border-border">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-rose/20" />
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-950 to-black" />
        <div className="absolute inset-0 pattern-luxury opacity-20" />
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold/20 blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-rose/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        <div className="container px-4 relative z-10">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-white/90 font-medium text-sm">Limited Time Offer</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Ready to Get <span className="text-gold">Started?</span>
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-lg mx-auto">
              Book your first tailoring order today and get <span className="text-gold font-bold">10% off</span> with code FIRST10
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gold" size="xl" asChild className="group">
                <Link to="/categories">
                  Start Designing
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/measurements">Save Measurements</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
