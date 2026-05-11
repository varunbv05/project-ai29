import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { Home, Sparkles, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/AuthModal";
import { useEffect } from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const mobile = [
  { to: "/dashboard", label: "Home", icon: Home, exact: true },
  { to: "/dashboard/generate", label: "Generate", icon: Sparkles },
  { to: "/dashboard/history", label: "History", icon: History },
];

function DashboardLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthModal />;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-10 py-6 pb-28 md:pb-10">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 glass-card-strong rounded-2xl p-2 flex items-center justify-around z-30"
        style={{ boxShadow: "0 8px 30px -10px oklch(0.1 0.03 280 / 0.8), 0 0 0 1px oklch(1 0 0 / 0.08)" }}>
        {mobile.map((it) => {
          const active = it.exact ? path === it.to : path.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex flex-col items-center gap-1 px-5 py-2 rounded-xl text-[10px] transition-all",
                active ? "text-foreground bg-white/10" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <it.icon className={cn("w-5 h-5 transition-transform", active && "scale-110 text-primary")} />
              <span className={cn("font-medium", active ? "" : "font-normal")}>{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
