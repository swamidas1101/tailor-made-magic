import { useState, useEffect } from "react";
import { promoCodeService, PromoCode } from "@/services/promoCodeService";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Ticket, Check, X, Loader2, Search, Sparkles } from "lucide-react";
import { handleCustomError, showSuccess } from "@/lib/toastUtils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminPromos() {
    const [promos, setPromos] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);

    const [formData, setFormData] = useState<Omit<PromoCode, 'id' | 'usedCount'>>({
        code: "",
        discountType: "fixed",
        value: 0,
        minOrderAmount: 0,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true,
        description: "",
        usageLimit: 0
    });

    useEffect(() => {
        loadPromos();
    }, []);

    async function loadPromos() {
        try {
            const data = await promoCodeService.getAllPromos();
            setPromos(data);
        } catch (error) {
            handleCustomError(error, "Failed to load promo codes.");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await promoCodeService.createPromo(formData);
            showSuccess("Promo code created successfully!");
            setIsDialogOpen(false);
            loadPromos();
            setFormData({
                code: "",
                discountType: "fixed",
                value: 0,
                minOrderAmount: 0,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                isActive: true,
                description: "",
                usageLimit: 0
            });
        } catch (error) {
            handleCustomError(error, "Failed to create promo code.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this promo code?")) return;
        try {
            await promoCodeService.deletePromo(id);
            showSuccess("Promo code deleted.");
            loadPromos();
        } catch (error) {
            handleCustomError(error, "Failed to delete promo code.");
        }
    };

    const toggleStatus = async (promo: PromoCode) => {
        try {
            await promoCodeService.updatePromo(promo.id!, { isActive: !promo.isActive });
            showSuccess(`Promo code ${!promo.isActive ? "activated" : "deactivated"}.`);
            loadPromos();
        } catch (error) {
            handleCustomError(error, "Failed to update status.");
        }
    };

    const handleSeedData = async () => {
        setIsSeeding(true);
        try {
            const seedPromos: Omit<PromoCode, 'id' | 'usedCount'>[] = [
                {
                    code: "WELCOME10",
                    discountType: "percentage",
                    value: 10,
                    minOrderAmount: 500,
                    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    isActive: true,
                    description: "Welcome discount for new members",
                    usageLimit: 1000
                },
                {
                    code: "FESTIVE500",
                    discountType: "fixed",
                    value: 500,
                    minOrderAmount: 2499,
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    isActive: true,
                    description: "Festive season flat discount",
                    usageLimit: 500
                },
                {
                    code: "FREEDEL",
                    discountType: "free_delivery",
                    value: 0,
                    minOrderAmount: 999,
                    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    isActive: true,
                    description: "Free delivery on orders above 999",
                    usageLimit: 2000
                },
                {
                    code: "BoutiqueSpecial",
                    discountType: "percentage",
                    value: 20,
                    minOrderAmount: 1500,
                    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    isActive: true,
                    description: "Exclusive boutique collection discount",
                    usageLimit: 300
                }
            ];

            // Filter out existing codes to avoid duplicates
            const existingCodes = new Set(promos.map(p => p.code));
            const newPromos = seedPromos.filter(p => !existingCodes.has(p.code));

            if (newPromos.length === 0) {
                toast.info("Seed data already exists.");
                return;
            }

            await Promise.all(newPromos.map(p => promoCodeService.createPromo(p)));
            showSuccess(`Successfully seeded ${newPromos.length} new promo codes!`);
            loadPromos();
        } catch (error) {
            handleCustomError(error, "Failed to seed promo data.");
        } finally {
            setIsSeeding(false);
        }
    };

    const filteredPromos = promos.filter(p =>
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold">Promo Codes</h1>
                    <p className="text-muted-foreground">Manage discounts and seasonal offers</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleSeedData}
                        disabled={isSeeding}
                        className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50 h-10 font-bold uppercase tracking-wider text-[10px]"
                    >
                        {isSeeding ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
                        Seed Promos
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 font-bold uppercase tracking-wider text-[10px] items-center">
                                <Plus className="w-4 h-4 mr-2" /> Create Promo
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Create New Promo Code</DialogTitle>
                                <DialogDescription>Set up a new discount for your customers.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Promo Code</Label>
                                        <Input
                                            id="code"
                                            placeholder="FESTIVE50"
                                            required
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Discount Type</Label>
                                        <Select
                                            value={formData.discountType}
                                            onValueChange={(v: any) => setFormData({ ...formData, discountType: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                <SelectItem value="free_delivery">Free Delivery</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="value">Discount Value {formData.discountType === 'free_delivery' ? '(N/A)' : ''}</Label>
                                        <Input
                                            id="value"
                                            type="number"
                                            disabled={formData.discountType === 'free_delivery'}
                                            value={formData.value}
                                            onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="minAmount">Min Order Amount (₹)</Label>
                                        <Input
                                            id="minAmount"
                                            type="number"
                                            value={formData.minOrderAmount}
                                            onChange={e => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input
                                            id="expiry"
                                            type="date"
                                            required
                                            value={formData.expiryDate}
                                            onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="limit">Usage Limit (0 = Unlimited)</Label>
                                        <Input
                                            id="limit"
                                            type="number"
                                            value={formData.usageLimit}
                                            onChange={e => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Internal or User-facing)</Label>
                                    <Input
                                        id="description"
                                        placeholder="Get 50% off on all blouse designs"
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button type="submit" className="w-full" disabled={isSaving}>
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Promo Code"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by code or description..."
                            className="pl-10 max-w-md bg-background"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Type & Value</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Usage</th>
                                <th className="px-6 py-4">Expiry</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-8 h-12 bg-muted/10"></td>
                                    </tr>
                                ))
                            ) : filteredPromos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        No promo codes found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredPromos.map((promo) => (
                                    <tr key={promo.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                                                    <Ticket className="w-4 h-4" />
                                                </div>
                                                <span className="font-black text-lg">{promo.code}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{promo.description}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="capitalize font-bold">
                                                {promo.discountType === 'fixed' ? `₹${promo.value}` : promo.discountType === 'percentage' ? `${promo.value}%` : 'Free Delivery'}
                                            </Badge>
                                            <p className="text-[10px] text-muted-foreground mt-1">Min Order: ₹{promo.minOrderAmount}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleStatus(promo)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${promo.isActive
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                                    }`}
                                            >
                                                {promo.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                {promo.isActive ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{promo.usedCount || 0}</span>
                                                <span className="text-muted-foreground text-xs">/ {promo.usageLimit === 0 ? "∞" : promo.usageLimit}</span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-500"
                                                    style={{ width: `${promo.usageLimit === 0 ? 0 : Math.min(100, ((promo.usedCount || 0) / promo.usageLimit!) * 100)}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-medium ${new Date(promo.expiryDate) < new Date() ? "text-red-500 font-bold" : ""}`}>
                                                {new Date(promo.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive"
                                                onClick={() => handleDelete(promo.id!)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
