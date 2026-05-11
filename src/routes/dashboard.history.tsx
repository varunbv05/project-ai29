import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, X, History } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getRevisions } from "@/lib/firestore";
import { RevisionResult, type Revision } from "@/components/RevisionResult";

export const Route = createFileRoute("/dashboard/history")({
  component: HistoryPage,
});

function CardSkeleton() {
  return <div className="glass-card p-5 h-44 shimmer rounded-2xl" />;
}

function HistoryPage() {
  const { user } = useAuth();
  const uid = user?.uid ?? "";
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<Revision | null>(null);

  const { data: revisions = [], isLoading } = useQuery({
    queryKey: ["history", uid],
    queryFn: () => getRevisions(uid),
    enabled: !!uid,
  });

  const subjects = useMemo(
    () => Array.from(new Set(revisions.map((r) => r.subject))).slice(0, 8),
    [revisions],
  );

  const filtered = revisions.filter((r) => {
    if (filter && r.subject !== filter) return false;
    if (!q) return true;
    const t = q.toLowerCase();
    return r.subject.toLowerCase().includes(t) || r.chapter.toLowerCase().includes(t) || r.summary.toLowerCase().includes(t);
  });

  return (
    <div className="max-w-6xl mx-auto page-enter">
      <div className="mb-8">
        <div className="section-label mb-3">
          <History className="w-3 h-3" /> Library
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Revision history</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">Every pack you've generated — instantly searchable.</p>
      </div>

      <div className="glass-card-strong p-3 flex flex-wrap items-center gap-2 mb-6">
        <div className="flex-1 min-w-[180px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search subject, chapter or content…"
            className="input-field w-full pl-9 pr-4 py-2.5 text-sm"
          />
        </div>
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter(null)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${!filter ? "filter-active" : "border-white/10 text-muted-foreground hover:text-foreground hover:border-white/18"}`}
            >
              All
            </button>
            {subjects.map((s) => (
              <button key={s}
                onClick={() => setFilter(s === filter ? null : s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filter === s ? "filter-active" : "border-white/10 text-muted-foreground hover:text-foreground hover:border-white/18"}`}
              >{s}</button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-strong p-14 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl glass-card flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-muted-foreground">
            {q || filter ? "No revisions match your search." : "No revisions yet — generate your first pack!"}
          </div>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.035, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setOpen(r)}
              className="glass-card-strong p-5 text-left card-hover gradient-border group"
            >
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                <div className="w-4 h-4 rounded bg-primary/15 flex items-center justify-center">
                  <BookOpen className="w-2.5 h-2.5 text-primary" />
                </div>
                {r.subject}
                <span className="ml-auto text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
              </div>
              <div className="font-display font-semibold text-[1.05rem] leading-snug">{r.chapter}</div>
              <div className="text-sm text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                {r.summary.replace(/[#*`>]/g, "").slice(0, 160)}
              </div>
              <div className="divider my-3" />
              <div className="text-[10px] text-muted-foreground">
                {r.created_at && new Date(r.created_at).toLocaleString(undefined, {
                  month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                })}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Revision drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="w-full md:max-w-2xl h-full overflow-y-auto border-l border-white/8"
              style={{ background: "oklch(0.15 0.03 282 / 0.98)", backdropFilter: "blur(40px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="section-label mb-2"><BookOpen className="w-3 h-3" />{open.subject}</div>
                    <h2 className="font-display text-2xl font-bold">{open.chapter}</h2>
                    {open.created_at && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(open.created_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setOpen(null)}
                    className="p-2 rounded-xl hover:bg-white/8 text-muted-foreground hover:text-foreground transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <RevisionResult r={open} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
