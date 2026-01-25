import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-foreground/90 text-background hover:bg-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-transparent hover:bg-muted/50 text-foreground",
        secondary: "bg-muted text-foreground hover:bg-muted/80",
        ghost: "hover:bg-muted/50 text-foreground/80 hover:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        // Soft, elegant variants
        hero: "bg-foreground text-background hover:bg-foreground/90 font-medium",
        heroOutline: "border border-white/50 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-medium",
        gold: "bg-gold/20 text-gold-dark hover:bg-gold/30 font-medium",
        rose: "bg-foreground text-background hover:bg-foreground/90 font-medium",
        luxury: "bg-foreground text-background hover:bg-foreground/90 font-medium",
        soft: "bg-muted text-foreground hover:bg-muted/80 font-medium",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6",
        xl: "h-12 px-8 text-base font-medium",
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
