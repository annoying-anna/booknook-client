import Link from "next/link";
import { Book } from "@/lib/api";
import { BookMarked, ArrowRight, User } from "lucide-react";

interface BookCardProps {
  book: Book;
}

const categoryColors: Record<string, string> = {
  Fiction: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Science: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  History: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Kids: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Others: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

export default function BookCard({ book }: BookCardProps) {
  const isAvailable = (book.totalCopies ?? 0) > 0;
  const badgeStyle = categoryColors[book.category] || categoryColors.Others;

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Book Cover Image Container */}
      <div className="relative w-full h-56 bg-slate-100 dark:bg-slate-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800"}
          alt={book.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle} shadow-sm backdrop-blur-md`}>
            {book.category}
          </span>
        </div>

        {/* Copies Availability Pill */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
              isAvailable
                ? "bg-emerald-500/90 text-white"
                : "bg-rose-500/90 text-white"
            }`}
          >
            <BookMarked className="w-3 h-3" />
            {isAvailable ? `${book.totalCopies} left` : "Not Available"}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          title={book.title}
          className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
        >
          {book.title}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span>By {book.author}</span>
        </p>

        {book.description && (
          <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* View Details Button - Pushed to bottom */}
        <div className="mt-auto pt-4">
          <Link
            href={`/books/${book._id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-sm transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
