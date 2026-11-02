"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { AuthShell, GoogleButton, AuthLink, PasswordRules, isPasswordValid } from "@/components/auth";
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
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "BookNook | Register";
    if (!isPending && session?.user) {
      router.push(redirect);
    }
  }, [session, isPending, redirect, router]);

  if (isPending) {
    return <Loader label="Checking session" />;
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
        toast.success("Account registered successfully! Please log in.");
        const target = redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";
        router.push(target);
      }
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "Failed to register. Please try again.";
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
      toast.error("Google registration failed. Please try again.");
    }
  }

  const valid = isPasswordValid(password);

  return (
    <AuthShell
      title="Create an account"
      subtitle="Join the BookNook reading community today."
      footer={
        <>
          Already have an account?{" "}
          <AuthLink href={redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}>
            Sign in
          </AuthLink>
        </>
      }
    >
      {error && <div className="mb-4 rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</div>}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="label" htmlFor="reg-name">Full Name</label>
          <input
            id="reg-name"
            type="text"
            className="input"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label className="label" htmlFor="reg-email">Email Address</label>
          <input
            id="reg-email"
            type="email"
            className="input"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="label" htmlFor="reg-photo">Photo URL (optional)</label>
          <input
            id="reg-photo"
            type="url"
            className="input"
            placeholder="https://images.unsplash.com/photo-..."
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            className="input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <PasswordRules password={password} />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-2"
          disabled={loading || !valid}
        >
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>

      <GoogleButton onClick={handleGoogle} label="Sign up with Google" />
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loader label="Loading register" />}>
      <RegisterForm />
    </Suspense>
  );
}
