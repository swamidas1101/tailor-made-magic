import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Plus,
    Trash2,
    Home,
    Briefcase,
    Loader2,
    MoreVertical,
    Check,
    AlertCircle,
    ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { userService, Address } from "@/services/userService";
import { handleCustomError, showSuccess, showInfo } from "@/lib/toastUtils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function AddressManagement() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
    const [isFetchingPincode, setIsFetchingPincode] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Omit<Address, 'id'>>({
        label: "Home",
        fullName: "",
        phone: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        zipCode: "",
        isDefault: false
    });

    useEffect(() => {
        if (user) {
            loadAddresses();
        }
    }, [user]);

    async function loadAddresses() {
        if (!user) return;
        try {
            const saved = await userService.getSavedAddresses(user.uid);
            // To show the latest added first, we reverse the list (assuming push order)
            // then put the default address at the very top.
            const sorted = [...saved].reverse().sort((a, b) => {
                if (a.isDefault) return -1;
                if (b.isDefault) return 1;
                return 0;
            });
            setAddresses(sorted);
        } catch (error) {
            handleCustomError(error, "Failed to load addresses.");
        } finally {
            setLoading(false);
        }
    }

    const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
        setFormData(prev => ({ ...prev, zipCode: pin }));

        if (pin.length === 6) {
            setIsFetchingPincode(true);
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                const data = await response.json();
                if (data[0].Status === "Success") {
                    const { District, State } = data[0].PostOffice[0];
                    setFormData(prev => ({ ...prev, city: District, state: State }));
                }
            } catch (error) {
                console.error("Failed to fetch location data:", error);
            } finally {
                setIsFetchingPincode(false);
            }
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, phone: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsAdding(true);
        try {
            await userService.addAddress(user.uid, formData);
            showSuccess("Address added successfully!");
            setFormData({
                label: "Home",
                fullName: "",
                phone: "",
                street: "",
                landmark: "",
                city: "",
                state: "",
                zipCode: "",
                isDefault: false
            });
            loadAddresses();
            setDialogOpen(false); // Close dialog Automatically
        } catch (error) {
            handleCustomError(error, "Failed to add address.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user) return;
        try {
            await userService.deleteAddress(user.uid, id);
            showSuccess("Address removed.");
            loadAddresses();
        } catch (error) {
            handleCustomError(error, "Failed to remove address.");
        }
    };

    const handleSetDefault = async (id: string) => {
        if (!user) return;
        try {
            await userService.updateAddress(user.uid, id, { isDefault: true });
            showSuccess("Default address updated.");
            loadAddresses();
        } catch (error) {
            handleCustomError(error, "Failed to update default address.");
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container py-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container px-4 py-8 max-w-4xl mx-auto min-h-screen">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-display font-bold">My Addresses</h1>
                        <p className="text-sm text-muted-foreground">Manage your delivery and pickup locations</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Add Address Card */}
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <button
                                onClick={() => setDialogOpen(true)}
                                className="order-last md:order-none flex flex-col items-center justify-center gap-3 h-48 border-2 border-dashed border-border rounded-2xl hover:border-orange-500 hover:bg-orange-50/20 transition-all text-muted-foreground hover:text-orange-600"
                            >
                                <Plus className="w-10 h-10" />
                                <span className="font-bold">Add New Address</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] overflow-y-auto max-h-[90vh] p-0 rounded-2xl border-none shadow-2xl">
                            <DialogHeader className="p-6 border-b bg-muted/20">
                                <DialogTitle className="text-xl font-bold font-display">Add Delivery Address</DialogTitle>
                                <DialogDescription className="text-xs">Enter your address details for pickup and delivery.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            placeholder="John Doe"
                                            required
                                            className="h-11 rounded-xl"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            placeholder="10-digit mobile number"
                                            required
                                            type="tel"
                                            className="h-11 rounded-xl"
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="street" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Street Address</Label>
                                    <Input
                                        id="street"
                                        placeholder="Flat No, Building, Street Name"
                                        required
                                        className="h-11 rounded-xl"
                                        value={formData.street}
                                        onChange={e => setFormData({ ...formData, street: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="landmark" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Landmark (Optional)</Label>
                                    <Input
                                        id="landmark"
                                        placeholder="Near City Park"
                                        className="h-11 rounded-xl"
                                        value={formData.landmark}
                                        onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="zipCode" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pin Code</Label>
                                        <div className="relative">
                                            <Input
                                                id="zipCode"
                                                placeholder="500001"
                                                required
                                                className="h-11 rounded-xl"
                                                value={formData.zipCode}
                                                onChange={handlePincodeChange}
                                            />
                                            {isFetchingPincode && <Loader2 className="w-4 h-4 text-orange-500 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City</Label>
                                        <Input
                                            id="city"
                                            placeholder="City"
                                            required
                                            className="h-11 rounded-xl"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="state" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State</Label>
                                        <Input
                                            id="state"
                                            placeholder="State"
                                            required
                                            className="h-11 rounded-xl"
                                            value={formData.state}
                                            onChange={e => setFormData({ ...formData, state: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Address Label</Label>
                                    <div className="flex gap-2">
                                        {["Home", "Work", "Other"].map(l => (
                                            <button
                                                key={l}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, label: l })}
                                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${formData.label === l
                                                    ? "bg-orange-500 border-orange-500 text-white shadow-orange-glow"
                                                    : "border-border bg-white hover:border-orange-200"
                                                    }`}
                                            >
                                                {l === "Home" ? "Home" : l === "Work" ? "Office" : "Other"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={formData.isDefault}
                                        onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <Label htmlFor="isDefault" className="text-xs font-medium cursor-pointer flex-1">Set as default delivery address</Label>
                                </div>
                                <DialogFooter className="pt-2">
                                    <Button type="submit" className="w-full h-12 rounded-xl text-sm font-bold shadow-lg bg-orange-500 hover:bg-orange-600 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all" disabled={isAdding}>
                                        {isAdding ? "Saving..." : "Save Delivery Address"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Address List */}
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`p-6 rounded-2xl border bg-card shadow-sm relative group hover:shadow-md transition-all ${addr.isDefault ? "border-orange-200 bg-orange-50/10" : "border-border"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg ${addr.isDefault ? "bg-orange-100 text-orange-600" : "bg-muted text-muted-foreground"}`}>
                                        {addr.label === "Home" ? <Home className="w-4 h-4" /> : addr.label === "Work" ? <Briefcase className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{addr.label}</h3>
                                        {addr.isDefault && <Badge variant="secondary" className="text-[10px] bg-orange-100 text-orange-700 hover:bg-orange-100">Default</Badge>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {!addr.isDefault && (
                                        <Button variant="ghost" size="sm" onClick={() => handleSetDefault(addr.id)} className="text-[10px] h-auto py-1">
                                            Set Default
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setAddressToDelete(addr.id)}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="font-bold text-sm">{addr.fullName}</p>
                                <p className="text-sm text-foreground/80">{addr.street}</p>
                                {addr.landmark && <p className="text-xs text-muted-foreground">{addr.landmark}</p>}
                                <p className="text-sm text-foreground/80">{addr.city}, {addr.state} - {addr.zipCode}</p>
                                <p className="text-sm font-bold mt-2">{addr.phone}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {addresses.length === 0 && !loading && (
                    <div className="text-center py-16 bg-muted/20 rounded-3xl border border-dashed border-border mt-8">
                        <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-bold">No saved addresses</h3>
                        <p className="text-muted-foreground">Add your first address to enjoy faster checkouts</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={!!addressToDelete} onOpenChange={(open) => !open && setAddressToDelete(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Address?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this address? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => addressToDelete && handleDelete(addressToDelete)}
                            className="bg-destructive hover:bg-destructive/90 rounded-xl"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Layout>
    );
}
