"use client";

import { cn } from "@/lib/utils";

export function BackgroundLines({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f4666_1px,transparent_1px),linear-gradient(to_bottom,#3f3f4666_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute left-1/2 top-0 h-[500px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_var(--accent-primary)_0%,transparent_70%)] opacity-10 blur-3xl" />
    </div>
  );
}
