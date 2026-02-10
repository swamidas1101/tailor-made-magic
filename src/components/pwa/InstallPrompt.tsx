import { useState, useEffect } from "react";
import { X, Download, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface InstallPromptProps {
    role?: "admin" | "tailor" | "customer";
}

export function InstallPrompt({ role = "customer" }: InstallPromptProps) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if user has dismissed the prompt before
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed);
            const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < 7) {
                return; // Don't show again for 7 days
            }
        }

        // Listen for the beforeinstallprompt event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show prompt after 3 seconds
            setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        setShowPrompt(false);
    };

    const getRoleContent = () => {
        switch (role) {
            case "admin":
                return {
                    title: "Install Tailor Admin",
                    description: "Get instant access to your admin dashboard. Manage tailors, moderate designs, and track analytics - all from your home screen.",
                    icon: "🛡️",
                    benefits: [
                        "Quick access to admin dashboard",
                        "Manage platform on the go",
                        "Real-time notifications",
                        "Works offline"
                    ]
                };
            case "tailor":
                return {
                    title: "Install Tailor Pro",
                    description: "Manage your designs and orders on the go. Quick access to your portfolio, earnings, and customer orders.",
                    icon: "✂️",
                    benefits: [
                        "Manage designs anywhere",
                        "Track orders in real-time",
                        "Monitor your earnings",
                        "Fast, app-like experience"
                    ]
                };
            default:
                return {
                    title: "Install Tailor",
                    description: "Browse custom designs and place orders faster. Save your favorite tailors and track your orders - all in one tap.",
                    icon: "👔",
                    benefits: [
                        "Browse designs faster",
                        "One-tap access",
                        "Track your orders",
                        "Save your favorites"
                    ]
                };
        }
    };

    if (isInstalled || !deferredPrompt) return null;

    const content = getRoleContent();

    return (
        <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-2xl shadow-lg">
                                {content.icon}
                            </div>
                            <div>
                                <DialogTitle className="text-xl">{content.title}</DialogTitle>
                                <p className="text-xs text-muted-foreground mt-0.5">Add to Home Screen</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleDismiss}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <DialogDescription className="text-sm leading-relaxed">
                        {content.description}
                    </DialogDescription>

                    <Card className="p-4 bg-amber-50/50 border-amber-200/50">
                        <p className="text-xs font-bold text-amber-900 mb-3 uppercase tracking-wider">
                            Why Install?
                        </p>
                        <ul className="space-y-2">
                            {content.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-amber-900">
                                    <span className="text-amber-600 mt-0.5">✓</span>
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Smartphone className="w-4 h-4" />
                        <span>Works on mobile</span>
                        <span className="text-border">•</span>
                        <Monitor className="w-4 h-4" />
                        <span>Works on desktop</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleDismiss}
                    >
                        Maybe Later
                    </Button>
                    <Button
                        className="flex-1 bg-amber-600 hover:bg-amber-700"
                        onClick={handleInstall}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Install Now
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
