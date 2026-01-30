import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Message sent successfully!", {
                description: "We'll get back to you within 24 hours."
            });
        }, 1500);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                <div className="container px-4 py-16 md:py-24">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Get in Touch</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have a question or want to book an appointment? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                        {/* Contact Info */}
                        <div className="space-y-12">
                            <div className="prose prose-lg dark:prose-invert">
                                <p>
                                    Visit our studio for a personal consultation, or drop us a message for any queries regarding your orders, fabrics, or designs.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Phone</h3>
                                    <p className="text-muted-foreground">+91 98765 43210</p>
                                    <p className="text-muted-foreground">+91 12345 67890</p>
                                </div>

                                <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Email</h3>
                                    <p className="text-muted-foreground">hello@tailormade.com</p>
                                    <p className="text-muted-foreground">support@tailormade.com</p>
                                </div>

                                <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm sm:col-span-2">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">Studio Location</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                123 Fashion Avenue, Jubilee Hills, <br />
                                                Hyderabad, Telangana - 500033
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-muted-foreground bg-muted/30 p-4 rounded-lg">
                                <Clock className="w-5 h-5 text-primary" />
                                <span>Open Monday - Saturday: 10:00 AM - 8:00 PM</span>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-card p-8 md:p-10 rounded-2xl shadow-elevated border border-border/50">
                            <h2 className="text-2xl font-display font-bold mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">First Name</label>
                                        <Input placeholder="John" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Last Name</label>
                                        <Input placeholder="Doe" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input type="email" placeholder="john@example.com" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <Input placeholder="Inquiry about..." required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea placeholder="Tell us how we can help..." className="min-h-[150px]" required />
                                </div>

                                <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                                    {loading ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            Send Message <Send className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
