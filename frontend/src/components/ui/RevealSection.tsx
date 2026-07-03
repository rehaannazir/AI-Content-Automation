import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, revealViewport } from "../../utils/motion";

interface RevealSectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export function RevealSection({ id, className = "", children }: RevealSectionProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.section>
  );
}
