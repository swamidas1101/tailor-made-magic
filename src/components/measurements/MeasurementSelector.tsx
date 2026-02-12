import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Ruler, Plus, ChevronRight, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { measurementService } from "@/services/measurementService";
import { categoryService } from "@/services/categoryService";
import { MeasurementConfig } from "@/types/database";

interface MeasurementSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: string;
  categoryName?: string;
  onConfirm: (measurements: Record<string, string>, isNew: boolean) => void;
}

export function MeasurementSelector({ isOpen, onClose, categoryId, categoryName, onConfirm }: MeasurementSelectorProps) {
  const [selectionMode, setSelectionMode] = useState<"choose" | "saved" | "new">("choose");
  const [savedMeasurements, setSavedMeasurements] = useState<Record<string, string> | null>(null);
  const [newMeasurements, setNewMeasurements] = useState<Record<string, string>>({});
  const [config, setConfig] = useState<MeasurementConfig | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch measurement configuration based on category
  useEffect(() => {
    const fetchConfig = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        let configId: string | undefined;

        if (categoryId) {
          const cat = await categoryService.getCategoryById(categoryId);
          configId = cat?.measurementConfigId;
        }

        if (!configId) {
          // Fallback to name-based lookup if ID search fails
          const configs = await measurementService.getMeasurementConfigs();
          const nameMatch = configs.find(c =>
            c.name.toLowerCase().includes(categoryName?.toLowerCase() || "") ||
            categoryName?.toLowerCase().includes(c.name.toLowerCase())
          );
          if (nameMatch) {
            setConfig(nameMatch);
          } else {
            // Default to first active if still no match
            const active = await measurementService.getActiveMeasurementConfigs();
            if (active.length > 0) setConfig(active[0]);
          }
        } else {
          const configData = await measurementService.getMeasurementConfigById(configId);
          setConfig(configData);
        }
      } catch (error) {
        console.error("Error fetching measurement config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [categoryId, categoryName, isOpen]);

  // Load saved measurements from localStorage when config is ready
  useEffect(() => {
    if (config && isOpen) {
      const stored = localStorage.getItem("measurements");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const key = config.name.toLowerCase();
          if (parsed[key] && Object.keys(parsed[key]).length > 0) {
            setSavedMeasurements(parsed[key]);
          } else {
            setSavedMeasurements(null);
          }
        } catch (e) {
          console.error("Error parsing saved measurements", e);
        }
      }
    }
  }, [config, isOpen]);

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
    if (!config) return;

    const filledFields = Object.values(newMeasurements).filter(v => v).length;
    const required = Math.min(4, config.fields.length);

    if (filledFields < required) {
      toast.error(`Please fill at least ${required} measurements`);
      return;
    }

    // Save to localStorage for future use
    const stored = localStorage.getItem("measurements");
    const allMeasurements = stored ? JSON.parse(stored) : {};
    allMeasurements[config.name.toLowerCase()] = newMeasurements;
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
  const totalFields = config?.fields.length || 0;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Select Measurements
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {config ? `Provide measurements for your ${config.name}` : "Choose how you'd like to provide measurements"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading measurement configuration...</p>
          </div>
        ) : !config ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No specific measurement tool found for this category.</p>
            <Button variant="outline" className="mt-4" onClick={onClose}>Close</Button>
          </div>
        ) : (
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
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${savedMeasurements
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
                          ? `${Object.keys(savedMeasurements).length} measurements saved for ${config.name}`
                          : `No saved measurements for ${config.name}`
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
                    {config.icon} {config.name}
                  </span>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-medium mb-3 text-sm">Your Saved Measurements</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-1">
                    {config.fields.map(field => (
                      <div key={field.id} className="flex justify-between text-sm py-1.5 px-2 rounded bg-background border">
                        <span className="text-muted-foreground">{field.name}</span>
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
                    {config.icon} {config.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm">
                  <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground text-xs leading-relaxed">
                    Enter at least {Math.min(4, totalFields)} measurements. Values in inches.
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
                  {config.fields.map(field => (
                    <div key={field.id} className="space-y-1">
                      <Label htmlFor={field.key} className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {field.name}
                      </Label>
                      <div className="relative">
                        <Input
                          id={field.key}
                          type="text"
                          placeholder={field.hint || "in"}
                          value={newMeasurements[field.key] || ""}
                          onChange={(e) => handleNewMeasurementChange(field.key, e.target.value)}
                          className="pr-8 h-9 text-sm focus-visible:ring-amber-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
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
                    disabled={filledCount < Math.min(4, totalFields)}
                    onClick={handleUseNew}
                  >
                    {filledCount < Math.min(4, totalFields)
                      ? `Need ${Math.min(4, totalFields) - filledCount} more`
                      : "Confirm Measurements"
                    }
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </DialogContent>
    </Dialog>
  );
}