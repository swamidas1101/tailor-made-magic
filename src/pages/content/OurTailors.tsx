import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function OurTailors() {
    const tailors = [
        {
            id: 1,
            name: "Master Weavers Boutique",
            location: "Jubilee Hills, Hyderabad",
            specialty: "Bridal & Heritage",
            rating: 4.9,
            reviews: 128,
            image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=800",
            description: "Specializing in intricate Maggam work and heavy bridal blouses. With over 20 years of experience, our master cutters ensure the perfect fit for your special day."
        },
        {
            id: 2,
            name: "Studio 9 Designs",
            location: "Banjara Hills, Hyderabad",
            specialty: "Contemporary & Suits",
            rating: 4.8,
            reviews: 95,
            image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800",
            description: "Modern cuts for the modern woman. We excel in corporate wear, linen suits, and indo-western fusion wear with impeccable finishing."
        },
        {
            id: 3,
            name: "Heritage Classics",
            location: "Gachibowli, Hyderabad",
            specialty: "Mens Ethnic & Sherwanis",
            rating: 4.9,
            reviews: 210,
            image: "https://images.unsplash.com/photo-1598556856423-c74381830939?auto=format&fit=crop&q=80&w=800",
            description: "The finest destination for Men's wedding attire. Bespoke Sherwanis, Kurtas, and Bandhgalas crafted with traditional techniques."
        },
        {
            id: 4,
            name: "Swift Stitchery",
            location: "Madhapur, Hyderabad",
            specialty: "Quick Alterations & Daily Wear",
            rating: 4.7,
            reviews: 340,
            image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=800",
            description: "Need it fast? We specialize in 24-hour delivery for regular salwars, kurtis, and alterations without compromising on quality."
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                {/* Hero */}
                <div className="bg-primary/5 py-20 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Meet Our Masters</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We partner with the city's finest boutiques and master tailors to bring you unparalleled craftsmanship.
                    </p>
                </div>

                {/* Tailors Grid */}
                <div className="container px-4 py-16">
                    <div className="grid md:grid-cols-2 gap-8">
                        {tailors.map((tailor) => (
                            <div key={tailor.id} className="bg-card rounded-2xl overflow-hidden shadow-elevated border border-border/50 group hover:border-primary/50 transition-all duration-300">
                                <div className="grid md:grid-cols-2 h-full">
                                    <div className="relative h-64 md:h-auto overflow-hidden">
                                        <img
                                            src={tailor.image}
                                            alt={tailor.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                            {tailor.rating} ({tailor.reviews})
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider mb-2">
                                                    {tailor.specialty}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tailor.name}</h3>
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                                                <MapPin className="w-4 h-4" />
                                                {tailor.location}
                                            </div>
                                            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                                {tailor.description}
                                            </p>
                                        </div>

                                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                                            View Profile <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Become a Partner CTA */}
                    <div className="mt-20 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm font-medium mb-4">
                                    <Award className="w-4 h-4" />
                                    <span>Join our network</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Are you a Master Tailor?</h2>
                                <p className="text-blue-100 text-lg mb-8">
                                    Join TailorMade's curated network of premium boutiques. Access a wider audience and manage orders effortlessly with our technology.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                                        Apply as Partner
                                    </Button>
                                    <Button size="lg" variant="outline" className="border-blue-300 text-blue-100 hover:bg-white/10">
                                        Learn Benefits
                                    </Button>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                {/* Illustration or icon can go here */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
