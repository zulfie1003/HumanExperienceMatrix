"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PASSWORD_MIN_LENGTH, PASSWORD_REQUIREMENTS } from "@/lib/password-policy";
import { Brain, Chrome } from "lucide-react";

type AuthMode = "signin" | "signup";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "A user already exists with this email. Try Google again to link it, or sign in with email and password.",
  OAuthCallbackError:
    "Google could not complete sign-in. Check the Google OAuth callback URL.",
  OAuthSignin:
    "Google sign-in could not start. Check your Google OAuth client settings.",
  Configuration:
    "Google sign-in is not configured correctly. Check the client ID, secret, and callback URL.",
  AccessDenied: "Google sign-in was cancelled or denied.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const authErrorMessage = authError
    ? AUTH_ERROR_MESSAGES[authError] ?? "Google sign-in failed. Please try again."
    : null;
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED !== "false";
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordChecks = PASSWORD_REQUIREMENTS.map((requirement) => ({
    label: requirement.label,
    isMet: requirement.test(password),
  }));
  const isPasswordStrong = passwordChecks.every((check) => check.isMet);
  const passwordsMatch = password === confirmPassword;
  const canSubmit =
    !isLoading &&
    Boolean(email.trim()) &&
    Boolean(password) &&
    (mode === "signin" || (isPasswordStrong && passwordsMatch && Boolean(confirmPassword)));

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    if (mode === "signup") {
      if (!isPasswordStrong) {
        setError("Please choose a stronger password before creating your account.");
        return;
      }

      if (!passwordsMatch) {
        setError("Passwords do not match.");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    if (mode === "signup") {
      const registerResult = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          password,
          confirmPassword,
        }),
      });

      if (!registerResult.ok) {
        const payload = await registerResult.json().catch(() => null);
        setError(payload?.error ?? "Could not create your account. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email or password is incorrect.");
      setIsLoading(false);
    } else {
      router.push("/ask");
      router.refresh();
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
          <h1 className="text-2xl font-bold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in with email or Google to save conversations and access your history.
          </p>
        </div>

        {(error || authErrorMessage) && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error || authErrorMessage}
          </div>
        )}

        <div className="grid grid-cols-2 rounded-md border p-1">
          <button
            type="button"
            className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
              mode === "signin" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            disabled={isLoading}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
              mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            disabled={isLoading}
          >
            Sign up
          </button>
        </div>

        {googleEnabled ? (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Chrome className="h-4 w-4" />
            Continue with Google
          </Button>
        ) : (
          <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
            Google sign-in is ready in the app. Add your Google OAuth keys and set{" "}
            <span className="font-mono">NEXT_PUBLIC_GOOGLE_ENABLED=true</span> to enable it.
          </div>
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
          {mode === "signup" && (
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Name
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
          )}
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
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder={
                mode === "signin"
                  ? "Your password"
                  : `At least ${PASSWORD_MIN_LENGTH} characters`
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={mode === "signup" ? PASSWORD_MIN_LENGTH : undefined}
              required
              disabled={isLoading}
            />
          </div>
          {mode === "signup" && (
            <>
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={PASSWORD_MIN_LENGTH}
                  required
                  disabled={isLoading}
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-destructive">Passwords do not match.</p>
                )}
              </div>
              <div className="rounded-md border bg-muted/30 p-3 text-xs">
                <p className="mb-2 font-medium text-foreground">Password must include:</p>
                <ul className="space-y-1 text-muted-foreground">
                  {passwordChecks.map((check) => (
                    <li
                      key={check.label}
                      className={check.isMet ? "text-green-700" : "text-muted-foreground"}
                    >
                      {check.isMet ? "OK" : "-"} {check.label}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit}
          >
            {isLoading
              ? mode === "signin"
                ? "Signing in..."
                : "Creating account..."
              : mode === "signin"
                ? "Sign in with Email"
                : "Create account"}
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
