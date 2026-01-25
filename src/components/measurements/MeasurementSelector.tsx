import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Ruler, Plus, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Map design categories to measurement categories
const categoryMappings: Record<string, string> = {
  "Blouse": "blouse",
  "Kurti": "kurti",
  "Saree": "saree",
  "Frock": "kurti",
  "Lehenga": "blouse",
  "Half Saree": "blouse",
  "Suits": "kurti",
  "Men's Shirt": "mensShirt",
  "Men's Pants": "mensPant",
  "Uniform": "uniform",
};

// Category-specific measurement configurations
const measurementCategories: Record<string, {
  name: string;
  icon: string;
  fields: { key: string; label: string; hint: string }[];
}> = {
  blouse: {
    name: "Blouse",
    icon: "👚",
    fields: [
      { key: "bust", label: "Bust", hint: "Measure around the fullest part" },
      { key: "underBust", label: "Under Bust", hint: "Measure just below the bust" },
      { key: "waist", label: "Waist", hint: "Natural waistline" },
      { key: "shoulderWidth", label: "Shoulder Width", hint: "Point to point" },
      { key: "armhole", label: "Armhole", hint: "Around arm opening" },
      { key: "sleeveLength", label: "Sleeve Length", hint: "Shoulder to desired length" },
      { key: "blouseLength", label: "Blouse Length", hint: "Shoulder to hem" },
    ],
  },
  kurti: {
    name: "Kurti/Kurta",
    icon: "👗",
    fields: [
      { key: "bust", label: "Bust/Chest", hint: "Around the fullest part" },
      { key: "waist", label: "Waist", hint: "Natural waistline" },
      { key: "hips", label: "Hips", hint: "Around the fullest part" },
      { key: "shoulderWidth", label: "Shoulder Width", hint: "Point to point" },
      { key: "sleeveLength", label: "Sleeve Length", hint: "Shoulder to wrist" },
      { key: "kurtiLength", label: "Length", hint: "Shoulder to hem" },
    ],
  },
  saree: {
    name: "Saree Blouse",
    icon: "🥻",
    fields: [
      { key: "bust", label: "Bust", hint: "Fullest part" },
      { key: "underBust", label: "Under Bust", hint: "Just below bust" },
      { key: "waist", label: "Waist", hint: "Natural waistline" },
      { key: "shoulderWidth", label: "Shoulder Width", hint: "Point to point" },
      { key: "blouseLength", label: "Blouse Length", hint: "Shoulder to hem" },
    ],
  },
  mensShirt: {
    name: "Men's Shirt",
    icon: "👔",
    fields: [
      { key: "chest", label: "Chest", hint: "Around fullest part" },
      { key: "waist", label: "Waist", hint: "Natural waistline" },
      { key: "neck", label: "Neck", hint: "Around base of neck" },
      { key: "shoulderWidth", label: "Shoulder Width", hint: "Point to point" },
      { key: "sleeveLength", label: "Sleeve Length", hint: "Shoulder to wrist" },
      { key: "shirtLength", label: "Shirt Length", hint: "Shoulder to hem" },
    ],
  },
  mensPant: {
    name: "Men's Pants",
    icon: "👖",
    fields: [
      { key: "waist", label: "Waist", hint: "Where you wear pants" },
      { key: "hips", label: "Hips", hint: "Fullest part" },
      { key: "inseam", label: "Inseam", hint: "Crotch to ankle" },
      { key: "thigh", label: "Thigh", hint: "Fullest part" },
      { key: "bottomOpening", label: "Bottom Opening", hint: "At ankle" },
    ],
  },
  uniform: {
    name: "Uniform",
    icon: "🎓",
    fields: [
      { key: "chest", label: "Chest", hint: "Around fullest part" },
      { key: "waist", label: "Waist", hint: "Natural waistline" },
      { key: "shoulderWidth", label: "Shoulder Width", hint: "Point to point" },
      { key: "sleeveLength", label: "Sleeve Length", hint: "Shoulder to wrist" },
      { key: "shirtLength", label: "Shirt Length", hint: "Shoulder to hem" },
    ],
  },
};

interface MeasurementSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  onConfirm: (measurements: Record<string, string>, isNew: boolean) => void;
}

