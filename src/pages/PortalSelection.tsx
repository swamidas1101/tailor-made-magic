import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Building2, ShoppingBag, Briefcase, ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortalSelection() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <motion.div
                    className="text-center mb-8 sm:mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl sm:text-3xl font-display font-bold">Tailo</h1>
                            <p className="text-xs sm:text-sm text-muted-foreground">Premium Tailoring</p>
                        </div>
                    </Link>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mt-6 mb-2">
                        Welcome to Tailo
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                        Choose your portal to get started
                    </p>
                </motion.div>

                {/* Portal Cards */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
                    {/* Customer Portal */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Link to="/auth/customer" className="block group">
                            <div className="relative h-full bg-card rounded-2xl sm:rounded-3xl border-2 border-border hover:border-blue-500/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl">
                                {/* Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Content */}
                                <div className="relative p-6 sm:p-8 md:p-10">
                                    {/* Icon */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-3 group-hover:text-blue-600 transition-colors">
                                        Customer Portal
                                    </h3>
                                    <p className="text-sm sm:text-base text-muted-foreground mb-6">
                                        Browse designs, place orders, and track your custom tailoring
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-start gap-2 text-xs sm:text-sm">
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <span>Browse 1000+ designs and styles</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-xs sm:text-sm">
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <span>Save measurements and preferences</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-xs sm:text-sm">
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <span>Track orders in real-time</span>
                                        </li>
                                    </ul>

                                    {/* CTA */}
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-lg transition-all"
                                        size="lg"
                                    >
                                        Continue as Customer
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        For individuals looking to get custom tailoring
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Business Portal */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link to="/auth/business/login" className="block group">
                            <div className="relative h-full bg-card rounded-2xl sm:rounded-3xl border-2 border-border hover:border-orange-500/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl">
                                {/* Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-orange-950/20 dark:via-background dark:to-amber-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Content */}
                                <div className="relative p-6 sm:p-8 md:p-10">
                                    {/* Icon */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-3 group-hover:text-orange-600 transition-colors">
                                        Business Portal
                                    </h3>
                                    <p className="text-sm sm:text-base text-muted-foreground mb-6">
                                        For tailors, boutiques, and admins to manage their business
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-start gap-2 text-xs sm:text-sm">
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                            <span>Manage orders and customers</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-xs sm:text-sm">
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                            <span>Showcase your designs online</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-xs sm:text-sm">
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                            <span>Track earnings and analytics</span>
                                        </li>
                                    </ul>

                                    {/* CTA */}
                                    <Button
                                        className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white group-hover:shadow-lg transition-all"
                                        size="lg"
                                    >
                                        Continue as Business
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        For tailors, boutiques, and administrators
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Footer Links */}
                <motion.div
                    className="text-center mt-8 sm:mt-12 space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        New to Tailo?{" "}
                        <Link to="/how-it-works" className="text-primary hover:underline font-medium">
                            Learn how it works
                        </Link>
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        <Link to="/" className="text-primary hover:underline">
                            ← Back to Home
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
