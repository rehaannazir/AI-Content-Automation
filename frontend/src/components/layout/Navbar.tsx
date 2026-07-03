import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { Button } from "../ui/Button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "API Demo", href: "#dashboard" },
  { label: "History", href: "#history" },
];

interface NavbarProps {
  onAuthClick: () => void;
}

export function Navbar({ onAuthClick }: NavbarProps) {
  const scrolled = useScrollPosition();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-[0_8px_40px_-16px_rgba(0,0,0,0.6)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" className="group flex flex-col leading-tight">
          <span className="font-display text-sm font-semibold tracking-wide text-ink-soft transition-colors group-hover:text-accent">
            Rehan Nazir
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">AI Engineer</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-ink/75 transition-colors duration-300 hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-ink/60">
                Hi, <span className="text-accent">{user?.username}</span>
              </span>
              <Button variant="secondary" onClick={logout} className="!px-5 !py-2 text-xs">
                Log out
              </Button>
            </>
          ) : (
            <Button onClick={onAuthClick} className="!px-6 !py-2.5 text-xs">
              Get Started
            </Button>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-[1.5px] w-5 bg-current transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span className={`absolute left-0 top-[7px] h-[1.5px] w-5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`absolute left-0 top-[14px] h-[1.5px] w-5 bg-current transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="glass-strong overflow-hidden px-6 pb-6 md:hidden"
        >
          <div className="flex flex-col gap-4 pt-2">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-ink/80" onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            {isAuthenticated ? (
              <Button variant="secondary" onClick={logout} className="w-full">
                Log out ({user?.username})
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  onAuthClick();
                }}
                className="w-full"
              >
                Get Started
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
