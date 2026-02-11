import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Clock,
    Trash2,
    MapPin,
    CheckCircle2,
    Star,
    X,
    Edit2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DesignPreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    design: any; // We can refine this type later if needed
    onEdit: (design: any) => void;
    onDelete: (designId: string) => void;
    hideActions?: boolean;
}

export function DesignPreviewDialog({
    open,
    onOpenChange,
    design,
    onEdit,
    onDelete,
    hideActions
}: DesignPreviewDialogProps) {
    if (!design) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white gap-0">
                <div className="grid md:grid-cols-2 h-full max-h-[90vh] overflow-y-auto">
                    {/* Left Column: Image */}
                    <div className="relative bg-gray-100 min-h-[400px] md:min-h-full">
                        <img
                            src={design.image}
                            alt={design.name}
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                        {design.status && (
                            <div className="absolute top-4 right-4">
                                <Badge className={
                                    design.status === 'active' ? "bg-green-500 hover:bg-green-600" :
                                        design.status === 'pending' ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-500"
                                }>
                                    {design.status.toUpperCase()}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details */}
                    <div className="p-6 md:p-8 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <DialogTitle className="text-2xl font-serif font-bold text-gray-900 mb-1">{design.name}</DialogTitle>
                                <DialogDescription className="text-sm text-gray-500">Full details for this design</DialogDescription>
                            </div>
                        </div>

                        <div className="space-y-6 flex-1">
                            {/* Price Block */}
                            <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Price</span>
                                    <span className="text-3xl font-bold text-amber-600">₹{design.price?.toLocaleString()}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                                    <Badge variant="outline" className={
                                        design.status === 'active' ? "text-green-600 border-green-200 bg-green-50" : "text-amber-600 border-amber-200 bg-amber-50"
                                    }>
                                        {design.status?.toUpperCase() || 'UNKNOWN'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Grid Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Category</span>
                                    <p className="font-medium text-gray-900">{design.categoryName || design.category || 'Uncategorized'}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Delivery Time</span>
                                    <div className="flex items-center gap-2 font-medium text-gray-900">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {design.timeInDays} Days
                                    </div>
                                </div>
                            </div>

                            {/* Attributes / Key Features */}
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Specifications</span>
                                <div className="flex flex-wrap gap-2">
                                    {design.filters && Object.keys(design.filters).length > 0 ? (
                                        Object.entries(design.filters).map(([key, values]) => (
                                            Array.isArray(values) ? values.map((val: string) => (
                                                <Badge key={`${key}-${val}`} variant="secondary" className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-100 hover:bg-amber-100 capitalize">
                                                    {val.replace(/-/g, ' ')}
                                                </Badge>
                                            )) : null
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">No specific specs listed</span>
                                    )}
                                </div>
                            </div>


                            {/* Description */}
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Description</span>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {design.description || "No description provided for this design."}
                                </p>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        {!hideActions && (
                            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                                <Button
                                    variant="destructive"
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => onDelete(design.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700"
                                    onClick={() => onEdit(design)}
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
