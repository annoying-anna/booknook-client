"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthShell, GoogleButton, AuthLink, PasswordRules, isPasswordValid } from "@/components/auth";
import Loader from "@/components/Loader";
import { ArrowRight, Image as ImageIcon, Lock, Mail, User, CheckCircle2, ExternalLink, RefreshCw } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Register";
    if (!isPending && session?.user) {
      router.push(redirect);
    }
  }, [session, isPending, redirect, router]);

  if (isPending) {
    return <Loader label="Verifying session" />;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isPasswordValid(password)) {
      setError("Password does not meet the security criteria.");
      toast.error("Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoUrl.trim() || undefined,
      });

      if (res.error) {
        const msg = res.error.message || "Registration failed.";
        setError(msg);
        toast.error(msg);
      } else {
        setRegisteredEmail(email.trim());
        toast.success("Verification email dispatched! Check your inbox.");
      }
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "Failed to register. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendEmail() {
    if (!registeredEmail) return;
    setResending(true);
    try {
      const res = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredEmail,
          callbackURL: redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}&verified=true` : "/login?verified=true",
        }),
      });
      if (res.ok) {
        toast.success(`Verification email re-sent to ${registeredEmail}`);
      } else {
        toast.error("Could not resend verification email right now.");
      }
    } catch {
      toast.error("Failed to resend email.");
    } finally {
      setResending(false);
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
      const msg = (err as Error)?.message || "Google registration could not be initiated.";
      toast.error(msg);
      setGoogleLoading(false);
    }
  }

  const valid = isPasswordValid(password);

  if (registeredEmail) {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={`We have dispatched an activation email to ${registeredEmail}.`}
        footer={
          <>
            Ready to log in?{" "}
            <AuthLink href={redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}>
              Proceed to Sign In
            </AuthLink>
          </>
        }
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 shadow-md">
            <Mail size={36} className="animate-bounce" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-ink">Verification Email Sent</h3>
            <p className="font-reading text-sm text-ink-soft leading-relaxed">
              We sent a verification link to <strong className="text-ink">{registeredEmail}</strong> via Resend. Click the link inside the email to activate your account and start borrowing.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary h-12 w-full text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
            >
              <ExternalLink size={16} /> Open Gmail Inbox
            </a>

            <button
              type="button"
              onClick={handleResendEmail}
              disabled={resending}
              className="btn btn-outline h-11 w-full text-xs font-semibold flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
              <span>{resending ? "Re-sending email…" : "Didn't receive it? Resend Email"}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-line bg-paper/60 p-4 text-xs font-reading text-ink-faint">
            Tip: Be sure to check your Spam or Promotions folder if it doesn&apos;t appear within 60 seconds.
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join BookNook today to borrow, review, and contribute to the library."
      footer={
        <>
          Already have a member account?{" "}
          <AuthLink href={redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}>
            Sign in here
          </AuthLink>
        </>
      }
    >
      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 p-4 text-xs font-semibold text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="label" htmlFor="reg-name">
            Full Name
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              id="reg-name"
              type="text"
              className="input pl-10"
              placeholder="Jane Austen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="reg-email">
            Email Address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              id="reg-email"
              type="email"
              className="input pl-10"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="reg-photo">
            Photo URL (optional)
          </label>
          <div className="relative">
            <ImageIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              id="reg-photo"
              type="url"
              className="input pl-10 text-xs"
              placeholder="https://images.unsplash.com/photo-..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="reg-password">
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              id="reg-password"
              type="password"
              className="input pl-10"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <PasswordRules password={password} />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full h-12 text-sm font-bold shadow-lg shadow-blue-600/25 mt-2"
          disabled={loading || !valid || googleLoading}
        >
          {loading ? "Creating membership…" : "Create Member Account"}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <GoogleButton onClick={handleGoogle} label="Sign up with Google" loading={googleLoading} />
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loader label="Loading registration form" />}>
      <RegisterForm />
    </Suspense>
  );
}
