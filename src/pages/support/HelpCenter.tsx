import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function HelpCenter() {
    const faqs = [
        {
            question: "How do I take my measurements?",
            answer: "We offer a video guide and detailed instructions on our Measurements page. You can also visit our studio for a professional fitting, or use our 'One-time Home Measurement' service where a tailor visits you."
        },
        {
            question: "What is your typical delivery time?",
            answer: "For standard stitching, delivery usually takes 5-7 working days. Express delivery (2-3 days) is available for urgent orders at an additional cost."
        },
        {
            question: "Can I provide my own fabric?",
            answer: "Absolutely! You can choose the 'Stitching Only' option on any design page. We will coordinate the pickup of your fabric or you can drop it at our studio."
        },
        {
            question: "What if the fitting isn't perfect?",
            answer: "We offer a 'Perfect Fit Guarantee'. If your garment doesn't fit as expected, we provide free alterations within 7 days of delivery. Just raise a support ticket or visit us."
        },
        {
            question: "Do you ship internationally?",
            answer: "Currently, we operate primarily in Hyderabad. However, we do accept international orders if you can provide measurements and handle shipping costs. Please contact support for details."
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-primary/5 py-20 text-center px-4">
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">How can we help?</h1>
                    <div className="max-w-xl mx-auto relative mt-8">
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="w-full pl-12 pr-4 py-4 rounded-full border border-border focus:ring-2 focus:ring-primary focus:outline-none shadow-lg"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    </div>
                </div>

                <div className="container px-4 py-16">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <HelpCircle className="w-6 h-6 text-primary" /> Frequently Asked Questions
                        </h2>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border border-border/40 rounded-lg px-4 bg-card">
                                    <AccordionTrigger className="text-left font-medium text-lg hover:text-primary transition-colors">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        {/* Support CTA */}
                        <div className="mt-16 p-8 bg-muted/40 rounded-2xl text-center border border-border dashed">
                            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <MessageSquare className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Still need help?</h3>
                            <p className="text-muted-foreground mb-6">Our support team is available Mon-Sat, 10am - 8pm.</p>
                            <div className="flex justify-center gap-4">
                                <Button asChild>
                                    <Link to="/contact">Contact Us</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <a href="mailto:support@tailormade.com">Email Support</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
