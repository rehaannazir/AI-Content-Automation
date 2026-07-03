import { motion } from "framer-motion";
import { useState } from "react";
import type { GenerationType } from "../../types/api";
import { GlassCard } from "../ui/GlassCard";

export interface SessionResult {
  id: string;
  type: GenerationType;
  createdAt: string;
  data: { summary: string } | { titles: string[] } | { keywords: string[] } | { linkedin: string; instagram: string; twitter: string };
}

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-full border border-ink/15 px-2.5 py-1 text-[11px] text-ink/50 transition-colors hover:border-accent/40 hover:text-accent"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function ResultCard({ result }: { result: SessionResult }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard hover className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-sm text-accent">
              {TYPE_ICON[result.type]}
            </span>
            <span className="text-sm font-medium text-ink-soft">{TYPE_LABEL[result.type]}</span>
          </div>
          <span className="text-[11px] text-ink/35">{new Date(result.createdAt).toLocaleTimeString()}</span>
        </div>

        {"summary" in result.data && (
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm leading-relaxed text-ink/80">{result.data.summary}</p>
            <CopyButton text={result.data.summary} />
          </div>
        )}

        {"titles" in result.data && (
          <ul className="flex flex-col gap-2">
            {result.data.titles.map((title, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-lg bg-surface/40 px-3 py-2 text-sm text-ink/80">
                <span>{title}</span>
                <CopyButton text={title} />
              </li>
            ))}
          </ul>
        )}

        {"keywords" in result.data && (
          <div className="flex flex-wrap gap-2">
            {result.data.keywords.map((kw, i) => (
              <span
                key={i}
                className="rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-xs text-accent"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {"linkedin" in result.data && (
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { platform: "linkedin", copy: result.data.linkedin },
              { platform: "instagram", copy: result.data.instagram },
              { platform: "twitter", copy: result.data.twitter },
            ].map(({ platform, copy }) => (
              <div key={platform} className="rounded-lg bg-surface/40 p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wide text-ink/40">{platform}</span>
                  <CopyButton text={copy} />
                </div>
                <p className="text-xs leading-relaxed text-ink/75">{copy}</p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
