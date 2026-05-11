import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Sparkles, FileText, ImageIcon, Brain, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { generateRevisionWithGemini } from "@/lib/gemini";
import { saveRevision, updateStreak } from "@/lib/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { GlowButton } from "@/components/GlowButton";
import { RevisionResult, type Revision } from "@/components/RevisionResult";

export const Route = createFileRoute("/dashboard/generate")({
  component: GeneratePage,
});

const AI_STEPS = [
  "Parsing your notes…",
  "Extracting key concepts…",
  "Building formula sheet…",
  "Crafting rapid-fire Q&A…",
  "Predicting exam questions…",
  "Assembling your revision pack…",
];

function AILoader({ subject, chapter }: { subject: string; chapter: string }) {
  const [step, setStep] = useState(0);

  useState(() => {
    const iv = setInterval(() => setStep((s) => Math.min(s + 1, AI_STEPS.length - 1)), 2500);
    return () => clearInterval(iv);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="glass-card-strong p-10 text-center"
    >
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full"
          style={{ background: "conic-gradient(from 0deg, oklch(0.68 0.24 295 / 0.8), oklch(0.78 0.16 210 / 0.8), oklch(0.68 0.24 295 / 0.8))", animation: "spin-slow 2.5s linear infinite", filter: "blur(4px)", opacity: 0.6 }} />
        <div className="absolute inset-1.5 rounded-full glass-card-strong flex items-center justify-center">
          <Brain className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="font-display text-xl font-bold mb-1">
        {subject && chapter ? `${subject} · ${chapter}` : "Building your revision pack"}
      </div>
      <div className="text-muted-foreground text-sm mb-6">Gemini AI is thinking — this takes about 20 seconds</div>

      <div className="max-w-xs mx-auto space-y-2 mb-8">
        {AI_STEPS.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: i <= step ? 1 : 0.25, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2.5 text-sm"
          >
            {i < step ? (
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
            ) : i === step ? (
              <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </span>
            ) : (
              <span className="w-4 h-4 shrink-0 rounded-full border border-white/10" />
            )}
            <span className={i <= step ? "text-foreground" : "text-muted-foreground"}>{s}</span>
          </motion.div>
        ))}
      </div>

      <div className="h-1 bg-white/5 rounded-full overflow-hidden max-w-xs mx-auto">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / AI_STEPS.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
          style={{ background: "var(--gradient-primary)", boxShadow: "0 0 12px oklch(0.68 0.24 295 / 0.6)" }}
        />
      </div>
    </motion.div>
  );
}

function GeneratePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Revision | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted].slice(0, 6));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      "application/pdf": [".pdf"],
    },
    maxSize: 15 * 1024 * 1024,
  });

  const generate = async () => {
    if (!subject.trim() || !chapter.trim()) { toast.error("Please enter subject and chapter"); return; }
    if (!notes.trim() && files.length === 0) { toast.error("Add notes or upload at least one file"); return; }
    if (!user) { toast.error("Please sign in first"); return; }

    setLoading(true);
    setResult(null);

    try {
      // Upload images to Firebase Storage and get URLs
      const imageUrls: string[] = [];
      for (const f of files) {
        if (!f.type.startsWith("image/")) continue;
        const storageRef = ref(storage, `uploads/${user.uid}/${Date.now()}-${f.name}`);
        await uploadBytes(storageRef, f);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      // Call Gemini
      const revision = await generateRevisionWithGemini({ subject, chapter, notes, imageUrls });

      // Save to Firestore
      const id = await saveRevision(user.uid, revision);
      await updateStreak(user.uid);

      // Invalidate queries so dashboard refreshes
      queryClient.invalidateQueries({ queryKey: ["recent", user.uid] });
      queryClient.invalidateQueries({ queryKey: ["streak", user.uid] });
      queryClient.invalidateQueries({ queryKey: ["history", user.uid] });

      setResult({ ...revision, id, created_at: new Date().toISOString() });
      toast.success("Revision pack ready ✓");
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto page-enter">
      <div className="mb-8">
        <div className="section-label mb-3">
          <Sparkles className="w-3 h-3" /> AI Generator
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Build a 5-minute revision</h1>
        <p className="text-muted-foreground mt-1.5">Paste notes, drop PDFs or snap your handwritten pages.</p>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <AILoader key="loader" subject={subject} chapter={chapter} />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card-strong p-6 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">Subject</label>
                <input
                  value={subject} onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Physics"
                  className="input-field w-full px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">Chapter</label>
                <input
                  value={chapter} onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Electromagnetic Induction"
                  className="input-field w-full px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">Your notes</label>
              <textarea
                value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your study notes, transcribed content, or anything relevant…"
                rows={6}
                className="input-field w-full px-4 py-3 text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 block">Upload files</label>
              <div
                {...getRootProps()}
                className={`mt-1 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive ? "dropzone-active" : "border-white/10 hover:border-white/18 hover:bg-white/3"
                }`}
              >
                <input {...getInputProps()} />
                <div className={`w-12 h-12 mx-auto rounded-2xl glass-card flex items-center justify-center mb-3 transition-transform ${isDragActive ? "scale-110" : ""}`}>
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div className="font-medium text-sm">
                  {isDragActive ? "Drop them here ✓" : "Drag PDFs or images of handwritten notes"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP, PDF · up to 15MB · max 6 files</div>
              </div>

              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex flex-wrap gap-2"
                  >
                    {files.map((f, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        className="glass-card px-3 py-1.5 flex items-center gap-2 text-sm"
                      >
                        {f.type.startsWith("image/") ? <ImageIcon className="w-3.5 h-3.5 text-accent" /> : <FileText className="w-3.5 h-3.5 text-primary" />}
                        <span className="max-w-[160px] truncate text-xs">{f.name}</span>
                        <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-foreground transition ml-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Takes ~20 seconds · Saved automatically</p>
              <GlowButton size="lg" onClick={generate} disabled={loading}>
                <Sparkles className="w-4 h-4" />
                Generate revision
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="section-label mb-1">
                  <CheckCircle2 className="w-3 h-3 text-accent" /> Pack ready
                </div>
                <h2 className="font-display text-2xl font-bold">Your revision pack</h2>
              </div>
              <span className="text-xs text-muted-foreground glass-card px-3 py-1.5 rounded-full">Saved to history ✓</span>
            </div>
            <RevisionResult r={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
