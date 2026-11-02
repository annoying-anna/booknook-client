"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookOpen, LogOut, Menu, User, X, PlusCircle, Bookmark, Compass } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "./ThemeToggle";

const PUBLIC = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Catalog" },
];

const PRIVATE = [
  { href: "/add-book", label: "Add Book", icon: PlusCircle },
  { href: "/my-books", label: "My Books", icon: BookOpen },
  { href: "/my-borrows", label: "My Borrows", icon: Bookmark },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="BookNook home">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 text-white shadow-md shadow-blue-600/25 transition-transform group-hover:scale-105">
        <BookOpen size={20} className="transition-transform group-hover:rotate-6" />
      </div>
      <div>
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
          BookNook
        </span>
        <span className="hidden sm:block text-[10px] font-bold tracking-widest uppercase text-ink-faint">
          Online Library
        </span>
      </div>
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

  useEffect(() => {
    setMenu(false);
    setDrop(false);
  }, [pathname]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDrop(false);
      }
    };
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
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/85 backdrop-blur-md transition-colors">
      <div className="wrap flex h-18 items-center justify-between gap-4">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main">
          {links.map((l) => {
            const isAct = active(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isAct ? "page" : undefined}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isAct
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                    : "text-ink-soft hover:text-ink hover:bg-paper"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-xl bg-line" aria-hidden />
          ) : user ? (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDrop((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={drop}
                aria-label="Account menu"
                className="flex items-center gap-2 p-1 rounded-xl border border-line bg-surface hover:border-brand transition-all shadow-sm active:scale-95"
              >
                <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-blue-600 text-xs font-bold text-white">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    user.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <span className="hidden lg:block text-xs font-semibold max-w-[90px] truncate text-ink pr-1">
                  {user.name?.split(" ")[0]}
                </span>
              </button>

              {drop && (
                <div
                  role="menu"
                  className="animate-pop absolute right-0 mt-2 w-64 rounded-2xl border border-line bg-surface p-2 shadow-2xl z-50"
                >
                  <div className="border-b border-line px-3 pb-3 pt-2">
                    <p className="truncate font-bold text-sm text-ink">{user.name}</p>
                    <p className="truncate text-xs text-ink-soft">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      role="menuitem"
                      href="/profile"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-paper font-medium"
                    >
                      <User size={16} className="text-blue-600" /> My Profile
                    </Link>
                    <Link
                      role="menuitem"
                      href="/my-borrows"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-paper font-medium"
                    >
                      <Bookmark size={16} className="text-amber-500" /> My Borrows
                    </Link>
                  </div>
                  <div className="border-t border-line pt-1">
                    <button
                      role="menuitem"
                      onClick={logout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn btn-outline h-10 px-4 text-xs">
                Log In
              </Link>
              <Link href="/register" className="btn btn-primary h-10 px-4 text-xs">
                Join Free
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-line md:hidden text-ink hover:bg-paper"
            onClick={() => setMenu((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menu}
          >
            {menu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menu && (
        <nav className="animate-pop border-t border-line bg-surface md:hidden" aria-label="Mobile">
          <div className="wrap flex flex-col py-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active(l.href)
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                    : "text-ink-soft hover:text-ink hover:bg-paper"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {!isPending && !user && (
              <div className="mt-4 pt-4 border-t border-line grid grid-cols-2 gap-3">
                <Link href="/login" className="btn btn-outline">
                  Log In
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
