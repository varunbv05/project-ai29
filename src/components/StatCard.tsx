import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  accent = "primary",
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  accent?: "primary" | "accent";
  delay?: number;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString());

  useEffect(() => {
    const c = animate(mv, value, { duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [value, mv, delay]);

  const isPrimary = accent === "primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card-strong p-5 relative overflow-hidden group card-hover"
    >
      {/* Glow orb */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-90 opacity-50 pointer-events-none"
        style={{
          background: isPrimary
            ? "var(--gradient-primary)"
            : "radial-gradient(circle, oklch(0.78 0.16 210 / 0.7), transparent 60%)",
        }}
      />

      <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-widest mb-3">
        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isPrimary ? "bg-primary/15" : "bg-accent/15"}`}>
          <Icon className={`w-3 h-3 ${isPrimary ? "text-primary" : "text-accent"}`} />
        </div>
        {label}
      </div>

      <div className="flex items-baseline gap-1">
        <motion.span className="text-4xl font-display font-bold text-foreground stat-glow">
          {rounded}
        </motion.span>
        {suffix && <span className="text-muted-foreground text-sm ml-0.5">{suffix}</span>}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: isPrimary ? "var(--gradient-primary)" : "linear-gradient(90deg, oklch(0.78 0.16 210), oklch(0.82 0.18 180))" }}
      />
    </motion.div>
  );
}
