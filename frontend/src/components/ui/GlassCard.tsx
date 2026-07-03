import type { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  strong?: boolean;
}

export function GlassCard({ children, hover = false, strong = false, className = "", ...props }: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl ${strong ? "glass-strong" : "glass"} ${hover ? "card-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
