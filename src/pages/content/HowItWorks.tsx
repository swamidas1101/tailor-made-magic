import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MousePointerClick, Ruler, Scissors, Truck, ArrowRight } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            id: 1,
            icon: MousePointerClick,
            title: "Choose Your Style",
            description: "Browse our curated catalog of blouses, kurtis, and suits. Or simply upload a reference image of a design you found on Pinterest or Instagram.",
            action: "Browse Designs",
            link: "/categories"
        },
        {
            id: 2,
            icon: Ruler,
            title: "Get Measured",
            description: "Options that fit your lifestyle: Book a home visit, visit our studio, or follow our easy video guide to measure yourself in 5 minutes.",
            action: "Measurement Guide",
            link: "/measurements/guide"
        },
        {
            id: 3,
            icon: Scissors,
            title: "We Stitch & Craft",
            description: "Once we have your fabric and details, our master tailors get to work. We ensure premium quality stitching, lining, and finishing.",
            action: null,
            link: null
        },
        {
            id: 4,
            icon: Truck,
            title: "Delivered to You",
            description: "Your perfectly fitting garment is delivered to your doorstep. Try it on! If it needs a tweak, we offer free alterations within 7 days.",
            action: "Start an Order",
            link: "/categories"
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                <div className="bg-primary/5 py-24 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Tailoring Made Simple</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Experience the joy of custom-fit clothing without the hassle of traditional tailor visits.
                    </p>
                    <Button size="xl" variant="gold" asChild>
                        <Link to="/categories">Start Your Journey</Link>
                    </Button>
                </div>

                <div className="container px-4 py-20">
                    <div className="max-w-4xl mx-auto relative">
                        {/* Vertical Line for Desktop */}
                        <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

                        {/* Mobile Grid Layout */}
                        <div className="grid grid-cols-2 gap-3 md:hidden">
                            {steps.map((step) => (
                                <div key={step.id} className="bg-card p-4 rounded-xl border border-border/50 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-sm mb-2 leading-tight">{step.title}</h3>
                                    <p className="text-[10px] text-muted-foreground line-clamp-3 mb-3">
                                        {step.description}
                                    </p>
                                    {step.action && (
                                        <Button variant="outline" size="sm" className="w-full text-[10px] h-7 mt-auto" asChild>
                                            <Link to={step.link!}>{step.action}</Link>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Desktop Timeline Layout */}
                        <div className="hidden md:block space-y-12 relative">
                            {steps.map((step, index) => (
                                <div key={index} className={`flex flex-col md:flex-row gap-8 items-start relative ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Icon Marker */}
                                    <div className="absolute left-0 md:left-1/2 -translate-x-1/2 mt-1 w-20 h-20 bg-background border-4 border-primary/20 rounded-full flex items-center justify-center z-10 shadow-sm">
                                        <step.icon className="w-8 h-8 text-primary" />
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {step.id}
                                        </div>
                                    </div>

                                    {/* Spacer for icon alignment */}
                                    <div className="w-20 md:w-1/2 shrink-0"></div>

                                    {/* Content Card */}
                                    <div className={`flex-1 bg-card p-8 rounded-2xl shadow-soft border border-border/50 ${index % 2 === 1 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className="ml-24 md:ml-0"> {/* Mobile offset for icon */}
                                            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed mb-6">
                                                {step.description}
                                            </p>
                                            {step.action && (
                                                <div className={`flex ${index % 2 === 1 ? 'md:justify-end' : 'md:justify-start'}`}>
                                                    <Button variant="outline" asChild>
                                                        <Link to={step.link!}>{step.action} <ArrowRight className="w-4 h-4 ml-2" /></Link>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Video Section */}
                <section className="py-20 bg-muted/30 text-center px-4">
                    <div className="container max-w-4xl">
                        <h2 className="text-3xl font-display font-bold mb-8">See it in Action</h2>
                        <div className="aspect-video bg-black/10 rounded-2xl flex items-center justify-center shadow-inner">
                            <p className="text-muted-foreground font-medium flex items-center gap-2">
                                <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"><ArrowRight className="w-5 h-5 text-primary" /></span>
                                Promotional Video Placeholder
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
