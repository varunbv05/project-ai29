import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles, Brain, Zap, FileText, Lightbulb, Sigma, GraduationCap,
  Upload, ArrowRight, Github, Star, CheckCircle2, TrendingUp,
} from "lucide-react";
import { GlowButton } from "@/components/GlowButton";
import { useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recall5 AI — Master any subject in 5 minutes" },
      { name: "description", content: "Turn dense study notes, PDFs and handwritten pages into a 5-minute revision pack with concepts, formulas, rapid-fire Q&A and exam predictions." },
      { property: "og:title", content: "Recall5 AI — Master any subject in 5 minutes" },
      { property: "og:description", content: "AI-generated revision packs for students." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Sparkles, title: "5-min summaries", desc: "Distill an entire chapter into a sharp, exam-ready brief." },
  { icon: Lightbulb, title: "Key concepts", desc: "Auto-extracted definitions you actually need to remember." },
  { icon: Sigma, title: "Formula sheet", desc: "Every equation, derivation and unit on one screen." },
  { icon: Zap, title: "Rapid-fire Q&A", desc: "Active recall drills tuned to spaced repetition." },
  { icon: GraduationCap, title: "Exam predictions", desc: "Likely questions modelled from past patterns." },
  { icon: Upload, title: "Multimodal upload", desc: "PDFs, slides, handwritten notes — drop them in." },
];

const steps = [
  { n: "01", t: "Paste or upload", d: "Notes, PDFs, photos of your handwritten pages — anything." },
  { n: "02", t: "Recall5 thinks", d: "Multimodal AI parses, structures and compresses." },
  { n: "03", t: "Revise in 5 minutes", d: "Open the pack, drill the questions, ace the exam." },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen relative noise-overlay aurora-bg">
      {/* Nav */}
      <header className="sticky top-4 z-40 mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card-strong rounded-full px-5 py-2.5 flex items-center justify-between"
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg glow-button flex items-center justify-center transition-transform group-hover:scale-105">
              <Brain className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-[15px]">Recall5<span className="gradient-text">AI</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {["features", "how", "stats"].map((id) => (
              <a key={id} href={`#${id}`} className="nav-link hover:text-foreground transition capitalize">
                {id === "how" ? "How it works" : id === "stats" ? "Results" : "Features"}
              </a>
            ))}
          </nav>
          <Link to="/dashboard">
            <GlowButton size="sm">
              Open app <ArrowRight className="w-3.5 h-3.5" />
            </GlowButton>
          </Link>
        </motion.div>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-28 md:pt-36 pb-28">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-6xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="hero-badge mx-auto mb-8"
          >
            <Star className="w-3 h-3 text-primary" />
            Powered by multimodal AI — text, PDF &amp; handwriting
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse ml-1" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight"
          >
            Master any subject
            <br />
            <span className="gradient-text">in 5 minutes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-7 max-w-xl mx-auto text-muted-foreground text-lg leading-relaxed"
          >
            Recall5 AI turns your messy notes, PDFs and handwritten pages into a
            premium revision pack — concepts, formulas, rapid-fire Q&amp;A and exam predictions.
            Calm, focused, fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/dashboard/generate">
              <GlowButton size="lg">
                <Sparkles className="w-4 h-4" />
                Generate your first revision
              </GlowButton>
            </Link>
            <Link to="/dashboard">
              <GlowButton size="lg" variant="ghost">
                See dashboard <ArrowRight className="w-4 h-4" />
              </GlowButton>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 text-xs text-muted-foreground flex items-center justify-center gap-4"
          >
            {["No sign-up required", "Free to start", "Works with any subject"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-accent" />{t}
              </span>
            ))}
          </motion.p>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 glass-card-strong p-3 rounded-3xl glow-ring max-w-4xl mx-auto"
          >
            {/* Simulated browser chrome */}
            <div className="flex items-center gap-2 px-3 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              <span className="ml-3 text-[10px] text-muted-foreground/50 tracking-wider">recall5.ai/dashboard</span>
            </div>
            <div className="rounded-2xl bg-black/25 p-6 grid md:grid-cols-3 gap-4">
              {[
                { l: "Streak", v: "12 days", c: "from-fuchsia-500 to-purple-500" },
                { l: "Revisions", v: "47", c: "from-cyan-400 to-blue-500" },
                { l: "Mastery", v: "82%", c: "from-violet-500 to-pink-500" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="glass-card p-4 text-left"
                >
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" />{s.l}
                  </div>
                  <div className={`mt-2 text-3xl font-display font-bold bg-gradient-to-br ${s.c} bg-clip-text text-transparent stat-glow`}>
                    {s.v}
                  </div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                className="md:col-span-3 glass-card p-4 text-left"
              >
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <FileText className="w-3 h-3" /> Physics · Electromagnetic Induction
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] bg-accent/15 text-accent border border-accent/25">Just generated</span>
                </div>
                <div className="mt-2 font-display text-foreground">Faraday's law and Lenz's law summary</div>
                <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  EMF induced equals the negative rate of change of magnetic flux. Direction opposes change…
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="section-label mx-auto mb-4"><Sparkles className="w-3 h-3" />Features</div>
          <h2 className="text-3xl md:text-5xl font-display font-bold">Built for the night before the exam.</h2>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid md:grid-cols-3 gap-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className="glass-card-strong p-6 card-hover gradient-border cursor-default"
            >
              <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-primary mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <div className="font-display font-semibold text-lg">{f.title}</div>
              <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="section-label mx-auto mb-4">How it works</div>
          <h2 className="text-3xl md:text-5xl font-display font-bold">Three steps. Zero friction.</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4 relative">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.68 0.24 295 / 0.5), oklch(0.78 0.16 210 / 0.5), transparent)" }} />
          {steps.map((s, i) => (
            <motion.div key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card-strong p-6 relative card-hover"
            >
              <div className="text-5xl font-display font-bold gradient-text">{s.n}</div>
              <div className="mt-2 font-display text-xl">{s.t}</div>
              <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.d}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="max-w-6xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card-strong p-10 glow-ring"
        >
          <div className="text-center mb-8">
            <div className="section-label mx-auto mb-3">Results</div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Why students love it</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { v: "5×", l: "Faster revision" },
              { v: "92%", l: "Recall after 24h" },
              { v: "10k+", l: "Revisions generated" },
              { v: "4.9★", l: "Student rating" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="text-4xl md:text-5xl font-display font-bold gradient-text stat-glow">{s.v}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold">
            Stop re-reading.<br /><span className="gradient-text">Start recalling.</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md mx-auto">
            Join thousands of students who upgraded their study sessions with AI.
          </p>
          <div className="mt-10">
            <Link to="/dashboard/generate">
              <GlowButton size="lg"><Sparkles className="w-4 h-4" /> Try Recall5 AI free</GlowButton>
            </Link>
          </div>
        </motion.div>
      </section>

      <div className="divider max-w-6xl mx-auto" />
      <footer className="py-8 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-6">
          <span>© {new Date().getFullYear()} Recall5 AI</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Built with Lovable</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <a href="#" className="hover:text-foreground transition">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
