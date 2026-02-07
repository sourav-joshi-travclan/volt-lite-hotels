"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  duration?: number;
}

export function TextGenerateEffect({
  words,
  className,
  duration = 1.5,
}: TextGenerateEffectProps) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= words.length) return;
    const timeout = setTimeout(() => {
      setDisplayed((prev) => prev + words[index]);
      setIndex((i) => i + 1);
    }, (duration * 1000) / words.length);
    return () => clearTimeout(timeout);
  }, [index, words, duration]);

  return (
    <span className={cn("inline-block", className)}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}
