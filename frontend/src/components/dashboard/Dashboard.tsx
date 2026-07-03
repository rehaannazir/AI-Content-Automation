import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { revealViewport } from "../../utils/motion";
import { Button } from "../ui/Button";
import { GlassCard } from "../ui/GlassCard";
import { FileUploadCard } from "./FileUploadCard";
import { GenerationPanel } from "./GenerationPanel";
import type { FileRecord } from "../../types/api";

interface DashboardProps {
  onAuthClick: () => void;
  onGenerated: () => void;
}

export function Dashboard({ onAuthClick, onGenerated }: DashboardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [text, setText] = useState("");
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);

  return (
    <section id="dashboard" className="relative bg-surface-2 px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-accent">API Demo</span>
          <h2 className="font-display mt-3 text-4xl font-semibold text-ink-soft sm:text-5xl">Dashboard</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/60">
            Upload a document or paste text, then generate summaries, titles, keywords, and social content in real time.
          </p>
        </motion.div>

        {isLoading ? (
          <GlassCard className="mx-auto max-w-md p-10 text-center text-ink/50">Loading…</GlassCard>
        ) : !isAuthenticated ? (
          <GlassCard className="mx-auto max-w-md p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-xl text-accent">
              🔒
            </div>
            <h3 className="font-display mb-2 text-xl font-semibold text-ink-soft">Sign in to continue</h3>
            <p className="mb-6 text-sm text-ink/55">
              The dashboard talks directly to the live API and requires an authenticated session.
            </p>
            <Button onClick={onAuthClick} className="mx-auto">
              Log in / Register
            </Button>
          </GlassCard>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <FileUploadCard
              files={files}
              onFileUploaded={(file) => setFiles((prev) => [file, ...prev])}
              onFileDeleted={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
              onUseExtractedText={(extractedText, filename) => {
                setText(extractedText);
                setSourceLabel(filename);
              }}
            />
            <GenerationPanel
              text={text}
              onTextChange={setText}
              sourceLabel={sourceLabel}
              onClearSource={() => setSourceLabel(null)}
              onGenerated={onGenerated}
            />
          </div>
        )}
      </div>
    </section>
  );
}
