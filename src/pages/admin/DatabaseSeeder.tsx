import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Database, CheckCircle2, AlertCircle } from "lucide-react";
import { runFullMigration, migrateCategories, migrateFilters } from "@/scripts/migrateData";

/**
 * Database Seeder Component
 * Admin tool to populate Firestore with initial data
 */
export default function DatabaseSeeder() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleFullMigration = async () => {
        setLoading(true);
        setStatus("idle");

        try {
            await runFullMigration();
            setStatus("success");
            toast.success("Database seeded successfully!");
        } catch (error) {
            console.error("Migration error:", error);
            setStatus("error");
            toast.error("Failed to seed database");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoriesOnly = async () => {
        setLoading(true);
        setStatus("idle");

        try {
            await migrateCategories();
            setStatus("success");
            toast.success("Categories seeded successfully!");
        } catch (error) {
            console.error("Migration error:", error);
            setStatus("error");
            toast.error("Failed to seed categories");
        } finally {
            setLoading(false);
        }
    };

    const handleFiltersOnly = async () => {
        setLoading(true);
        setStatus("idle");

        try {
            await migrateFilters();
            setStatus("success");
            toast.success("Filters seeded successfully!");
        } catch (error) {
            console.error("Migration error:", error);
            setStatus("error");
            toast.error("Failed to seed filters");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="w-6 h-6" />
                        Database Seeder
                    </CardTitle>
                    <CardDescription>
                        Populate Firestore with initial categories and filter data.
                        Run this once to set up the database.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Status Indicator */}
                    {status === "success" && (
                        <div className="flex items-center gap-2 p-4 bg-green-50 text-green-900 rounded-lg border border-green-200">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">Migration completed successfully!</span>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-900 rounded-lg border border-red-200">
                            <AlertCircle className="w-5 h-5" />
                            <span className="font-medium">Migration failed. Check console for details.</span>
                        </div>
                    )}

                    {/* Migration Options */}
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">Full Migration</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Seed both categories and filters. Recommended for first-time setup.
                            </p>
                            <Button
                                onClick={handleFullMigration}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Migrating...
                                    </>
                                ) : (
                                    "Run Full Migration"
                                )}
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold mb-2">Categories Only</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Seed only category data (Women's & Men's).
                                </p>
                                <Button
                                    onClick={handleCategoriesOnly}
                                    disabled={loading}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Migrating...
                                        </>
                                    ) : (
                                        "Seed Categories"
                                    )}
                                </Button>
                            </div>

                            <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold mb-2">Filters Only</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Seed only filter groups and options.
                                </p>
                                <Button
                                    onClick={handleFiltersOnly}
                                    disabled={loading}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Migrating...
                                        </>
                                    ) : (
                                        "Seed Filters"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="p-4 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
                        <p className="text-sm font-medium">⚠️ Warning</p>
                        <p className="text-sm mt-1">
                            Running this migration will create new documents in Firestore.
                            Make sure you haven't already seeded the database to avoid duplicates.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
