const SOCIAL_LINKS = {
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  email: "mailto:rehan1397jutt@gmail.com",
};

export function Footer() {
  return (
    <footer className="relative border-t border-ink/8 bg-surface px-6 py-12 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-display text-sm font-semibold text-ink-soft">Rehan Nazir</p>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/40">AI Engineer</p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-ink/50 transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-ink/50 transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a href={SOCIAL_LINKS.email} className="text-sm text-ink/50 transition-colors hover:text-accent">
            Email
          </a>
        </div>

        <p className="text-xs text-ink/30">© {new Date().getFullYear()} AI Content Automation API</p>
      </div>
    </footer>
  );
}
