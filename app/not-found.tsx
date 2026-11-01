import Link from "next/link";
import { BookOpen, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg">
          <BookOpen className="w-12 h-12" />
        </div>
        <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-slate-700 text-xs font-black shadow-md">
          404
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Page Not Found
      </h1>

      <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
        The chapter you are looking for has been moved or doesn&apos;t exist in our library archives.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Books</span>
        </Link>
      </div>
    </div>
  );
}
