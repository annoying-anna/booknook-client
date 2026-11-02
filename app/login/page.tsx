"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthShell, GoogleButton, AuthLink } from "@/components/auth";
import Loader from "@/components/Loader";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { data: session, isPending } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "BookNook | Login";
    if (!isPending && session?.user) {
      router.push(redirect);
    }
  }, [session, isPending, redirect, router]);

  if (isPending) {
    return <Loader label="Checking session" />;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (res.error) {
        const msg = res.error.message || "Invalid email or password.";
        setError(msg);
        toast.error(msg);
      } else {
        toast.success("Welcome back to BookNook!");
        router.push(redirect);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "Failed to sign in. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirect,
      });
    } catch {
      toast.error("Google sign-in could not be initiated.");
    }
  }

  function handleForgotPassword(e: React.MouseEvent) {
    e.preventDefault();
    toast.error("Password reset isn't available yet.");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to browse, borrow, and share books."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <AuthLink href={redirect !== "/" ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"}>
            Create one
          </AuthLink>
        </>
      }
    >
      {error && <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="label" htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            className="input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="login-password">Password</label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-ink-soft hover:text-ink underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="login-password"
            type="password"
            className="input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <GoogleButton onClick={handleGoogle} label="Continue with Google" />
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader label="Loading sign in" />}>
      <LoginForm />
    </Suspense>
  );
}
