import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
};

export const GlowButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none",
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-6 text-sm",
          size === "lg" && "h-13 px-8 text-base",
          variant === "primary" && "glow-button",
          variant === "ghost" &&
            "glass-card hover:bg-white/8 text-foreground border border-white/10 hover:border-white/18 transition-all hover:-translate-y-0.5 hover:shadow-lg",
          variant === "accent" &&
            "bg-gradient-to-r from-cyan-500/20 to-accent/20 border border-accent/30 text-accent hover:border-accent/50 hover:bg-accent/15 hover:-translate-y-0.5 transition-all",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
GlowButton.displayName = "GlowButton";
