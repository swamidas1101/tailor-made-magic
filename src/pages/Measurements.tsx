import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Ruler, Info, Sparkles, Check, Shirt, Users, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SizeChartModal } from "@/components/size-chart/SizeChartModal";
import { toast } from "sonner";
import { measurementService } from "@/services/measurementService";
import { MeasurementConfig } from "@/types/database";

export default function Measurements() {
  const [configs, setConfigs] = useState<MeasurementConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConfigId, setActiveConfigId] = useState<string>("");
  const [measurements, setMeasurements] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        const activeConfigs = await measurementService.getActiveMeasurementConfigs();
        setConfigs(activeConfigs);
        if (activeConfigs.length > 0) {
          setActiveConfigId(activeConfigs[0].id);
        }
      } catch (error) {
        toast.error("Failed to load measurement configurations");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  const handleChange = (configId: string, fieldKey: string, value: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [configId]: {
        ...prev[configId],
        [fieldKey]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentConfig = configs.find(c => c.id === activeConfigId);
    if (!currentConfig) return;

    const categoryMeasurements = measurements[activeConfigId] || {};
    const filled = Object.values(categoryMeasurements).filter((v) => v).length;
    const required = currentConfig.fields.length;

    if (filled < Math.min(4, required)) {
      toast.error("Please fill at least 4 measurements");
      return;
    }

    // Save to localStorage using the config name or ID
    const stored = localStorage.getItem("measurements");
    const allMeasurements = stored ? JSON.parse(stored) : {};
    allMeasurements[currentConfig.name.toLowerCase()] = categoryMeasurements;
    localStorage.setItem("measurements", JSON.stringify(allMeasurements));

    toast.success(`${currentConfig.name} measurements saved!`);
  };

  const activeConfig = configs.find(c => c.id === activeConfigId);
  const currentMeasurements = measurements[activeConfigId] || {};
  const filledCount = Object.values(currentMeasurements).filter((v) => v).length;

  if (loading) {
    return (
      <Layout>
        <div className="container px-4 py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading measurement tools...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-6 md:py-10">
        {/* Header - Compact */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full gradient-hero flex items-center justify-center">
            <Ruler className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl md:text-3xl font-display font-bold mb-2">Save Your Measurements</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Enter your measurements once – use them for all future orders!
          </p>
        </div>

        {/* AI Banner - with Size Chart */}
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-sm">AI Measurement Coming Soon!</h3>
            <p className="text-xs text-muted-foreground">Auto-calculate from a photo</p>
          </div>
          {activeConfig && <SizeChartModal defaultCategory={activeConfig.name.toLowerCase() as any} />}
        </div>

        {/* Category Tabs - Scrollable on mobile */}
        {configs.length > 0 ? (
          <Tabs value={activeConfigId} onValueChange={setActiveConfigId} className="w-full">
            <div className="overflow-x-auto -mx-4 px-4 mb-6">
              <TabsList className="inline-flex h-auto gap-2 bg-transparent p-0 min-w-max">
                {configs.map((config) => {
                  const saved = localStorage.getItem("measurements");
                  const isSaved = saved && JSON.parse(saved)[config.name.toLowerCase()];
                  return (
                    <TabsTrigger
                      key={config.id}
                      value={config.id}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white px-3 py-2 rounded-lg border border-border data-[state=active]:border-transparent transition-all text-xs md:text-sm whitespace-nowrap"
                    >
                      <span className="mr-1.5">{config.icon}</span>
                      <span>{config.name}</span>
                      {isSaved && <Check className="w-3 h-3 ml-1.5 text-green-400" />}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {configs.map((config) => (
              <TabsContent key={config.id} value={config.id} className="mt-0">
                <div className="grid lg:grid-cols-5 gap-6">
                  {/* Instructions */}
                  <div className="lg:col-span-2 order-2 lg:order-1">
                    <div className="p-3 bg-muted/30 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium">Progress</span>
                        <span className="text-xs text-muted-foreground">{Object.values(measurements[config.id] || {}).filter(v => v).length}/{config.fields.length}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                          style={{ width: `${(Object.values(measurements[config.id] || {}).filter(v => v).length / config.fields.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="hidden md:block space-y-2 mb-4">
                      <h4 className="font-semibold text-sm mb-2">Measuring Tips</h4>
                      {[
                        "Use a soft measuring tape",
                        "Stand naturally, don't hold breath",
                        "Measure over undergarments",
                      ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-[10px]">
                            {i + 1}
                          </div>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-accent/10 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-xs mb-1">Need Help?</h4>
                          <p className="text-[11px] text-muted-foreground mb-2">
                            Schedule a video call for guidance.
                          </p>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            Schedule Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="lg:col-span-3 order-1 lg:order-2">
                    <div className="bg-card p-4 md:p-6 rounded-xl shadow-soft">
                      <h3 className="font-display font-bold text-sm md:text-base mb-4 flex items-center gap-2">
                        <span>{config.icon}</span> {config.name} Measurements
                      </h3>
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {config.fields.map((field) => (
                            <div key={field.id} className="space-y-1">
                              <Label htmlFor={`${config.id}-${field.key}`} className="text-xs font-medium">
                                {field.name}
                              </Label>
                              <div className="relative">
                                <Input
                                  id={`${config.id}-${field.key}`}
                                  type="text"
                                  placeholder="e.g., 36"
                                  value={measurements[config.id]?.[field.key] || ""}
                                  onChange={(e) => handleChange(config.id, field.key, e.target.value)}
                                  className="pr-10 h-9 text-sm"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                                  in
                                </span>
                              </div>
                              <p className="text-[9px] text-muted-foreground leading-tight">{field.hint}</p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 mt-4 border-t border-border">
                          <Button type="submit" variant="gold" className="w-full h-10">
                            <Check className="w-4 h-4 mr-2" /> Save Measurements
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-xl">
            <Ruler className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground">No measurement tools available right now.</p>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/categories"
            className="flex-1 bg-muted/30 rounded-lg p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Ready to Order?</h3>
              <p className="text-xs text-muted-foreground">Browse our collection</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>
          <Link
            to="/uniforms"
            className="flex-1 bg-muted/30 rounded-lg p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Bulk Orders?</h3>
              <p className="text-xs text-muted-foreground">Schools & offices</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
