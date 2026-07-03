import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { deleteFile, extractFileText, getApiErrorMessage, uploadFile } from "../../services/api";
import type { FileRecord } from "../../types/api";
import { GlassCard } from "../ui/GlassCard";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"];

interface FileUploadCardProps {
  files: FileRecord[];
  onFileUploaded: (file: FileRecord) => void;
  onFileDeleted: (fileId: number) => void;
  onUseExtractedText: (text: string, filename: string) => void;
}

export function FileUploadCard({ files, onFileUploaded, onFileDeleted, onUseExtractedText }: FileUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extractingId, setExtractingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const uploaded = await uploadFile(file);
      onFileUploaded(uploaded);
    } catch (err) {
      setError(getApiErrorMessage(err, "Upload failed."));
    } finally {
      setUploading(false);
    }
  }, [onFileUploaded]);

  const handleExtract = async (file: FileRecord) => {
    setExtractingId(file.id);
    setError(null);
    try {
      const text = await extractFileText(file.id);
      onUseExtractedText(text, file.filename);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not extract text from file."));
    } finally {
      setExtractingId(null);
    }
  };

  const handleDelete = async (file: FileRecord) => {
    try {
      await deleteFile(file.id);
      onFileDeleted(file.id);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not delete file."));
    }
  };

  return (
    <GlassCard className="p-6">
      <h3 className="font-display mb-1 text-lg font-semibold text-ink-soft">Upload a document</h3>
      <p className="mb-5 text-sm text-ink/55">PDF, DOCX, or TXT — extract text and feed it into any generator below.</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-300 ${
          dragActive ? "border-accent bg-accent/5" : "border-ink/15 hover:border-accent/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <motion.div
          animate={uploading ? { rotate: 360 } : {}}
          transition={uploading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent"
        >
          {uploading ? "⟳" : "↑"}
        </motion.div>
        <p className="text-sm text-ink/70">
          {uploading ? "Uploading…" : "Drag & drop, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-ink/35">.pdf · .docx · .txt</p>
      </div>

      {error && <p className="mt-3 text-xs text-red-300">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-5 flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-ink/8 bg-surface/40 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-ink-soft">{file.filename}</p>
                <p className="text-[11px] uppercase tracking-wide text-ink/40">{file.file_type}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => handleExtract(file)}
                  disabled={extractingId === file.id}
                  className="rounded-full border border-accent/30 px-3 py-1 text-xs text-accent transition-colors hover:bg-accent/10 disabled:opacity-40"
                >
                  {extractingId === file.id ? "Extracting…" : "Use text"}
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="text-ink/40 transition-colors hover:text-red-300"
                  aria-label="Delete file"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
