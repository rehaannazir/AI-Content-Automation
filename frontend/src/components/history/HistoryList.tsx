import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { deleteHistoryItem, getApiErrorMessage, getHistory } from "../../services/api";
import type { GenerationResponse, GenerationType } from "../../types/api";
import { revealViewport } from "../../utils/motion";
import { GlassCard } from "../ui/GlassCard";

const TYPE_LABEL: Record<GenerationType, string> = {
  summary: "Summary",
  title: "Titles",
  keywords: "Keywords",
  social: "Social Posts",
};

const TYPE_ICON: Record<GenerationType, string> = {
  summary: "≡",
  title: "✦",
  keywords: "#",
  social: "◎",
};

function formatResult(item: GenerationResponse): string {
  try {
    const parsed = JSON.parse(item.result);
    if (parsed.summary) return parsed.summary;
    if (parsed.titles) return parsed.titles.join(" · ");
    if (parsed.keywords) return parsed.keywords.join(", ");
    if (parsed.linkedin) return `LinkedIn: ${parsed.linkedin}`;
    return item.result;
  } catch {
    return item.result;
  }
}

interface HistoryListProps {
  refreshSignal: number;
}

export function HistoryList({ refreshSignal }: HistoryListProps) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<GenerationResponse[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    getHistory()
      .then(setItems)
      .catch((err) => setError(getApiErrorMessage(err, "Could not load history.")))
      .finally(() => setLoading(false));
  }, [isAuthenticated, refreshSignal]);

  const handleDelete = async (id: number) => {
    try {
      await deleteHistoryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not delete entry."));
    }
  };

  return (
    <section id="history" className="relative bg-surface px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-accent">Timeline</span>
          <h2 className="font-display mt-3 text-4xl font-semibold text-ink-soft sm:text-5xl">Generation History</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/60">Every generation call is saved to your account. Expand to review, or delete what you don't need.</p>
        </motion.div>

        {!isAuthenticated ? (
          <GlassCard className="mx-auto max-w-md p-10 text-center text-sm text-ink/55">
            Log in to view your generation history.
          </GlassCard>
        ) : loading ? (
          <GlassCard className="mx-auto max-w-md p-10 text-center text-ink/50">Loading history…</GlassCard>
        ) : error ? (
          <GlassCard className="mx-auto max-w-md p-10 text-center text-sm text-red-300">{error}</GlassCard>
        ) : items.length === 0 ? (
          <GlassCard className="mx-auto max-w-md p-10 text-center text-sm text-ink/55">
            No generations yet — try the dashboard above.
          </GlassCard>
        ) : (
          <div className="relative flex flex-col gap-4 border-l border-ink/10 pl-6">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const expanded = expandedId === item.id;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="relative"
                  >
                    <span className="absolute -left-[29px] top-5 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(245,203,92,0.5)]" />
                    <GlassCard hover className="p-5">
                      <div
                        className="flex cursor-pointer items-center justify-between gap-4"
                        onClick={() => setExpandedId(expanded ? null : item.id)}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                            {TYPE_ICON[item.generation_type]}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-ink-soft">{TYPE_LABEL[item.generation_type]}</span>
                              <span className="text-[11px] text-ink/35">
                                {new Date(item.created_at).toLocaleString()}
                              </span>
                            </div>
                            {!expanded && <p className="truncate text-xs text-ink/50">{formatResult(item)}</p>}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="text-ink/40 transition-colors hover:text-red-300"
                            aria-label="Delete generation"
                          >
                            ✕
                          </button>
                          <span className={`text-ink/30 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
                            ⌄
                          </span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 border-t border-ink/8 pt-4">
                              <p className="mb-2 text-[11px] uppercase tracking-wide text-ink/35">Source text</p>
                              <p className="mb-4 max-h-32 overflow-y-auto text-xs leading-relaxed text-ink/60">
                                {item.prompt}
                              </p>
                              <p className="mb-2 text-[11px] uppercase tracking-wide text-ink/35">Result</p>
                              <p className="text-sm leading-relaxed text-ink/80">{formatResult(item)}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
