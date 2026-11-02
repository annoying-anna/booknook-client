"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { fetchBooks, fetchMyBorrows } from "@/lib/api";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import { BookOpen, Bookmark, LogOut, Plus } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [addedCount, setAddedCount] = useState<number>(0);
  const [borrowedCount, setBorrowedCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    document.title = "BookNook | Profile";
    if (!sessionLoading && !session?.user) {
      router.push(`/login?redirect=${encodeURIComponent("/profile")}`);
    }
  }, [session, sessionLoading, router]);

  useEffect(() => {
    if (!session?.user?.email) return;

    async function loadStats() {
      try {
        setLoadingStats(true);
        const [allBooks, myBorrows] = await Promise.all([
          fetchBooks({ mine: true }).catch(() => []),
          fetchMyBorrows().catch(() => []),
        ]);
        const myAdded = allBooks.filter((b) => b.userEmail === session?.user?.email);
        setAddedCount(myAdded.length);
        setBorrowedCount(myBorrows.length);
      } catch (err) {
        console.error("Failed to load user stats:", err);
      } finally {
        setLoadingStats(false);
      }
    }

    loadStats();
  }, [session]);

  if (sessionLoading || !session?.user) {
    return <Loader label="Checking session" />;
  }

  const user = session.user;

  async function handleLogout() {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out.");
    }
  }

  return (
    <div className="wrap section max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Profile</h1>
        <p className="mt-2 font-reading text-lg text-ink-soft">
          Your BookNook reader account, library contributions, and active borrows.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-line">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-line bg-brand text-2xl font-bold text-on-brand">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              user.name?.[0]?.toUpperCase()
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="font-reading text-ink-soft">{user.email}</p>
            <span className="mt-2 inline-flex items-center rounded-md bg-ok/10 px-2.5 py-0.5 text-xs font-semibold text-ok">
              Active Member
            </span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline text-danger hover:border-danger">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-line bg-paper/50">
          <div className="p-6 text-center sm:text-left">
            <span className="flex items-center justify-center sm:justify-start gap-2 text-sm text-ink-soft">
              <BookOpen size={16} /> Books Contributed
            </span>
            <p className="mt-2 text-3xl font-bold">
              {loadingStats ? "…" : addedCount}
            </p>
            <Link href="/my-books" className="mt-3 inline-block text-xs font-semibold text-brand underline-offset-4 hover:underline">
              View contributed titles →
            </Link>
          </div>

          <div className="p-6 text-center sm:text-left">
            <span className="flex items-center justify-center sm:justify-start gap-2 text-sm text-ink-soft">
              <Bookmark size={16} /> Currently Borrowed
            </span>
            <p className="mt-2 text-3xl font-bold">
              {loadingStats ? "…" : borrowedCount}
            </p>
            <Link href="/my-borrows" className="mt-3 inline-block text-xs font-semibold text-brand underline-offset-4 hover:underline">
              View borrowed books →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/add-book"
          className="flex items-center gap-4 rounded-xl border border-line bg-surface p-5 transition-transform hover:-translate-y-1"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand text-on-brand">
            <Plus size={20} />
          </span>
          <div>
            <h3 className="font-bold">Add a New Book</h3>
            <p className="text-sm font-reading text-ink-soft">Share another title with the library.</p>
          </div>
        </Link>

        <Link
          href="/books"
          className="flex items-center gap-4 rounded-xl border border-line bg-surface p-5 transition-transform hover:-translate-y-1"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent text-on-accent">
            <BookOpen size={20} />
          </span>
          <div>
            <h3 className="font-bold">Browse Library Catalog</h3>
            <p className="text-sm font-reading text-ink-soft">Explore fiction, science, history and more.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
