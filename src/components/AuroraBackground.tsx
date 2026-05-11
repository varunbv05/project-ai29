export function AuroraBackground() {
  return (
    <div className="aurora-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-40"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.18 320 / 0.6), transparent 60%)" }} />
    </div>
  );
}