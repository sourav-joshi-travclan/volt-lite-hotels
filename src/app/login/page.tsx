"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { BackgroundBeams } from "@/components/aceternityui/background-beams";
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
      // Full page redirect ensures cookies are sent on the next request
      window.location.href = "/search";
      return;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[0.55fr_0.45fr]">
      <div className="relative hidden lg:block overflow-hidden bg-[var(--background)]">
        <BackgroundBeams />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              <TextGenerateEffect words="Volt Hotels" duration={1.2} />
            </h1>
            <p className="text-muted-foreground text-lg mt-4">
              <TypewriterEffect interval={3500} />
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 lg:p-12 bg-[var(--background)]">
        <BlurFade delay={0.1}>
          <Card className="w-full max-w-md border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    autoComplete="current-password"
                  />
                </div>
                <ShimmerButton
                  type="submit"
                  className="w-full"
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
  );
}
