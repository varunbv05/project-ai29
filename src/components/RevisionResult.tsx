import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { BookOpen, Lightbulb, Sigma, Zap, GraduationCap, ChevronDown } from "lucide-react";

export type Revision = {
  id: string;
  subject: string;
  chapter: string;
  summary: string;
  key_concepts: { term: string; definition: string }[];
  formulas: { name: string; expression: string; note?: string }[];
  rapid_fire: { q: string; a: string }[];
  exam_questions: string[];
  created_at?: string;
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Section = ({
  icon: Icon,
  title,
  children,
  delay = 0,
  badge,
}: {
  icon: typeof BookOpen;
  title: string;
  children: React.ReactNode;
  delay?: number;
  badge?: string | number;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="glass-card-strong p-6"
  >
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-display font-semibold text-lg">{title}</h3>
      {badge !== undefined && (
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/12 text-primary border border-primary/20 font-medium tabular-nums">
          {badge}
        </span>
      )}
    </div>
    {children}
  </motion.section>
);

function RapidFireCard({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.button
      onClick={() => setOpen(!open)}
      className="w-full glass-card p-4 text-left card-hover"
    >
      <div className="flex items-center gap-2">
        <span className="text-primary font-mono text-sm font-bold shrink-0">Q{idx + 1}.</span>
        <span className="font-medium text-sm flex-1">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="divider mt-3 mb-2.5" />
            <div className="text-sm text-muted-foreground pl-8">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function RevisionResult({ r }: { r: Revision }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <Section icon={BookOpen} title="5-Minute Summary" delay={0}>
        <div className="markdown-body text-muted-foreground leading-relaxed space-y-3 text-sm
          [&_h1]:text-foreground [&_h1]:font-display [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:mt-2
          [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-2
          [&_h3]:text-foreground [&_h3]:font-display [&_h3]:font-semibold [&_h3]:mt-1
          [&_strong]:text-foreground [&_em]:text-foreground/85
          [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1
          [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-white/6 [&_code]:text-accent [&_code]:font-mono [&_code]:text-[0.8em]">
          <ReactMarkdown>{r.summary}</ReactMarkdown>
        </div>
      </Section>

      <Section icon={Lightbulb} title="Key Concepts" delay={0.05} badge={r.key_concepts.length}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 gap-3"
        >
          {r.key_concepts.map((c, i) => (
            <motion.div key={i} variants={itemVariants} className="glass-card p-4 card-hover gradient-border">
              <div className="font-display font-semibold text-foreground text-[0.95rem]">{c.term}</div>
              <div className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{c.definition}</div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {r.formulas.length > 0 && (
        <Section icon={Sigma} title="Formulas" delay={0.1} badge={r.formulas.length}>
          <div className="space-y-2">
            {r.formulas.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                className="glass-card p-4 flex flex-wrap items-center gap-3"
              >
                <span className="text-foreground font-medium text-sm">{f.name}</span>
                <code className="px-3 py-1.5 rounded-lg bg-accent/8 border border-accent/15 text-accent font-mono text-sm"
                  style={{ boxShadow: "0 0 10px oklch(0.78 0.16 210 / 0.08)" }}>
                  {f.expression}
                </code>
                {f.note && <span className="text-xs text-muted-foreground">{f.note}</span>}
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      <Section icon={Zap} title="Rapid-Fire Questions" delay={0.15} badge={r.rapid_fire.length}>
        <div className="space-y-2">
          {r.rapid_fire.map((q, i) => (
            <RapidFireCard key={i} q={q.q} a={q.a} idx={i} />
          ))}
        </div>
      </Section>

      <Section icon={GraduationCap} title="Likely Exam Questions" delay={0.2} badge={r.exam_questions.length}>
        <div className="space-y-2">
          {r.exam_questions.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              className="glass-card p-3 flex items-start gap-3 card-hover"
            >
              <span className="text-primary font-mono text-xs font-bold mt-0.5 shrink-0 tabular-nums">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span className="text-foreground text-sm leading-relaxed">{q}</span>
            </motion.div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}
