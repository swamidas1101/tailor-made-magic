import { useState } from "react";
import { Link } from "react-router-dom";
import { Ruler, Info, Sparkles, Check, Shirt, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SizeChartModal } from "@/components/size-chart/SizeChartModal";
import { toast } from "sonner";
const measurementCategories = {
  blouse: {
    name: "Blouse",
    icon: "👚",
    fields: [
      { key: "bust", label: "Bust", hint: "Measure around the fullest part of the bust" },
      { key: "underBust", label: "Under Bust", hint: "Measure just below the bust" },
      { key: "waist", label: "Waist", hint: "Natural waistline, usually above navel" },
      { key: "shoulderWidth", label: "Shoulder Width", hint: "From shoulder point to point" },
      { key: "armhole", label: "Armhole", hint: "Around the arm where sleeve attaches" },
      { key: "sleeveLength", label: "Sleeve Length", hint: "Shoulder to desired length" },
      { key: "bicep", label: "Bicep", hint: "Around the fullest part of upper arm" },
      { key: "blouseLength", label: "Blouse Length", hint: "Shoulder to desired length" },
      { key: "neckDepthFront", label: "Front Neck Depth", hint: "Base of neck to desired depth" },
      { key: "neckDepthBack", label: "Back Neck Depth", hint: "Base of neck to desired depth" },
    ],
  },
  kurti: {
    name: "Kurti/Kurta",
    icon: "👗",
    fields: [
      { key: "bust", label: "Bust/Chest", hint: "Around the fullest part" },
      { key: "waist", label: "Waist", hint: "Natural waistline" },
      { key: "hips", label: "Hips", hint: "Around the fullest part of hips" },
      { key: "shoulderWidth", label: "Shoulder Width", hint: "From shoulder point to point" },
      { key: "armhole", label: "Armhole", hint: "Around the arm opening" },
      { key: "sleeveLength", label: "Sleeve Length", hint: "Shoulder to desired length" },
      { key: "bicep", label: "Bicep", hint: "Fullest part of upper arm" },
      { key: "kurtiLength", label: "Kurti Length", hint: "Shoulder to desired hem" },
      { key: "bottomWidth", label: "Bottom Width", hint: "Width at hemline" },
      { key: "slitLength", label: "Side Slit Length", hint: "Length of side slits" },
    ],
  },
  saree: {
    name: "Saree Blouse",
    icon: "🥻",
    fields: [
      { key: "bust", label: "Bust", hint: "Measure around the fullest part" },
      { key: "underBust", label: "Under Bust", hint: "Measure just below the bust" },
      { key: "waist", label: "Waist", hint: "Natural waistline" },
      { key: "shoulderWidth", label: "Shoulder Width", hint: "Point to point" },
      { key: "armhole", label: "Armhole", hint: "Around arm opening" },
      { key: "sleeveLength", label: "Sleeve Length", hint: "As per your preference" },
      { key: "blouseLength", label: "Blouse Length", hint: "Shoulder to lower edge" },
      { key: "neckDepthFront", label: "Front Neck Depth", hint: "Customize for your saree" },
      { key: "neckDepthBack", label: "Back Neck Depth", hint: "Deep or regular" },
      { key: "neckWidth", label: "Neck Width", hint: "Width of neckline" },
    ],
  },
  mensShirt: {
    name: "Men's Shirt",
    icon: "👔",
    fields: [
      { key: "chest", label: "Chest", hint: "Around the fullest part" },
      { key: "waist", label: "Waist", hint: "Around natural waistline" },
      { key: "neck", label: "Neck", hint: "Around the base of neck" },
      { key: "shoulderWidth", label: "Shoulder Width", hint: "Point to point" },
      { key: "sleeveLength", label: "Sleeve Length", hint: "Shoulder to wrist" },
      { key: "bicep", label: "Bicep", hint: "Fullest part of upper arm" },
      { key: "wrist", label: "Wrist", hint: "Around the wrist" },
      { key: "shirtLength", label: "Shirt Length", hint: "Shoulder to desired hem" },
      { key: "armhole", label: "Armhole", hint: "Around arm opening" },
    ],
  },
  mensPant: {
    name: "Men's Pants",
    icon: "👖",
    fields: [
      { key: "waist", label: "Waist", hint: "Where you wear your pants" },
      { key: "hips", label: "Hips/Seat", hint: "Fullest part around seat" },
      { key: "inseam", label: "Inseam", hint: "Crotch to ankle" },
      { key: "outseam", label: "Outseam", hint: "Waist to ankle (side)" },
      { key: "thigh", label: "Thigh", hint: "Fullest part of thigh" },
      { key: "knee", label: "Knee", hint: "Around the knee" },
      { key: "calf", label: "Calf", hint: "Fullest part of calf" },
      { key: "bottomOpening", label: "Bottom Opening", hint: "Pant opening at ankle" },
      { key: "crotchDepth", label: "Crotch Depth", hint: "Waist to seat when sitting" },
    ],
  },
  uniform: {
    name: "Uniform",
    icon: "🎓",
    fields: [
      { key: "chest", label: "Chest", hint: "Around the fullest part" },
      { key: "waist", label: "Waist", hint: "Natural waistline" },
      { key: "hips", label: "Hips", hint: "Around seat (for pants)" },
      { key: "shoulderWidth", label: "Shoulder Width", hint: "Point to point" },
      { key: "sleeveLength", label: "Sleeve Length", hint: "Shoulder to wrist" },
      { key: "shirtLength", label: "Shirt/Top Length", hint: "Shoulder to hem" },
      { key: "pantLength", label: "Pant Length", hint: "Waist to ankle" },
      { key: "inseam", label: "Inseam", hint: "For pants/trousers" },
      { key: "neck", label: "Neck", hint: "Around base of neck" },
    ],
  },
};

