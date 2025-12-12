import { useState } from "react";
import { Ruler, Info, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { toast } from "sonner";

interface Measurements {
  bust: string;
  waist: string;
  hips: string;
  shoulderWidth: string;
  armLength: string;
  blouseLength: string;
  neckDepthFront: string;
  neckDepthBack: string;
}

export default function Measurements() {
  const [measurements, setMeasurements] = useState<Measurements>({
    bust: "",
    waist: "",
    hips: "",
    shoulderWidth: "",
    armLength: "",
    blouseLength: "",
    neckDepthFront: "",
    neckDepthBack: "",
  });

  const handleChange = (field: keyof Measurements, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filled = Object.values(measurements).filter((v) => v).length;
    if (filled < 4) {
      toast.error("Please fill at least 4 measurements");
      return;
    }
    toast.success("Measurements saved successfully!", {
      description: "You can now use these for your orders",
    });
  };

  const measurementFields = [
    { key: "bust", label: "Bust/Chest", hint: "Measure around the fullest part" },
    { key: "waist", label: "Waist", hint: "Natural waistline, usually above navel" },
    { key: "hips", label: "Hips", hint: "Fullest part around hip bones" },
    { key: "shoulderWidth", label: "Shoulder Width", hint: "From shoulder point to point" },
    { key: "armLength", label: "Arm Length", hint: "Shoulder to wrist" },
    { key: "blouseLength", label: "Blouse/Top Length", hint: "Shoulder to desired length" },
    { key: "neckDepthFront", label: "Neck Depth (Front)", hint: "Base of neck to desired depth" },
    { key: "neckDepthBack", label: "Neck Depth (Back)", hint: "Base of neck to desired depth" },
  ];

  return (
    <Layout>
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
            <Ruler className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Measurement Guide</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Accurate measurements are key to a perfect fit. Follow our guide or use our upcoming 
            AI-powered measurement tool for precise results.
          </p>
        </div>

        {/* AI Coming Soon Banner */}
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center gap-4">
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

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Instructions */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">How to Measure</h2>
            <div className="space-y-4">
              {[
                "Use a soft measuring tape for accurate measurements",
                "Stand naturally, don't hold your breath",
                "Measure over undergarments for the best fit",
                "Get help from someone for back measurements",
                "Round up to the nearest 0.5 inch or 1 cm",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-accent/10 rounded-xl">
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
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Enter Your Measurements</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {measurementFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    <div className="relative">
                      <Input
                        id={field.key}
                        type="text"
                        placeholder="e.g., 36"
                        value={measurements[field.key as keyof Measurements]}
                        onChange={(e) => handleChange(field.key as keyof Measurements, e.target.value)}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        inches
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{field.hint}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex gap-4">
                <Button type="submit" variant="gold" size="lg" className="flex-1">
                  <Check className="w-4 h-4 mr-2" /> Save Measurements
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
