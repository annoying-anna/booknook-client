"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn, useSession } from "@/lib/auth-client";
import {
  BookOpen,
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  UserPlus,
  Check,
  X,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

// Google Icon SVG Component
function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12c0 2.02.46 3.84 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "BookNook | Register";
    if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  // Password validation rules according to assignment requirements:
  // - Must have an Uppercase letter in the password
  // - Must have a Lowercase letter in the password
  // - Length must be at least 6 characters
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpperCase && hasLowerCase && hasMinLength;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isPasswordValid) {
      let reason = "Password does not meet requirements:";
      if (!hasMinLength) reason += " Minimum 6 characters.";
      if (!hasUpperCase) reason += " Must contain an uppercase letter.";
      if (!hasLowerCase) reason += " Must contain a lowercase letter.";
      setErrorMessage(reason);
      toast.error(reason);
      return;
    }

    setLoading(true);
    try {
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoUrl.trim() || undefined,
      });

      if (res.error) {
        const errorText = res.error.message || "Registration failed";
        setErrorMessage(errorText);
        toast.error(errorText);
      } else {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      }
    } catch (err: unknown) {
      const errorText = (err as Error)?.message || "Registration failed. Please try again.";
      setErrorMessage(errorText);
      toast.error(errorText);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setSocialLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setSocialLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto py-8">
      {/* Brand header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25">
            <BookOpen className="w-6 h-6" />
          </div>
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create Your Account
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Join BookNook to borrow books, track your reading history, and share literature.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10">
        {/* Error alert inside form */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Google Social Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={socialLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
        >
          {socialLoading ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon className="w-5 h-5" />
          )}
          <span>Register with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold tracking-wider">
              Or with credentials
            </span>
          </div>
        </div>

        {/* Form fields: Name, Email, Photo-URL, Password, & Register Button */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-500" />
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Himel Barman"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-500" />
              Email Address *
            </label>
            <input
              type="email"
              placeholder="reader@booknook.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
              Photo URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              Password *
            </label>
            <input
              type="password"
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />

            {/* Password Validation Checklist */}
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className={hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500"}>
                  At least 6 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasUpperCase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className={hasUpperCase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500"}>
                  Contains an uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasLowerCase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className={hasLowerCase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500"}>
                  Contains a lowercase letter (a-z)
                </span>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || socialLoading || !isPasswordValid}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:bg-emerald-400 disabled:cursor-not-allowed shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Link for Login */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Login here</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
