import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../services/api";
import { Button } from "../ui/Button";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Mode = "login" | "register";

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
    setLoading(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      close();
    } catch (err) {
      setError(getApiErrorMessage(err, mode === "login" ? "Invalid credentials." : "Could not register."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong relative z-10 w-full max-w-md rounded-3xl p-8 shadow-2xl"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 text-ink/50 transition-colors hover:text-accent"
            >
              ✕
            </button>

            <div className="mb-6 flex gap-2 rounded-full bg-surface/60 p-1">
              {(["login", "register"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError(null);
                  }}
                  className={`flex-1 rounded-full py-2 text-sm font-medium capitalize transition-all duration-300 ${
                    mode === m ? "bg-accent text-surface-2" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {m === "login" ? "Log in" : "Register"}
                </button>
              ))}
            </div>

            <h2 className="font-display mb-1 text-2xl font-semibold text-ink-soft">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mb-6 text-sm text-ink/60">
              {mode === "login"
                ? "Log in to access your dashboard and generation history."
                : "Register to start automating content with the API."}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rehan Nazir"
                    className="w-full rounded-xl border border-ink/10 bg-surface/60 px-4 py-3 text-sm text-ink-soft placeholder:text-ink/30 outline-none transition-colors focus:border-accent/50"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-ink/10 bg-surface/60 px-4 py-3 text-sm text-ink-soft placeholder:text-ink/30 outline-none transition-colors focus:border-accent/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Password</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-ink/10 bg-surface/60 px-4 py-3 text-sm text-ink-soft placeholder:text-ink/30 outline-none transition-colors focus:border-accent/50"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300"
                >
                  {error}
                </motion.p>
              )}

              <Button type="submit" disabled={loading} className="mt-2 w-full !py-3.5">
                {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
