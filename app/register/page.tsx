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
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

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

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!registeredEmail || !otp.trim()) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await fetch("/api/auth/email-otp/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredEmail,
          otp: otp.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.message || data?.error || "Invalid or expired OTP code.";
        toast.error(msg);
      } else {
        toast.success("Email verified successfully! Welcome to BookNook.");
        const target = redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}&verified=true` : "/login?verified=true";
        router.push(target);
        router.refresh();
      }
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to verify OTP.");
    } finally {
      setVerifyingOtp(false);
    }
  }

  async function handleResendOtp() {
    if (!registeredEmail) return;
    setResending(true);
    try {
      const res = await fetch("/api/auth/email-otp/send-verification-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredEmail,
          type: "email-verification",
        }),
      });

      if (res.ok) {
        toast.success(`New 6-digit OTP dispatched to ${registeredEmail}!`);
      } else {
        toast.error("Could not resend OTP right now. Please check again in 1 minute.");
      }
    } catch {
      toast.error("Failed to resend OTP.");
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
        title="Enter Verification Code"
        subtitle={`We sent a 6-digit code to ${registeredEmail}.`}
        footer={
          <>
            Entered the wrong email?{" "}
            <button
              onClick={() => {
                setRegisteredEmail(null);
                setOtp("");
              }}
              className="font-bold text-blue-600 dark:text-blue-400 underline"
            >
              Change email
            </button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 shadow-sm mb-3">
              <Mail size={28} className="animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-ink">Check Your Inbox</h3>
            <p className="font-reading text-xs text-ink-soft mt-1 leading-relaxed">
              Enter the 6-digit OTP code sent to <strong className="text-ink">{registeredEmail}</strong>.
              {registeredEmail !== "himelbarman22@gmail.com" && (
                <span className="block mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                  (On Resend free sandbox, code is also delivered to your verified Resend email <strong>himelbarman22@gmail.com</strong>)
                </span>
              )}
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="label text-center" htmlFor="otp-input">
                6-Digit Security Code
              </label>
              <input
                id="otp-input"
                type="text"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                className="input text-center text-2xl font-black tracking-[12px] h-14 font-mono"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={verifyingOtp || otp.length < 6}
              className="btn btn-primary h-12 w-full text-sm font-bold shadow-lg shadow-blue-600/25"
            >
              {verifyingOtp ? "Verifying Code…" : "Verify Code & Activate"}
            </button>
          </form>

          <div className="flex flex-col gap-2.5 pt-2 text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="text-xs font-semibold text-ink-soft hover:text-brand flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
              <span>{resending ? "Dispatching new code…" : "Didn't receive code? Resend OTP"}</span>
            </button>

            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-ink-faint hover:text-ink underline flex items-center justify-center gap-1"
            >
              <ExternalLink size={12} /> Open Gmail
            </a>
          </div>

          <div className="rounded-xl border border-line bg-paper/60 p-3 text-[11px] font-reading text-ink-faint text-center">
            Check your Spam or Promotions folder if the email doesn&apos;t arrive in 30 seconds.
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
