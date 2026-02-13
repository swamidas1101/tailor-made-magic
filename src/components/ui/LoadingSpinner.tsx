import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    showText?: boolean;
}

export function LoadingSpinner({ className, size = "md", showText = true }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-10 h-10",
        xl: "w-16 h-16"
    };

    return (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="relative"
            >
                <div className={cn(
                    "rounded-full border-2 border-orange-100",
                    sizeClasses[size]
                )} />
                <Loader2 className={cn(
                    "absolute inset-0 text-orange-500 animate-spin",
                    sizeClasses[size]
                )} />
            </motion.div>
            {showText && (
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    Loading your style...
                </p>
            )}
        </div>
    );
}
