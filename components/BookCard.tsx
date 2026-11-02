import Link from "next/link";
import { spineColor } from "@/lib/categories";
import type { Book } from "@/lib/types";
import { ArrowRight, Star, User } from "lucide-react";

export default function BookCard({ book }: { book: Book }) {
  const isAvailable = book.availableCopies !== undefined ? book.availableCopies > 0 : (book.totalCopies ?? 1) > 0;
  const copiesCount = book.availableCopies ?? book.totalCopies ?? 0;
  const color = spineColor(book.category);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-line-strong">
      {/* Cover Image Wrapper with Spine Ribbon */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.image}
          alt={`Cover of ${book.title}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* 3D Spine Colored Accent Bar */}
        <span
          className="absolute inset-y-0 left-0 w-3 shadow-[2px_0_8px_rgba(0,0,0,0.25)] transition-all"
          style={{ background: color }}
          aria-hidden
        />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          {/* Availability Badge */}
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {copiesCount} {copiesCount === 1 ? "Copy" : "Copies"} Free
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-rose-600/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-md">
              Checked Out
            </span>
          )}
        </div>

        {/* Category Pill Over Image */}
        <div className="absolute bottom-3 left-6">
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md"
            style={{ background: color }}
          >
            {book.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
        <div>
          {/* Rating & Category header */}
          <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Star size={13} className="fill-amber-400 text-amber-400" /> 4.9
            </span>
            <span className="font-reading text-ink-faint">Hardcover Edition</span>
          </div>

          <h3 className="line-clamp-2 min-h-[3rem] text-lg font-bold leading-snug text-ink group-hover:text-brand transition-colors">
            {book.title}
          </h3>

          <p className="mt-1 line-clamp-1 font-reading text-sm text-ink-soft flex items-center gap-1.5">
            <User size={13} className="text-ink-faint shrink-0" />
            <span>by {book.author}</span>
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="pt-5 mt-4 border-t border-line/60 flex items-center justify-between">
          <div className="text-xs text-ink-soft font-medium">
            Added by: <span className="font-bold text-ink">{book.userName?.split(" ")[0] || "Member"}</span>
          </div>
          <Link
            href={`/books/${book._id}`}
            className="btn btn-primary h-9 px-4 text-xs font-semibold group-hover:bg-blue-700"
          >
            <span>View Book</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
