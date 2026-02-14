import { Ruler } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MeasurementForm } from "./MeasurementForm";

interface MeasurementSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: string;
  categoryName?: string;
  onConfirm: (measurements: Record<string, string>, isNew: boolean) => void;
}

export function MeasurementSelector({ isOpen, onClose, categoryId, categoryName, onConfirm }: MeasurementSelectorProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Select Measurements
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {categoryName ? `Provide measurements for your ${categoryName}` : "Choose how you'd like to provide measurements"}
          </DialogDescription>
        </DialogHeader>

        <MeasurementForm
          categoryId={categoryId}
          categoryName={categoryName}
          onConfirm={(measurements, isNew) => {
            onConfirm(measurements, isNew);
            onClose();
          }}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}