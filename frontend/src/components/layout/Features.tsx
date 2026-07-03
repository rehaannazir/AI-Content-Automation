import { motion } from "framer-motion";
import { fadeUp, revealViewport, staggerContainer } from "../../utils/motion";
import { GlassCard } from "../ui/GlassCard";

const FEATURES = [
  {
    icon: "🔐",
    title: "JWT Authentication",
    description: "Secure, stateless auth with bearer tokens protecting every generation and file endpoint.",
  },
  {
    icon: "📄",
    title: "File Processing",
    description: "Upload PDF, DOCX, or TXT files and extract clean text ready for AI processing.",
  },
  {
    icon: "🧠",
    title: "AI Summarization",
    description: "Condense long-form content into sharp, readable summaries in seconds.",
  },
  {
    icon: "🔍",
    title: "SEO Optimization Tools",
    description: "Generate high-performing titles and keyword sets tuned for search visibility.",
  },
  {
    icon: "📣",
    title: "Social Media Generator",
    description: "Produce platform-ready copy for LinkedIn, Instagram, and Twitter from one input.",
  },
  {
    icon: "🕘",
    title: "Generation History",
    description: "Every request is saved and retrievable — review, revisit, or delete on demand.",
  },
  {
    icon: "⚙️",
    title: "Scalable FastAPI Architecture",
    description: "A clean, layered backend — routers, services, repositories — built to grow.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative bg-surface-2 px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-accent">Capabilities</span>
          <h2 className="font-display mt-3 text-4xl font-semibold text-ink-soft sm:text-5xl">Built for real workflows</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/60">
            A production-shaped API — not a demo. Every capability below is live and reachable from this dashboard.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={fadeUp}>
              <GlassCard hover className="h-full p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-xl">
                  {feature.icon}
                </div>
                <h3 className="font-display mb-2 text-base font-semibold text-ink-soft">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-ink/60">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
