import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedingService } from "@/services/seedingService";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";

export default function Seeder() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("Idle");

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

    return (
        <Layout>
            <div className="container py-20 text-center">
                <h1 className="text-4xl font-bold mb-8">Database Seeder</h1>
                <div className="max-w-md mx-auto p-8 border rounded-xl shadow-lg">
                    <p className="mb-6 text-muted-foreground">
                        Click the button below to populate the Firestore database with the initial mock data (Designs & Categories).
                    </p>

                    <div className="mb-6">
                        <span className="font-mono bg-muted px-2 py-1 rounded">Status: {status}</span>
                    </div>

                    <Button
                        size="lg"
                        onClick={handleSeed}
                        disabled={loading}
                    >
                        {loading ? "Seeding..." : "Seed Database"}
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
