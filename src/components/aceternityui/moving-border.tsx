"use client";

import { cn } from "@/lib/utils";

export function MovingBorder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-button p-[1px] overflow-hidden",
        "bg-[linear-gradient(var(--background),var(--background))]",
        "before:absolute before:inset-0 before:rounded-[inherit] before:p-[1px] before:pointer-events-none before:z-0 before:[background:linear-gradient(90deg,var(--accent-primary),var(--accent-secondary),var(--accent-primary))] before:[mask:linear-gradient(#fff_0_0)_content-box_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude] before:animate-[moving-border_3s_linear_infinite]",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
