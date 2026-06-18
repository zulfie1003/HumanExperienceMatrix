"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Chrome } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email: email.trim(),
      name: name.trim() || email.trim().split("@")[0],
      redirect: false,
    });

    if (result?.error) {
      setError("Sign in failed. Please try again.");
      setIsLoading(false);
    } else {
      router.push("/ask");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/ask" });
  };

  const handleGuest = () => {
    router.push("/ask?guest=true");
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to save your conversations and access your history.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Google */}
        {process.env.NEXT_PUBLIC_GOOGLE_ENABLED !== "false" && (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Chrome className="h-4 w-4" />
            Continue with Google
          </Button>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Email */}
        <form onSubmit={handleEmailSignIn} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
              Name (optional)
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !email.trim()}>
            {isLoading ? "Signing in..." : "Continue with Email"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Guest */}
        <Button
          variant="ghost"
          className="w-full"
          onClick={handleGuest}
          disabled={isLoading}
        >
          Continue as guest
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Guest sessions are temporary. Sign in to keep your history.
        </p>
      </div>
    </div>
  );
}
