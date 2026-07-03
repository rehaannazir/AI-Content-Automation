import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import { Button } from "../ui/Button";

const NeuralNetworkScene = lazy(() =>
  import("./NeuralNetworkScene").then((m) => ({ default: m.NeuralNetworkScene }))
);

const CAPABILITIES = [
  "PDF / DOCX / TXT ingestion",
  "AI-generated summaries",
  "SEO title & keyword extraction",
  "Multi-platform social content",
  "JWT-secured API access",
];

interface HeroProps {
  onPrimaryCta: () => void;
}

export function Hero({ onPrimaryCta }: HeroProps) {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden bg-surface pt-28 pb-20">
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <NeuralNetworkScene />
        </Suspense>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, transparent 0%, rgba(51,53,51,0.55) 55%, rgba(51,53,51,0.95) 100%)",
        }}
      />
      <div className="noise-overlay" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent"
        >
          <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-accent" />
          Live FastAPI backend
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink-soft sm:text-6xl lg:text-7xl"
        >
          AI Content Automation <span className="text-gradient-accent">API</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-lg text-ink/80 sm:text-xl"
        >
          Turn text and files into summaries, SEO content, and social media posts using AI-powered automation.
        </motion.p>

        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } } }}
          className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {CAPABILITIES.map((item) => (
            <motion.li
              key={item}
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center gap-2 text-sm text-ink/65"
            >
              <span className="h-1 w-1 rounded-full bg-accent" />
              {item}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <Button onClick={onPrimaryCta} className="!px-8 !py-3.5 text-sm">
            Try API Dashboard
          </Button>
          <Button
            variant="secondary"
            className="!px-8 !py-3.5 text-sm"
            onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}/docs`, "_blank")}
          >
            View Documentation
          </Button>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-ink/40"
      >
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
          <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="10" cy="8" r="2" fill="currentColor" />
        </svg>
      </motion.div>
    </section>
  );
}
