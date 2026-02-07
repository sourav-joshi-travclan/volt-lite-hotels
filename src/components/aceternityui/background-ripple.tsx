"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function BackgroundRipple({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let animationId: number;
    const ripples: { x: number; y: number; r: number; maxR: number }[] = [];

    const draw = () => {
      ctx.fillStyle = "rgba(9, 9, 11, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ripples.forEach((r, i) => {
        r.r += 1.5;
        if (r.r > r.maxR) ripples.splice(i, 1);
        const gradient = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, r.r);
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.08)");
        gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    const onMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.97) {
        ripples.push({ x: e.clientX, y: e.clientY, r: 0, maxR: 150 });
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
    />
  );
}
