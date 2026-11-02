import Link from "next/link";
import { Check, Circle, BookOpen, Sparkles, ShieldCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import ShelfArt from "./ShelfArt";

/* Shared shell for /login and /register */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-2">
      {/* Left Showcase Banner */}
      <aside className="relative hidden flex-col justify-between bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-12 text-white lg:flex overflow-hidden">
        <div className="absolute top-0 right-0 -z-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold shadow-lg">
              <BookOpen size={20} />
            </span>
            <span className="text-2xl font-extrabold tracking-tight">BookNook</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" />
            <span>Over 2,400+ Active Loans</span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight text-white">
            A sanctuary for passionate readers and book collectors.
          </h2>
          <p className="font-reading text-base leading-relaxed text-slate-300">
            Join our community library to share books you cherish and borrow rare editions with zero late fees.
          </p>
          <div className="pt-4">
            <ShelfArt className="max-w-xs drop-shadow-2xl" />
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 border-t border-white/10 pt-6 text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" /> BetterAuth Secure
          </span>
          <span>•</span>
          <span>Instant Access</span>
          <span>•</span>
          <span>100% Free</span>
        </div>
      </aside>

      {/* Right Form Container */}
      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
            <p className="mt-2.5 font-reading text-base text-ink-soft">{subtitle}</p>
          </div>
          <div>{children}</div>
          <p className="text-center text-sm text-ink-soft">{footer}</p>
        </div>
      </section>
    </div>
  );
}

export function GoogleButton({
  onClick,
  label = "Continue with Google",
  loading = false,
}: {
  onClick: () => void;
  label?: string;
  loading?: boolean;
}) {
  return (
    <>
      <div className="my-6 flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-ink-faint">
        <span className="h-px flex-1 bg-line" />
        or continue with
        <span className="h-px flex-1 bg-line" />
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="btn btn-outline w-full h-12 text-sm font-semibold shadow-sm hover:border-brand hover:shadow-md transition-all flex items-center justify-center gap-3"
      >
        <FcGoogle size={20} />
        <span>{loading ? "Connecting to Google…" : label}</span>
      </button>
    </>
  );
}

export const AuthLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="font-bold text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline">
    {children}
  </Link>
);

/* Live password checklist */
export const passwordChecks = (p: string) => [
  { ok: /[A-Z]/.test(p), label: "At least one uppercase letter (A-Z)" },
  { ok: /[a-z]/.test(p), label: "At least one lowercase letter (a-z)" },
  { ok: p.length >= 6, label: "At least 6 characters in length" },
];
export const isPasswordValid = (p: string) => passwordChecks(p).every((c) => c.ok);

export function PasswordRules({ password }: { password: string }) {
  if (!password) return null;
  return (
    <ul className="mt-3 space-y-1.5 rounded-xl border border-line bg-paper/60 p-3 text-xs" aria-live="polite">
      {passwordChecks(password).map((c) => (
        <li
          key={c.label}
          className={`flex items-center gap-2 font-medium ${
            c.ok ? "text-emerald-600 dark:text-emerald-400" : "text-ink-soft"
          }`}
        >
          {c.ok ? (
            <Check size={14} className="shrink-0 text-emerald-500 font-bold" />
          ) : (
            <Circle size={14} className="shrink-0 text-ink-faint" />
          )}
          <span>{c.label}</span>
        </li>
      ))}
    </ul>
  );
}
