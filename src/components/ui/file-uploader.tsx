import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { X, Upload, Eye, Trash2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ElementType } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
    DialogHeader
} from "@/components/ui/dialog";

export interface FileUploaderProps {
    label: string;
    value: string;
    onChange: (base64: string) => void;
    onRemove: () => void;
    icon?: ElementType;
    className?: string; // Additional classes for the container
    aspectRatio?: string; // Deprecated but kept for compatibility
    description?: string;
}

export const FileUploader = ({
    label,
    value,
    onChange,
    onRemove,
    icon: Icon = Upload,
    className,
    description
}: FileUploaderProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file.");
            return;
        }
        // Max size check (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => onChange(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleUploadClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className={cn("space-y-1.5", className)}>
            <Label className="text-xs font-medium text-muted-foreground">{label}</Label>

            <div className="flex items-center gap-3">
                {!value ? (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleUploadClick}
                        className="h-9 w-full justify-start text-muted-foreground hover:text-foreground border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
                    >
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="text-xs">Click to upload {label}</span>
                    </Button>
                ) : (
                    <div className="flex items-center gap-2 w-full">
                        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-9 flex-1 justify-start text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                                >
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    <span className="text-xs font-medium truncate">Image Uploaded</span>
                                    <Eye className="w-3.5 h-3.5 ml-auto opacity-70" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
                                <DialogHeader className="sr-only">
                                    <DialogTitle>Image Preview</DialogTitle>
                                    <DialogDescription>Preview of uploaded {label}</DialogDescription>
                                </DialogHeader>
                                <div className="relative flex items-center justify-center min-h-[50vh] bg-black/80 rounded-lg backdrop-blur-sm p-4" onClick={() => setPreviewOpen(false)}>
                                    <img
                                        src={value}
                                        alt={label}
                                        className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
                                    />
                                    <p className="absolute bottom-4 text-white/70 text-xs bg-black/50 px-3 py-1 rounded-full">Click anywhere to close</p>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-9 w-9 shrink-0"
                            onClick={onRemove}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }}
            />

            {description && !value && <p className="text-[10px] text-muted-foreground leading-tight italic px-1">{description}</p>}
        </div>
    );
};
