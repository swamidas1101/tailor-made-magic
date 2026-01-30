import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, Info, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Pricing() {
    const services = [
        {
            name: "Blouse Stitching",
            price: "₹850",
            description: "Standard lining blouse with perfect fit guarantee.",
            features: ["Cotton Lining Included", "Basic Neck Designs", "Standard Latkans", "7 Day Delivery"],
            premium: {
                price: "₹1,500+",
                features: ["Premium Lining", "Maggam Work / Embroidery", "Padded Cups", "Express Delivery Available"]
            }
        },
        {
            name: "Kurti / Salwar",
            price: "₹650",
            description: "Simple kurta stitching with neat finishing.",
            features: ["Basic Lining Included", "Side Slits / A-line", "Neck Pattern", "7 Day Delivery"],
            premium: {
                price: "₹1,200+",
                features: ["Anarkali / Angrakha Styles", "Detailed Piping/Lace work", "Pant/Pallazo Stitching", "Complex Patterns"]
            }
        },
        {
            name: "Lehenga Stitching",
            price: "₹2,500",
            description: "Complete lehenga set stitching (Blouse + Skirt).",
            features: ["Can-Can Layering", "Standard Blouse", "Dupatta Edging", "10 Day Delivery"],
            premium: {
                price: "₹4,500+",
                features: ["Double Can-Can", "Designer Blouse", "Heavy Tassels", "Bridal Finishing"]
            }
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                <div className="container px-4 py-16 md:py-24">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Transparent Pricing</h1>
                        <p className="text-xl text-muted-foreground">
                            No hidden charges. Pay for the craftsmanship you truly deserve.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {services.map((service, idx) => (
                            <div key={idx} className="bg-card rounded-2xl shadow-elevated overflow-hidden border border-border/50 flex flex-col">
                                <div className="p-8 bg-muted/20">
                                    <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                                    <p className="text-muted-foreground text-sm mb-6">{service.description}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm text-muted-foreground">Starts at</span>
                                        <span className="text-4xl font-bold text-primary">{service.price}</span>
                                    </div>
                                </div>

                                <div className="p-8 flex-1">
                                    <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Standard Inclusions</h4>
                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm">
                                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="bg-primary/5 rounded-xl p-4 mb-8">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-primary">Premium Upgrade</h4>
                                            <span className="font-bold">{service.premium.price}</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {service.premium.features.slice(0, 2).map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                    {feature}
                                                </li>
                                            ))}
                                            <li className="text-xs text-primary font-medium italic mt-1">+ more customizations</li>
                                        </ul>
                                    </div>

                                    <Button className="w-full" asChild>
                                        <Link to="/categories">Book Now</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add-ons Table */}
                    <div className="mt-20 max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold mb-6 text-center">Common Add-ons</h3>
                        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                            <div className="divide-y divide-border">
                                {[
                                    { item: "Express Delivery (48 hrs)", price: "₹300 - ₹500" },
                                    { item: "Padded Cups (Pair)", price: "₹150" },
                                    { item: "Fancy Latkans/Tassels", price: "₹200 onwards" },
                                    { item: "Pico / Fall / Edging", price: "₹100" },
                                    { item: "Doorstep Pickup & Delivery", price: "Free above ₹1000" }
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 hover:bg-muted/30 transition-colors">
                                        <span className="font-medium">{row.item}</span>
                                        <span className="font-bold text-muted-foreground">{row.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-center text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
                            <Info className="w-4 h-4" />
                            Final price may vary based on design complexity and fabric type.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
