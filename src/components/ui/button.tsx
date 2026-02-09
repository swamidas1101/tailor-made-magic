import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-orange-400 bg-transparent hover:bg-orange-50 text-orange-600 hover:text-orange-700",
        secondary: "bg-amber-100 text-amber-800 hover:bg-amber-200",
        ghost: "hover:bg-orange-50 text-foreground/80 hover:text-orange-600",
        link: "text-orange-600 underline-offset-4 hover:underline",
        // Vibrant gradient variants
        hero: "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 shadow-lg hover:shadow-xl font-semibold",
        heroOutline: "border-2 border-white/60 bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm font-semibold",
        gold: "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 hover:from-amber-500 hover:to-yellow-600 shadow-md font-semibold",
        rose: "bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600 shadow-md font-semibold",
        luxury: "bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white hover:from-orange-700 hover:via-amber-600 hover:to-yellow-600 shadow-lg font-semibold",
        soft: "bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium",
        white: "bg-white text-foreground hover:bg-white/90 shadow-sm font-medium",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6",
        xl: "h-12 px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
