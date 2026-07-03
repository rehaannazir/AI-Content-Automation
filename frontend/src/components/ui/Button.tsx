import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-accent text-surface-2 font-semibold hover:shadow-[0_0_30px_-4px_rgba(245,203,92,0.6)] hover:brightness-110",
  secondary:
    "glass text-ink-soft font-medium hover:border-accent/40 hover:text-accent",
  ghost: "text-ink/80 hover:text-accent",
};

export function Button({ variant = "primary", className = "", children, disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.035 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm tracking-wide transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
