import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlobalLoaderProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    text?: string;
}

export const GlobalLoader = ({
    className,
    size = "md",
    text = "Stitching..."
}: GlobalLoaderProps) => {
    const sizes = {
        sm: { container: "w-16 h-8", needle: "w-6 h-[1px]", stroke: "1.5" },
        md: { container: "w-32 h-16", needle: "w-10 h-[2px]", stroke: "2" },
        lg: { container: "w-48 h-24", needle: "w-14 h-[3px]", stroke: "3" },
    };

    const currentSize = sizes[size];

    return (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            <div className={cn("relative flex items-center justify-center", currentSize.container)}>
                {/* Thread Path (Fabric) */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 40"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Background Thread (Dashed) */}
                    <path
                        d="M 10 20 C 25 10, 40 30, 55 10 C 70 30, 85 10, 100 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={currentSize.stroke}
                        strokeDasharray="3 3"
                        className="text-amber-500/20"
                    />

                    {/* Animated Thread (The "Stitch") */}
                    <motion.path
                        d="M 10 20 C 25 10, 40 30, 55 10 C 70 30, 85 10, 100 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={currentSize.stroke}
                        strokeLinecap="round"
                        className="text-amber-500"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: [0, 1, 1],
                            opacity: [0, 1, 0],
                            pathOffset: [0, 0, 1]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </svg>

                {/* The Needle */}
                <motion.div
                    className="absolute left-0"
                    animate={{
                        x: [0, 80, 0],
                        y: [-2, 2, -2],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div
                        className={cn(
                            "bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-full shadow-sm relative",
                            currentSize.needle
                        )}
                    >
                        {/* Needle Eye */}
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-[3px] h-[1.5px] bg-amber-500/50 rounded-full blur-[0.5px]" />
                        {/* Pointy End */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[1px] border-y-transparent border-l-[4px] border-l-slate-400 translate-x-[2px]" />
                    </div>
                </motion.div>
            </div>

            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-amber-700/70"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
};
