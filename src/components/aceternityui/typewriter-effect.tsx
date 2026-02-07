"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const PHRASES = ["Book Smarter.", "Travel Better.", "Agent-First Platform."];

export function TypewriterEffect({
  className,
  interval = 3000,
}: {
  className?: string;
  interval?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const phrase = PHRASES[idx % PHRASES.length];

  useEffect(() => {
    setText("");
    let i = 0;
    const add = setInterval(() => {
      if (i <= phrase.length) {
        setText(phrase.slice(0, i));
        i++;
      } else {
        clearInterval(add);
      }
    }, 80);
    return () => clearInterval(add);
  }, [phrase]);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => i + 1), interval);
    return () => clearInterval(t);
  }, [interval]);

  return (
    <span className={cn("inline-block min-h-[1.5em]", className)}>
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}
