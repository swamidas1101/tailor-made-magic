import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary/85 text-white hover:bg-primary/95 shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-primary/25 bg-transparent hover:bg-primary/5 text-primary hover:border-primary/40",
        secondary: "bg-secondary/60 text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted/50 text-foreground/80 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Premium variants - Soft & Elegant
        hero: "bg-primary/90 text-white hover:bg-primary shadow-md hover:shadow-lg font-medium",
        heroOutline: "border border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-medium",
        gold: "bg-gold/85 text-white hover:bg-gold/95 shadow-sm hover:shadow-md font-medium",
        rose: "bg-accent/85 text-white hover:bg-accent/95 shadow-sm font-medium",
        luxury: "bg-gradient-to-r from-primary/80 to-accent/80 text-white shadow-sm hover:shadow-md font-medium hover:from-primary/90 hover:to-accent/90",
        soft: "bg-primary/10 text-primary hover:bg-primary/20 font-medium",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg font-medium",
        icon: "h-11 w-11",
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