export function MeasurementSelector({ isOpen, onClose, category, onConfirm }: MeasurementSelectorProps) {
  const [selectionMode, setSelectionMode] = useState<"choose" | "saved" | "new">("choose");
  const [savedMeasurements, setSavedMeasurements] = useState<Record<string, string> | null>(null);
  const [newMeasurements, setNewMeasurements] = useState<Record<string, string>>({});
  
  const measurementKey = categoryMappings[category] || "blouse";
  const measurementConfig = measurementCategories[measurementKey];

  // Load saved measurements from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("measurements");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed[measurementKey] && Object.keys(parsed[measurementKey]).length > 0) {
          setSavedMeasurements(parsed[measurementKey]);
        }
      } catch (e) {
        console.error("Error parsing saved measurements", e);
      }
    }
  }, [measurementKey, isOpen]);

  const handleNewMeasurementChange = (field: string, value: string) => {
    setNewMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handleUseSaved = () => {
    if (savedMeasurements) {
      onConfirm(savedMeasurements, false);
      onClose();
    }
  };

  const handleUseNew = () => {
    const filledFields = Object.values(newMeasurements).filter(v => v).length;
    if (filledFields < 4) {
      return;
    }
    
    // Save to localStorage for future use
    const stored = localStorage.getItem("measurements");
    const allMeasurements = stored ? JSON.parse(stored) : {};
    allMeasurements[measurementKey] = newMeasurements;
    localStorage.setItem("measurements", JSON.stringify(allMeasurements));
    
    onConfirm(newMeasurements, true);
    onClose();
  };

  const resetDialog = () => {
    setSelectionMode("choose");
    setNewMeasurements({});
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  const filledCount = Object.values(newMeasurements).filter(v => v).length;
  const totalFields = measurementConfig?.fields.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Select Measurements
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to provide measurements for your {category.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {selectionMode === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3 pt-4"
            >
              {/* Saved Measurements Option */}
              <button
                onClick={() => savedMeasurements ? setSelectionMode("saved") : null}
                disabled={!savedMeasurements}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  savedMeasurements 
                    ? "border-border hover:border-foreground/30 cursor-pointer" 
                    : "border-border/50 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Use Saved Measurements</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {savedMeasurements 
                        ? `${Object.keys(savedMeasurements).length} measurements saved for ${measurementConfig?.name}`
                        : `No saved measurements for ${measurementConfig?.name}`
                      }
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
                </div>
              </button>

              {/* New Measurements Option */}
              <button
                onClick={() => setSelectionMode("new")}
                className="w-full p-4 rounded-xl border-2 border-border hover:border-foreground/30 text-left transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Plus className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Enter New Measurements</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Provide fresh measurements for this order
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
                </div>
              </button>

              {/* Link to full measurements page */}
              <div className="pt-2 text-center">
                <Link 
                  to="/measurements" 
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                  onClick={handleClose}
                >
                  Manage all saved measurements →
                </Link>
              </div>
            </motion.div>
          )}

          {selectionMode === "saved" && savedMeasurements && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 pt-4"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectionMode("choose")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
                <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                  {measurementConfig?.icon} {measurementConfig?.name}
                </span>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="font-medium mb-3 text-sm">Your Saved Measurements</h4>
                <div className="grid grid-cols-2 gap-2">
                  {measurementConfig?.fields.map(field => (
                    <div key={field.key} className="flex justify-between text-sm py-1.5 px-2 rounded bg-background">
                      <span className="text-muted-foreground">{field.label}</span>
                      <span className="font-medium">
                        {savedMeasurements[field.key] 
                          ? `${savedMeasurements[field.key]} in` 
                          : "—"
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectionMode("new")}
                >
                  Enter New Instead
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={handleUseSaved}
                >
                  Use These Measurements
                </Button>
              </div>
            </motion.div>
          )}

          {selectionMode === "new" && (
            <motion.div
              key="new"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 pt-4"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectionMode("choose")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
                <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                  {measurementConfig?.icon} {measurementConfig?.name}
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm">
                <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  Enter at least 4 measurements. All values in inches.
                </span>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-foreground transition-all duration-300"
                    style={{ width: `${(filledCount / totalFields) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {filledCount}/{totalFields}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
                {measurementConfig?.fields.map(field => (
                  <div key={field.key} className="space-y-1">
                    <Label htmlFor={field.key} className="text-xs font-medium">
                      {field.label}
                    </Label>
                    <div className="relative">
                      <Input
                        id={field.key}
                        type="number"
                        step="0.5"
                        placeholder={field.hint}
                        value={newMeasurements[field.key] || ""}
                        onChange={(e) => handleNewMeasurementChange(field.key, e.target.value)}
                        className="pr-8 h-9 text-sm"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        in
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectionMode("choose")}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1"
                  disabled={filledCount < 4}
                  onClick={handleUseNew}
                >
                  {filledCount < 4 
                    ? `Need ${4 - filledCount} more` 
                    : "Confirm Measurements"
                  }
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}