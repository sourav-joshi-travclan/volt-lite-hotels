"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "rgba(99, 102, 241, 0.4)",
      shimmerSize = "0.05em",
      shimmerDuration = "2.5s",
      borderRadius = "12px",
      background = "rgba(99, 102, 241, 0.8)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative overflow-hidden inline-flex h-10 items-center justify-center rounded-button px-6 font-medium text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        style={
          {
            "--shimmer-color": shimmerColor,
            "--shimmer-size": shimmerSize,
            "--shimmer-duration": shimmerDuration,
            "--border-radius": borderRadius,
            "--background": background,
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          className="absolute inset-0 -z-10 h-full w-full animate-[shimmer_var(--shimmer-duration)_infinite]"
          style={{
            background: `linear-gradient(105deg, transparent 40%, var(--shimmer-color) 45%, var(--shimmer-color) 55%, transparent 60%)`,
            backgroundSize: "200% 100%",
          }}
        />
        <div
          className="absolute inset-0 -z-10 rounded-[var(--border-radius)]"
          style={{ backgroundColor: "var(--background)" }}
        />
        {children}
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
