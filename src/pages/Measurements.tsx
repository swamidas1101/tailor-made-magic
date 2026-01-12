import { useState } from "react";
import { Ruler, Info, Sparkles, Check, Shirt, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Category-specific measurement configurations
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
    
    // Save to localStorage
    localStorage.setItem(`tailo_measurements_${activeCategory}`, JSON.stringify(categoryMeasurements));
    
    toast.success(`${measurementCategories[activeCategory].name} measurements saved!`, {
      description: "You can use these for your orders",
    });
  };

  const currentCategory = measurementCategories[activeCategory];
  const currentMeasurements = measurements[activeCategory];
  const filledCount = Object.values(currentMeasurements).filter((v) => v).length;

  return (
    <Layout>
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
            <Ruler className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Save Your Measurements</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Accurate measurements are key to a perfect fit. Select your garment type below and enter your measurements once – use them for all future orders!
          </p>
        </div>

        {/* AI Coming Soon Banner */}
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-display font-bold text-lg mb-1">AI Measurement Coming Soon!</h3>
            <p className="text-sm text-muted-foreground">
              Take a photo and let our AI calculate your measurements automatically. No tape measure needed!
            </p>
          </div>
          <Button variant="outline" disabled>
            Coming Soon
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as CategoryKey)} className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-8">
            {(Object.keys(measurementCategories) as CategoryKey[]).map((key) => {
              const cat = measurementCategories[key];
              const saved = localStorage.getItem(`tailo_measurements_${key}`);
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex-1 min-w-[140px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-3 rounded-xl border border-border data-[state=active]:border-primary transition-all"
                >
                  <span className="text-lg mr-2">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                  {saved && <Check className="w-4 h-4 ml-2 text-green-500" />}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(Object.keys(measurementCategories) as CategoryKey[]).map((key) => {
            const cat = measurementCategories[key];
            return (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="grid lg:grid-cols-2 gap-10">
                  {/* Instructions */}
                  <div>
                    <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                      <span className="text-2xl">{cat.icon}</span> {cat.name} Measurements
                    </h2>
                    <div className="space-y-3 mb-6">
                      {[
                        "Use a soft measuring tape for accurate measurements",
                        "Stand naturally, don't hold your breath",
                        "Measure over undergarments for the best fit",
                        "Get help from someone for back measurements",
                        "Round up to the nearest 0.5 inch or 1 cm",
                      ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-bold">
                            {i + 1}
                          </div>
                          <p className="text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-5 bg-accent/10 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-2">Need Help?</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Not sure how to measure? Schedule a video call with our expert and we'll guide you through the process.
                          </p>
                          <Button variant="outline" size="sm">
                            Schedule Video Call
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-6 p-4 bg-muted/30 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Completion</span>
                        <span className="text-sm text-muted-foreground">{filledCount}/{cat.fields.length} filled</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${(filledCount / cat.fields.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div>
                    <div className="bg-card p-6 rounded-2xl shadow-soft">
                      <h3 className="font-display font-bold text-lg mb-4">Enter Your {cat.name} Measurements</h3>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {cat.fields.map((field) => (
                            <div key={field.key} className="space-y-1.5">
                              <Label htmlFor={`${key}-${field.key}`} className="text-sm font-medium">
                                {field.label}
                              </Label>
                              <div className="relative">
                                <Input
                                  id={`${key}-${field.key}`}
                                  type="text"
                                  placeholder="e.g., 36"
                                  value={measurements[key]?.[field.key] || ""}
                                  onChange={(e) => handleChange(key, field.key, e.target.value)}
                                  className="pr-14"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                  inches
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{field.hint}</p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 flex gap-3">
                          <Button type="submit" variant="gold" size="lg" className="flex-1">
                            <Check className="w-4 h-4 mr-2" /> Save {cat.name} Measurements
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

        {/* Quick Links */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-muted/30 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shirt className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Ready to Order?</h3>
              <p className="text-sm text-muted-foreground">Browse our collection and place your order</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/categories">Shop Now</a>
            </Button>
          </div>
          <div className="bg-muted/30 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Need Bulk Orders?</h3>
              <p className="text-sm text-muted-foreground">Uniforms for schools, offices & institutions</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/uniforms">Uniforms</a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
