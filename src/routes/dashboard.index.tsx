import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Flame, BookOpen, Brain, Clock, Sparkles, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getStreak, getRecentRevisions, getWeakTopics } from "@/lib/firestore";
import { StatCard } from "@/components/StatCard";
import { GlowButton } from "@/components/GlowButton";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-9 h-9 rounded-lg shimmer" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 rounded shimmer w-2/3" />
        <div className="h-2.5 rounded shimmer w-1/2" />
      </div>
    </div>
  );
}

function DashboardHome() {
  const { user } = useAuth();
  const uid = user?.uid ?? "";

  const { data: streak } = useQuery({
    queryKey: ["streak", uid],
    queryFn: () => getStreak(uid),
    enabled: !!uid,
  });

  const { data: recent = [], isLoading: recentLoading } = useQuery({
    queryKey: ["recent", uid],
    queryFn: () => getRecentRevisions(uid, 5),
    enabled: !!uid,
  });

  const { data: weak = [], isLoading: weakLoading } = useQuery({
    queryKey: ["weak", uid],
    queryFn: () => getWeakTopics(uid),
    enabled: !!uid,
  });

  const total = streak?.total_revisions ?? 0;
  const streakDays = streak?.current_streak ?? 0;
  const timeSaved = total * 25;
  const mastery = total ? Math.min(40 + total * 3, 95) : 0;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const firstName = user?.displayName?.split(" ")[0] ?? "";

  return (
    <div className="max-w-6xl mx-auto page-enter">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">
            {greeting}{firstName ? `, ${firstName}` : ""}.
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Five focused minutes is all it takes today.</p>
        </div>
        <Link to="/dashboard/generate">
          <GlowButton><Sparkles className="w-4 h-4" /> New revision</GlowButton>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Flame} label="Streak" value={streakDays} suffix="days" delay={0} />
        <StatCard icon={BookOpen} label="Revisions" value={total} delay={0.06} accent="accent" />
        <StatCard icon={Brain} label="Mastery" value={mastery} suffix="%" delay={0.12} />
        <StatCard icon={Clock} label="Time saved" value={timeSaved} suffix="min" delay={0.18} accent="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Weak topics */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          className="glass-card-strong p-6 lg:col-span-1"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h2 className="font-display font-semibold">Weak topics</h2>
          </div>
          {weakLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <div className="h-3 shimmer rounded w-1/2" />
                    <div className="h-3 shimmer rounded w-8" />
                  </div>
                  <div className="h-1.5 rounded-full shimmer" />
                </div>
              ))}
            </div>
          ) : weak.length === 0 ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              No weak topics yet. Generate a few revisions and Recall5 will start tracking.
            </p>
          ) : (
            <div className="space-y-3">
              {weak.map((w) => (
                <div key={w.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium">{w.topic}</span>
                    <span className="text-muted-foreground tabular-nums">{w.mastery}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${w.mastery}%` }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{
                        background: w.mastery < 40
                          ? "linear-gradient(90deg, oklch(0.7 0.22 20), oklch(0.78 0.18 320))"
                          : "var(--gradient-primary)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent revisions */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="glass-card-strong p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
              </div>
              <h2 className="font-display font-semibold">Recent revisions</h2>
            </div>
            <Link to="/dashboard/history" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentLoading ? (
            <div className="divide-y divide-white/5">
              {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto rounded-2xl glass-card flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-muted-foreground text-sm mb-4">No revisions yet.</div>
              <Link to="/dashboard/generate">
                <GlowButton size="sm"><Sparkles className="w-4 h-4" /> Create your first</GlowButton>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recent.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <Link
                    to="/dashboard/history"
                    className="flex items-center gap-3 py-3 hover:bg-white/4 -mx-2 px-2 rounded-lg transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary/10">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.subject} · {r.chapter}</div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {r.summary.replace(/[#*`]/g, "").slice(0, 90)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {new Date(r.created_at!).toLocaleDateString()}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
