"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthLink, AuthShell, GoogleButton } from "@/components/auth";
import Loader from "@/components/Loader";

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
    if (!isPending && session?.user) router.replace(redirect);
  }, [session, isPending, redirect, router]);

  if (isPending) return <Loader label="Checking your session" />;

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) {
        const message = result.error.message || "Check your email and password, then try again.";
        setError(message);
        toast.error(message);
      } else {
        toast.success("Welcome back to BookNook!");
        router.push(redirect);
        router.refresh();
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "We couldn't sign you in. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: redirect });
      if (result?.data?.url) window.location.assign(result.data.url);
      else if (result?.error) throw new Error(result.error.message || "Google sign-in could not be started.");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Google sign-in could not be started.");
      setGoogleLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to borrow books and manage your community shelf."
      footer={<>New to BookNook? <AuthLink href={redirect !== "/" ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"}>Create an account</AuthLink></>}
    >
      {error && <p role="alert" className="mb-5 rounded-xl border border-danger/20 bg-danger-light p-3 text-sm text-danger">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="label" htmlFor="login-email">Email address</label>
          <div className="relative"><Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" /><input id="login-email" type="email" className="input pl-10" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0" htmlFor="login-password">Password</label>
            <button
              type="button"
              onClick={() => toast.error("Password reset isn't available yet.")}
              className="text-xs font-semibold text-primary hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative"><Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" /><input id="login-password" type="password" className="input pl-10" placeholder="Your password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></div>
        </div>
        <button type="submit" className="btn btn-primary mt-2 h-12 w-full" disabled={loading || googleLoading}>{loading ? "Signing in…" : "Sign in"}{!loading && <ArrowRight size={16} />}</button>
      </form>
      <GoogleButton onClick={handleGoogle} loading={googleLoading} />
    </AuthShell>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<Loader label="Loading sign in form" />}><LoginForm /></Suspense>;
}
