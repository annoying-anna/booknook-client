import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import ShelfArt from "./ShelfArt";

/* Shared shell for /login and /register */
export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-brand p-12 text-on-brand lg:flex" style={{ background: "#1b2f4e", color: "#fff" }}>
        <p className="max-w-sm text-3xl font-bold leading-tight">Add a book, borrow a book, return a book.</p>
        <ShelfArt className="max-w-xs" />
      </aside>
      <section className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 font-reading text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-ink-soft">{footer}</p>
        </div>
      </section>
    </div>
  );
}

export function GoogleButton({ onClick, label = "Continue with Google" }: { onClick: () => void; label?: string }) {
  return (
    <>
      <div className="my-6 flex items-center gap-4 text-sm text-ink-soft"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
      <button type="button" onClick={onClick} className="btn btn-outline w-full"><FcGoogle size={20} /> {label}</button>
    </>
  );
}

export const AuthLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="font-semibold text-brand underline-offset-4 hover:underline">{children}</Link>
);

/* Live password checklist (same rules as the brief) */
export const passwordChecks = (p: string) => [
  { ok: /[A-Z]/.test(p), label: "One uppercase letter" },
  { ok: /[a-z]/.test(p), label: "One lowercase letter" },
  { ok: p.length >= 6, label: "At least 6 characters" },
];
export const isPasswordValid = (p: string) => passwordChecks(p).every((c) => c.ok);

export function PasswordRules({ password }: { password: string }) {
  return (
    <ul className="mt-2.5 space-y-1.5 text-sm" aria-live="polite">
      {passwordChecks(password).map((c) => (
        <li key={c.label} className={`flex items-center gap-2 ${c.ok ? "text-ok" : "text-ink-soft"}`}>
          {c.ok ? <Check size={15} /> : <Circle size={15} />} {c.label}
        </li>
      ))}
    </ul>
  );
}
