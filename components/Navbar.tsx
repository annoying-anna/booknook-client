"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookOpen, LogOut, Menu, User, X } from "lucide-react";
import { authClient } from "@/lib/auth-client"; // your BetterAuth client
import ThemeToggle from "./ThemeToggle";

const PUBLIC = [{ href: "/", label: "Home" }, { href: "/books", label: "All Books" }];
const PRIVATE = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="BookNook home">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-on-brand"><BookOpen size={20} /></span>
      <span className="text-xl font-bold tracking-tight">BookNook</span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMenu(false); setDrop(false); }, [pathname]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDrop(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const links = user ? [...PUBLIC, ...PRIVATE] : PUBLIC;
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  async function logout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}
              className={`relative py-2 text-sm font-medium transition-colors ${active(l.href) ? "text-ink" : "text-ink-soft hover:text-ink"}`}>
              {l.label}
              {active(l.href) && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded bg-accent" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isPending ? (
            <span className="h-10 w-10 rounded-full bg-line/70" aria-hidden />
          ) : user ? (
            <div className="relative" ref={dropRef}>
              <button onClick={() => setDrop((v) => !v)} aria-haspopup="menu" aria-expanded={drop} aria-label="Account menu"
                className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border-2 border-line bg-brand text-sm font-bold text-on-brand hover:border-brand">
                {user.image
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={user.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  : user.name?.[0]?.toUpperCase()}
              </button>
              {drop && (
                <div role="menu" className="animate-pop absolute right-0 mt-2 w-64 rounded-xl border border-line bg-surface p-2 shadow-xl">
                  <div className="border-b border-line px-3 pb-3 pt-2">
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="truncate text-sm text-ink-soft">{user.email}</p>
                  </div>
                  <Link role="menuitem" href="/profile" className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm hover:bg-paper"><User size={16} /> My Profile</Link>
                  <button role="menuitem" onClick={logout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-danger hover:bg-paper"><LogOut size={16} /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn btn-outline h-10">Login</Link>
              <Link href="/register" className="btn btn-primary h-10">Register</Link>
            </div>
          )}

          <button className="grid h-10 w-10 place-items-center rounded-lg border border-line md:hidden" onClick={() => setMenu((v) => !v)} aria-label="Toggle menu" aria-expanded={menu}>
            {menu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menu && (
        <nav className="animate-pop border-t border-line bg-paper md:hidden" aria-label="Mobile">
          <div className="wrap flex flex-col py-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`rounded-lg px-3 py-3 text-base font-medium ${active(l.href) ? "bg-surface text-ink" : "text-ink-soft"}`}>{l.label}</Link>
            ))}
            {!isPending && !user && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/login" className="btn btn-outline">Login</Link>
                <Link href="/register" className="btn btn-primary">Register</Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
