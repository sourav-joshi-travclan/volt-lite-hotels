"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { BackgroundLines } from "@/components/ui/background-lines";
import { TextGenerateEffect } from "@/components/aceternityui/text-generate-effect";
import { TypewriterEffect } from "@/components/aceternityui/typewriter-effect";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { toast } from "sonner";

export default function LoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { message?: string }).message || "Login failed");
      setAuth({ username }, true);
      toast.success("Welcome back!");
      window.location.href = "/search";
      return;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)]">
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <BackgroundLines className="!h-full !min-h-screen !bg-transparent dark:!bg-transparent">
          {null}
        </BackgroundLines>
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[0.5fr_0.5fr]">
        <div className="hidden lg:flex flex-col items-center justify-center p-16">
          <div className="text-center max-w-md">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              <TextGenerateEffect words="Volt Hotels" duration={1.2} />
            </h1>
            <p className="text-muted-foreground text-xl mt-6 leading-relaxed">
              <TypewriterEffect interval={3500} />
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
              <span>✓ Best price guarantee</span>
              <span>✓ Free cancellation</span>
              <span>✓ 24/7 support</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 lg:p-16">
          <BlurFade delay={0.1} className="w-full max-w-md lg:max-w-lg">
            <Card className="relative w-full border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <CardHeader className="relative pb-2">
                <CardTitle className="text-3xl font-semibold">Welcome Back</CardTitle>
                <CardDescription className="text-base mt-1">Sign in to your account</CardDescription>
              </CardHeader>
              <CardContent className="relative pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-base">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                      autoComplete="username"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      autoComplete="current-password"
                      className="h-12 text-base"
                    />
                  </div>
                  <ShimmerButton
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </ShimmerButton>
                </form>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  );

  return content;
}