type CategoryKey = keyof typeof measurementCategories;

export default function Measurements() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("blouse");
  const [measurements, setMeasurements] = useState<Record<string, Record<string, string>>>({
    blouse: {},
    kurti: {},
    saree: {},
    mensShirt: {},
    mensPant: {},
    uniform: {},
  });

  const handleChange = (category: CategoryKey, field: string, value: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryMeasurements = measurements[activeCategory];
    const filled = Object.values(categoryMeasurements).filter((v) => v).length;
    const required = measurementCategories[activeCategory].fields.length;
    
    if (filled < Math.min(4, required)) {
      toast.error("Please fill at least 4 measurements");
      return;
    }
    
    localStorage.setItem(`tailo_measurements_${activeCategory}`, JSON.stringify(categoryMeasurements));
    toast.success(`${measurementCategories[activeCategory].name} measurements saved!`);
  };

  const currentCategory = measurementCategories[activeCategory];
  const currentMeasurements = measurements[activeCategory];
  const filledCount = Object.values(currentMeasurements).filter((v) => v).length;

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
          <SizeChartModal defaultCategory={activeCategory} />
        </div>

        {/* Category Tabs - Scrollable on mobile */}
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as CategoryKey)} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 mb-6">
            <TabsList className="inline-flex h-auto gap-2 bg-transparent p-0 min-w-max">
              {(Object.keys(measurementCategories) as CategoryKey[]).map((key) => {
                const cat = measurementCategories[key];
                const saved = localStorage.getItem(`tailo_measurements_${key}`);
                return (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white px-3 py-2 rounded-lg border border-border data-[state=active]:border-transparent transition-all text-xs md:text-sm whitespace-nowrap"
                  >
                    <span className="mr-1.5">{cat.icon}</span>
                    <span>{cat.name}</span>
                    {saved && <Check className="w-3 h-3 ml-1.5 text-green-400" />}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {(Object.keys(measurementCategories) as CategoryKey[]).map((key) => {
            const cat = measurementCategories[key];
            return (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="grid lg:grid-cols-5 gap-6">
                  {/* Instructions - Collapsible on mobile, sidebar on desktop */}
                  <div className="lg:col-span-2 order-2 lg:order-1">
                    {/* Progress - Always visible */}
                    <div className="p-3 bg-muted/30 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium">Progress</span>
                        <span className="text-xs text-muted-foreground">{filledCount}/{cat.fields.length}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                          style={{ width: `${(filledCount / cat.fields.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Tips - Hidden on mobile */}
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

                    {/* Help Card */}
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

                  {/* Form - Primary on mobile */}
                  <div className="lg:col-span-3 order-1 lg:order-2">
                    <div className="bg-card p-4 md:p-6 rounded-xl shadow-soft">
                      <h3 className="font-display font-bold text-sm md:text-base mb-4 flex items-center gap-2">
                        <span>{cat.icon}</span> {cat.name} Measurements
                      </h3>
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {cat.fields.map((field) => (
                            <div key={field.key} className="space-y-1">
                              <Label htmlFor={`${key}-${field.key}`} className="text-xs font-medium">
                                {field.label}
                              </Label>
                              <div className="relative">
                                <Input
                                  id={`${key}-${field.key}`}
                                  type="text"
                                  placeholder="e.g., 36"
                                  value={measurements[key]?.[field.key] || ""}
                                  onChange={(e) => handleChange(key, field.key, e.target.value)}
                                  className="pr-10 h-9 text-sm"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                                  in
                                </span>
                              </div>
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
            );
          })}
        </Tabs>

        {/* Quick Links - Fixed layout */}
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
