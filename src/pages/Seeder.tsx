import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedingService } from "@/services/seedingService";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

export default function Seeder() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("Idle");
    const { user } = useAuth();

    const handleSeed = async () => {
        if (!confirm("This will overwrite/add data to your Firestore. Continue?")) return;

        setLoading(true);
        setStatus("Seeding...");

        try {
            const success = await seedingService.seedAll();
            if (success) {
                toast.success("Database seeded successfully!");
                setStatus("Success!");
            } else {
                toast.error("Seeding failed. Check console.");
                setStatus("Failed.");
            }
        } catch (error) {
            console.error(error);
            setStatus("Error.");
        } finally {
            setLoading(false);
        }
    };

    const handleSeedTailorDesigns = async () => {
        if (!user) {
            toast.error("You must be logged in as a tailor.");
            return;
        }
        if (!confirm("This will add mock designs to your account. Continue?")) return;

        setLoading(true);
        setStatus("Seeding Tailor Designs...");

        try {
            const success = await seedingService.seedTailorDesigns(user.uid);
            if (success) {
                toast.success("Mock designs added to your portfolio!");
                setStatus("Success!");
            } else {
                toast.error("Failed to seed. Check console.");
                setStatus("Failed.");
            }
        } catch (error) {
            console.error(error);
            setStatus("Error.");
        } finally {
            setLoading(false);
        }
    };

    const handleWipeAndSeed = async () => {
        if (!user) {
            toast.error("You must be logged in as a tailor.");
            return;
        }
        if (!confirm("This will PERMANENTLY DELETE all your current designs and replace them with fresh mock data. Are you sure?")) return;

        setLoading(true);
        setStatus("Wiping and Re-seeding...");

        try {
            setStatus("Clearing current designs...");
            await seedingService.wipeTailorDesigns(user.uid);

            setStatus("Seeding fresh mock data...");
            const success = await seedingService.seedTailorDesigns(user.uid);

            if (success) {
                toast.success("Portfolio reset and re-seeded successfully!");
                setStatus("Success!");
            } else {
                toast.error("Wipe successful, but seeding failed.");
                setStatus("Partial Failure.");
            }
        } catch (error) {
            console.error(error);
            setStatus("Error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container py-20 text-center">
                <h1 className="text-4xl font-bold mb-8">Database Seeder</h1>
                <div className="max-w-md mx-auto p-8 border rounded-xl shadow-lg">
                    <p className="mb-6 text-muted-foreground text-sm">
                        Click the button below to populate the Firestore database with initial mock data.
                        For tailors: use the options below to manage your personal portfolio with the latest standardized format (Capitalized categories, enriched features, etc.).
                    </p>

                    <div className="mb-6">
                        <span className="font-mono bg-muted px-2 py-1 rounded">Status: {status}</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button
                            size="lg"
                            onClick={handleSeed}
                            disabled={loading}
                        >
                            {loading ? "Seeding..." : "Seed Database (Global)"}
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            onClick={handleSeedTailorDesigns}
                            disabled={loading || !user}
                        >
                            {loading ? "Seeding..." : "Seed My Tailor Designs"}
                        </Button>

                        <Button
                            size="lg"
                            variant="destructive"
                            onClick={handleWipeAndSeed}
                            disabled={loading || !user}
                            className="w-full flex flex-col items-center py-6 h-auto"
                        >
                            <span className="font-bold">{loading && status.includes("Wiping") ? "Wiping..." : "Reset Portfolio (Standardized Format)"}</span>
                            <span className="text-[10px] opacity-80 mt-1">Removes existing & adds new designs with enriched fields</span>
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
