import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ruler, PlayCircle, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MeasurementGuide() {
    const categories = ["Blouse", "Kurti", "Salwar", "Lehenga"];

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                <div className="container px-4 py-16">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                            <Ruler className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-display font-bold mb-4">Measurement Guide</h1>
                        <p className="text-xl text-muted-foreground">
                            Follow our simple step-by-step instructions to get the perfect fit.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-10 mb-12">
                        <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-4">Watch Video Tutorial</h2>
                                <p className="text-muted-foreground mb-6">
                                    Learn how to take accurate measurements for a blouse in strictly 5 minutes. You'll need a standard measuring tape and a mirror.
                                </p>
                                <Button variant="default" className="gap-2">
                                    <PlayCircle className="w-5 h-5" /> Watch Video
                                </Button>
                            </div>
                            <div className="w-full md:w-1/2 aspect-video bg-muted rounded-xl flex items-center justify-center">
                                <span className="text-muted-foreground">Video Player Placeholder</span>
                            </div>
                        </div>

                        <Tabs defaultValue="Blouse" className="w-full">
                            <TabsList className="w-full justify-start overflow-x-auto">
                                {categories.map(cat => (
                                    <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                                ))}
                            </TabsList>
                            {categories.map(cat => (
                                <TabsContent key={cat} value={cat} className="pt-6">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-lg">Key Measurements for {cat}</h3>
                                            {[
                                                { name: "Shoulder", desc: "Edge to edge of shoulder bone" },
                                                { name: "Bust", desc: "Round of fullest part of chest" },
                                                { name: "Waist", desc: "Natural waist line (above navel)" },
                                                { name: "Length", desc: "Shoulder to desired length" }
                                            ].map((m, i) => (
                                                <div key={i} className="flex gap-4 items-start p-4 bg-muted/20 rounded-lg">
                                                    <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center text-xs font-bold shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-sm mb-1">{m.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{m.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-white rounded-xl border p-4 flex items-center justify-center min-h-[400px]">
                                            <span className="text-muted-foreground text-sm italic">Diagram for {cat} body map</span>
                                        </div>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>

                    <div className="text-center">
                        <p className="mb-4 text-muted-foreground">Ready with your numbers?</p>
                        <Button size="lg" variant="gold" asChild>
                            <Link to="/measurements">Enter My Measurements</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
