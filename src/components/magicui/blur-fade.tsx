"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  inView?: boolean;
  viewTriggerOffset?: number;
}

export function BlurFade({
  children,
  className,
  delay = 0,
  inView = false,
  viewTriggerOffset = 0,
}: BlurFadeProps) {
  const prefersReducedMotion = useReducedMotion();

  const animation = prefersReducedMotion
    ? { opacity: 1, filter: "blur(0px)" }
    : {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
      };

  const from = prefersReducedMotion
    ? { opacity: 0, filter: "blur(0px)" }
    : {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
      };

  return (
    <motion.div
      initial={from}
      {...(inView ? { whileInView: animation } : { animate: animation })}
      viewport={inView ? { once: true, margin: `-${viewTriggerOffset}px 0px -${viewTriggerOffset}px 0px` } : undefined}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
