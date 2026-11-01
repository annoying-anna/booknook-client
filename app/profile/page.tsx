"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { fetchBooks, fetchMyBorrows } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  User,
  Mail,
  ShieldCheck,
  BookOpen,
  Bookmark,
  PlusCircle,
  LogOut,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [addedCount, setAddedCount] = useState<number>(0);
  const [borrowedCount, setBorrowedCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    document.title = "BookNook | My Profile";
    if (!sessionLoading && !session?.user) {
      toast.error("Please login to view your profile!");
      router.push("/login?callbackUrl=/profile");
      return;
    }

    async function loadStats() {
      if (!session?.user?.email) return;
      try {
        setLoadingStats(true);
        const [myBooks, myBorrows] = await Promise.all([
          fetchBooks({ email: session.user.email }).catch(() => []),
          fetchMyBorrows(session.user.email).catch(() => []),
        ]);
        setAddedCount(myBooks.length);
        setBorrowedCount(myBorrows.length);
      } catch (err) {
        console.error("Failed to load user stats:", err);
      } finally {
        setLoadingStats(false);
      }
    }

    if (session?.user) {
      loadStats();
    }
  }, [session, sessionLoading, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out!");
      router.push("/login");
    } catch {
      toast.error("Failed to log out.");
    }
  };

  if (sessionLoading) {
    return <LoadingSpinner text="Loading your profile..." />;
  }

  if (!session?.user) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 pb-16">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || "User Avatar"}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-emerald-500/30 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-emerald-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-md">
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow-md">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {session.user.name || "Member"}
            </h1>
            <p className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Mail className="w-4 h-4 text-emerald-500" />
              <span>{session.user.email}</span>
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Active BookNook Reader</span>
            </div>
          </div>

          {/* Logout Action */}
          <div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Books Contributed
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {loadingStats ? "..." : addedCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Borrows
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {loadingStats ? "..." : borrowedCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bookmark className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link
          href="/add-book"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Add a Book
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Contribute a new book to the library catalog with cover image.
          </p>
        </Link>

        <Link
          href="/my-books"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            My Books
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View, edit details, or remove books you have uploaded.
          </p>
        </Link>

        <Link
          href="/my-borrows"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            My Borrows
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Check due return dates and return borrowed copies.
          </p>
        </Link>
      </div>
    </div>
  );
}
