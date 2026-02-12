import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Save, Loader2, IndianRupee, Truck, ShieldCheck, HelpCircle } from "lucide-react";
import { handleCustomError, showSuccess } from "@/lib/toastUtils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function AdminSettings() {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Generic settings state
    const [settings, setSettings] = useState({
        deliveryCharge: 99,
        freeDeliveryMinimum: 1999,
        enableRazorpayLive: false,
        razorpayKey: "rzp_test_dummy",
        supportEmail: "support@tailor-made-magic.com",
        supportWhatsApp: "+91 9876543210",
        orderGracePeriod: 24, // hours to cancel
        taxPercentage: 18
    });

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const docRef = doc(db, "app_settings", "general");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings({ ...settings, ...docSnap.data() });
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
            // Non-critical error, keep defaults
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, "app_settings", "general");
            await setDoc(docRef, settings);
            showSuccess("System settings updated successfully!");
        } catch (error) {
            handleCustomError(error, "Failed to save settings.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[40vh]">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold">System Settings</h1>
                    <p className="text-muted-foreground">Configure global application parameters</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-xl shadow-gold-glow"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logistics Settings */}
                <Card className="rounded-2xl border-border shadow-soft">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle>Logistics & Shipping</CardTitle>
                            <CardDescription>Fees and thresholds for delivery</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="delCharge" className="flex items-center gap-1.5 font-bold">
                                Default Delivery Charge (₹)
                                <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
                            </Label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="delCharge"
                                    type="number"
                                    className="pl-9"
                                    value={settings.deliveryCharge}
                                    onChange={e => setSettings({ ...settings, deliveryCharge: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="freeDel" className="flex items-center gap-1.5 font-bold">
                                Free Delivery Threshold (₹)
                            </Label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="freeDel"
                                    type="number"
                                    className="pl-9"
                                    value={settings.freeDeliveryMinimum}
                                    onChange={e => setSettings({ ...settings, freeDeliveryMinimum: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Gateway */}
                <Card className="rounded-2xl border-border shadow-soft">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle>Payment Gateway</CardTitle>
                            <CardDescription>Configure Razorpay integration</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                            <div className="space-y-0.5">
                                <Label className="font-bold">Enable Live Mode</Label>
                                <p className="text-xs text-muted-foreground">Switch from test to production</p>
                            </div>
                            <Switch
                                checked={settings.enableRazorpayLive}
                                onCheckedChange={v => setSettings({ ...settings, enableRazorpayLive: v })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rzpKey" className="font-bold">Razorpay Key ID</Label>
                            <Input
                                id="rzpKey"
                                className="font-mono text-xs"
                                value={settings.razorpayKey}
                                onChange={e => setSettings({ ...settings, razorpayKey: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gst" className="font-bold">Tax / GST (%)</Label>
                            <Input
                                id="gst"
                                type="number"
                                value={settings.taxPercentage}
                                onChange={e => setSettings({ ...settings, taxPercentage: Number(e.target.value) })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Support Contact */}
                <Card className="rounded-2xl border-border shadow-soft">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-green-50 text-green-600">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle>Customer Support</CardTitle>
                            <CardDescription>Contact info for order issues</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold">Support Email</Label>
                            <Input
                                id="email"
                                value={settings.supportEmail}
                                onChange={e => setSettings({ ...settings, supportEmail: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="wa" className="font-bold">WhatsApp Number</Label>
                            <Input
                                id="wa"
                                value={settings.supportWhatsApp}
                                onChange={e => setSettings({ ...settings, supportWhatsApp: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 p-6 bg-orange-50 border border-orange-100 rounded-3xl flex items-start gap-4 shadow-sm">
                <div className="p-3 rounded-full bg-white shadow-sm ring-1 ring-orange-100">
                    <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                    <h4 className="font-bold text-orange-900">Advanced Configuration</h4>
                    <p className="text-sm text-orange-800/80 mb-4">
                        These settings affect the global behavior of the application. Please ensure values are correct before saving, as they impact pricing and delivery calculations for all users.
                    </p>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="bg-white/50 border-orange-200 text-orange-700">Orders: LIVE</Badge>
                        <Badge variant="outline" className="bg-white/50 border-orange-200 text-orange-700">Notifications: ENABLED</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
