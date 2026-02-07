"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextHoverEffectProps {
  text: string;
  className?: string;
}

export function TextHoverEffect({ text, className }: TextHoverEffectProps) {
  return (
    <motion.span
      className={cn("inline-block", className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          whileHover={{
            y: -4,
            color: "var(--accent-glow)",
            textShadow: "0 0 20px var(--accent-primary)",
          }}
          transition={{ duration: 0.2 }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
