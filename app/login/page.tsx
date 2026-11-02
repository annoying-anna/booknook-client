"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthShell, GoogleButton, AuthLink } from "@/components/auth";
import Loader from "@/components/Loader";
import { ArrowRight, Lock, Mail } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { data: session, isPending } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "BookNook | Login";
    if (!isPending && session?.user) {
      router.push(redirect);
    }
  }, [session, isPending, redirect, router]);

  if (isPending) {
    return <Loader label="Verifying session" />;
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
    setGoogleLoading(true);
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirect,
      });
      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "Google sign-in could not be initiated.";
      toast.error(msg);
      setGoogleLoading(false);
    }
  }

  function handleForgotPassword(e: React.MouseEvent) {
    e.preventDefault();
    toast.error("Password reset isn't available yet.");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your member account to borrow books and manage your shelf."
      footer={
        <>
          New to BookNook?{" "}
          <AuthLink href={redirect !== "/" ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"}>
            Create an account for free
          </AuthLink>
        </>
      }
    >
      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 p-4 text-xs font-semibold text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="label" htmlFor="login-email">
            Email Address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              id="login-email"
              type="email"
              className="input pl-10"
              placeholder="reader@booknook.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0" htmlFor="login-password">
              Password
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              id="login-password"
              type="password"
              className="input pl-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full h-12 text-sm font-bold shadow-lg shadow-blue-600/25 mt-2"
          disabled={loading || googleLoading}
        >
          {loading ? "Signing in…" : "Sign In to Library"}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <GoogleButton onClick={handleGoogle} label="Continue with Google" loading={googleLoading} />
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader label="Loading sign in form" />}>
      <LoginForm />
    </Suspense>
  );
}
