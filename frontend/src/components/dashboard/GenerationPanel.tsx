import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  generateKeywords,
  generateSocialPosts,
  generateSummary,
  generateTitles,
  getApiErrorMessage,
} from "../../services/api";
import type { GenerationType } from "../../types/api";
import { GlassCard } from "../ui/GlassCard";
import { ResultCard, type SessionResult } from "./ResultCard";

const ACTIONS: { type: GenerationType; label: string; icon: string }[] = [
  { type: "summary", label: "Generate Summary", icon: "≡" },
  { type: "title", label: "Generate Titles", icon: "✦" },
  { type: "keywords", label: "Generate Keywords", icon: "#" },
  { type: "social", label: "Generate Social Posts", icon: "◎" },
];

interface GenerationPanelProps {
  text: string;
  onTextChange: (text: string) => void;
  sourceLabel: string | null;
  onClearSource: () => void;
  onGenerated: () => void;
}

export function GenerationPanel({ text, onTextChange, sourceLabel, onClearSource, onGenerated }: GenerationPanelProps) {
  const [loadingType, setLoadingType] = useState<GenerationType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SessionResult[]>([]);

  const runGeneration = async (type: GenerationType) => {
    if (text.trim().length < 10) {
      setError("Enter at least 10 characters of text (or extract text from an uploaded file) to generate content.");
      return;
    }
    setError(null);
    setLoadingType(type);
    try {
      let data: SessionResult["data"];
      if (type === "summary") data = await generateSummary(text);
      else if (type === "title") data = await generateTitles(text);
      else if (type === "keywords") data = await generateKeywords(text);
      else data = await generateSocialPosts(text);

      setResults((prev) => [
        { id: `${type}-${Date.now()}`, type, createdAt: new Date().toISOString(), data },
        ...prev,
      ]);
      onGenerated();
    } catch (err) {
      setError(getApiErrorMessage(err, "Generation failed."));
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <GlassCard className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink-soft">AI Generation</h3>
          {sourceLabel && (
            <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] text-accent">
              From: {sourceLabel}
            </span>
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Paste text here, or click “Use text” on an uploaded file above…"
          rows={7}
          className="w-full resize-none rounded-xl border border-ink/10 bg-surface/60 px-4 py-3 text-sm leading-relaxed text-ink-soft placeholder:text-ink/30 outline-none transition-colors focus:border-accent/50"
        />

        <div className="mt-2 flex justify-between text-xs text-ink/35">
          <span>{text.length} characters</span>
          {text && (
            <button
              onClick={() => {
                onTextChange("");
                onClearSource();
              }}
              className="hover:text-accent"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ACTIONS.map((action) => (
            <motion.button
              key={action.type}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => runGeneration(action.type)}
              disabled={loadingType !== null}
              className="flex flex-col items-center gap-2 rounded-xl border border-ink/10 bg-surface/40 px-3 py-4 text-center transition-all duration-300 hover:border-accent/40 hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                {loadingType === action.type ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    ⟳
                  </motion.span>
                ) : (
                  action.icon
                )}
              </span>
              <span className="text-xs text-ink/75">{action.label}</span>
            </motion.button>
          ))}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300"
          >
            {error}
          </motion.p>
        )}
      </GlassCard>

      {results.length > 0 && (
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {results.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
