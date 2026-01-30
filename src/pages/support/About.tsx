import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MoveRight, Scissors, Crown, Users, Clock } from "lucide-react";

export default function About() {
    return (
        <Layout>
            <div className="bg-background min-h-screen">
                {/* Hero Section */}
                <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=2070"
                            alt="Tailor working"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background" />
                    </div>

                    <div className="container relative z-10 px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-foreground">
                            Crafting <span className="text-primary italic">Elegance</span>, <br />
                            Stitch by Stitch
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
                            We believe every garment tells a story. At TailorMade, we bring your fashion dreams to life with bespoke precision.
                        </p>
                    </div>
                </div>

                {/* Story Section */}
                <section className="py-20">
                    <div className="container px-4">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1598556856423-c74381830939?auto=format&fit=crop&q=80&w=1000"
                                        alt="Fabric texture"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                {/* Decorative Element */}
                                <div className="absolute -bottom-10 -right-10 bg-primary/10 p-8 rounded-full blur-3xl w-64 h-64 -z-10" />
                            </div>

                            <div className="space-y-6">
                                <span className="text-primary font-medium tracking-widest uppercase text-sm">Our Story</span>
                                <h2 className="text-3xl md:text-4xl font-display font-bold">A Legacy of Quality</h2>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Founded with a passion for textile art, TailorMade started as a small boutique with a big vision: to make custom tailoring accessible, transparent, and luxurious. We bridge the gap between traditional craftsmanship and modern convenience.
                                </p>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Our team of master tailors and designers work tirelessly to ensure every cut, every seam, and every button is perfect. Whether it's a wedding bridal blouse or a sharp corporate uniform, we handle it with the same level of care.
                                </p>

                                <div className="pt-4">
                                    <Button variant="gold" size="lg" asChild>
                                        <Link to="/categories">Explore Our Work <MoveRight className="w-4 h-4 ml-2" /></Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why We Are Different</h2>
                            <p className="text-muted-foreground">The pillars of our craftsmanship.</p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { icon: Scissors, title: "Precision", text: "Measurements accurate to the millimeter." },
                                { icon: Crown, title: "Premium Material", text: "Sourced from the finest mills globally." },
                                { icon: Clock, title: "Timely Delivery", text: "We respect your time, always on schedule." },
                                { icon: Users, title: "Personalised", text: "Designs uniquely tailored to your personality." }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-card p-8 rounded-xl shadow-sm border border-border/50 hover:border-primary/50 transition-colors group text-center">
                                    <div className="w-14 h-14 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary text-primary-foreground text-center">
                    <div className="container px-4">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">Ready to wear your confidence?</h2>
                        <Button size="xl" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
                            <Link to="/contact">Book a Consultation</Link>
                        </Button>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
