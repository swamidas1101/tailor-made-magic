import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useLikes } from "@/contexts/LikesContext";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
    designId: string;
    initialLikesCount: number;
    className?: string;
    size?: "sm" | "md" | "lg";
    showCount?: boolean;
    variant?: "outline" | "ghost" | "plain";
}

export function LikeButton({
    designId,
    initialLikesCount,
    className,
    size = "md",
    showCount = true,
    variant = "ghost",
}: LikeButtonProps) {
    const { toggleLike, isLiked, isProcessing, getLikesCount } = useLikes();
    const liked = isLiked(designId);
    const processing = isProcessing(designId);
    const count = getLikesCount(designId, initialLikesCount);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (processing) return;

        try {
            await toggleLike(designId);
        } catch (error) {
            // Error handling is managed by the context (toast + revert)
        }
    };

    const iconSizes = {
        sm: "w-3.5 h-3.5",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    const textSizes = {
        sm: "text-[10px]",
        md: "text-sm",
        lg: "text-base",
    };

    return (
        <button
            onClick={handleLike}
            disabled={processing}
            className={cn(
                "flex items-center gap-1.5 transition-all active:scale-125 rounded-md",
                variant === "ghost" && "px-1 py-1 hover:bg-rose-50",
                variant === "outline" && "px-3 py-1.5 border rounded-full",
                liked
                    ? variant === "outline"
                        ? "bg-rose-50 border-rose-200 text-rose-500 shadow-sm"
                        : "text-rose-500"
                    : "text-muted-foreground hover:text-foreground",
                processing && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <motion.div
                animate={liked ? {
                    scale: [1, 1.4, 0.9, 1.1, 1],
                    rotate: [0, 15, -15, 5, 0]
                } : {}}
                transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
            >
                <Heart className={cn(iconSizes[size], liked && "fill-current")} />
            </motion.div>
            {showCount && (
                <span className={cn(textSizes[size], "font-bold", liked && "text-rose-600")}>
                    {count}
                </span>
            )}
        </button>
    );
}
