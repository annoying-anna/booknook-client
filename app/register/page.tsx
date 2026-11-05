"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Image as ImageIcon, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthLink, AuthShell, GoogleButton, isPasswordValid, PasswordRules } from "@/components/auth";
import Loader from "@/components/Loader";

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

  useEffect(() => {
    document.title = "BookNook | Register";
    if (!isPending && session?.user) router.replace(redirect);
  }, [session, isPending, redirect, router]);

  if (isPending) return <Loader label="Checking your session" />;

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!isPasswordValid(password)) {
      const message = "Use at least 6 characters with one uppercase and one lowercase letter.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoUrl.trim() || undefined,
      });
      if (result.error) {
        const message = result.error.message || "We couldn't create your account.";
        setError(message);
        toast.error(message);
        return;
      }
      toast.success("Your account is ready. Welcome to BookNook!");
      router.push(redirect);
      router.refresh();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "We couldn't create your account. Please try again.";
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
      title="Create your account"
      subtitle="Join the community, share a book, and find your next favorite read."
      footer={<>Already a member? <AuthLink href={redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}>Sign in</AuthLink></>}
    >
      {error && <p role="alert" className="mb-5 rounded-xl border border-danger/20 bg-danger-light p-3 text-sm text-danger">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="label" htmlFor="reg-name">Full name</label>
          <div className="relative"><User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" /><input id="reg-name" className="input pl-10" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" /></div>
        </div>
        <div>
          <label className="label" htmlFor="reg-email">Email address</label>
          <div className="relative"><Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" /><input id="reg-email" type="email" className="input pl-10" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></div>
        </div>
        <div>
          <label className="label" htmlFor="reg-photo">Photo URL <span className="normal-case tracking-normal text-ink-faint">(optional)</span></label>
          <div className="relative"><ImageIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" /><input id="reg-photo" type="url" className="input pl-10" placeholder="https://example.com/photo.jpg" value={photoUrl} onChange={(event) => setPhotoUrl(event.target.value)} autoComplete="url" /></div>
        </div>
        <div>
          <label className="label" htmlFor="reg-password">Password</label>
          <div className="relative"><Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" /><input id="reg-password" type="password" className="input pl-10" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="new-password" /></div>
          <PasswordRules password={password} />
        </div>
        <button type="submit" className="btn btn-primary mt-2 h-12 w-full" disabled={loading || googleLoading || !isPasswordValid(password)}>{loading ? "Creating your account…" : "Create account"}</button>
      </form>
      <GoogleButton onClick={handleGoogle} label="Sign up with Google" loading={googleLoading} />
    </AuthShell>
  );
}

export default function RegisterPage() {
  return <Suspense fallback={<Loader label="Loading registration form" />}><RegisterForm /></Suspense>;
}
