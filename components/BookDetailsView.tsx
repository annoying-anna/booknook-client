import { spineColor } from "@/lib/categories";
import type { Book } from "@/lib/types";
import { ArrowLeft, BookOpen, Calendar, CheckCircle2, ShieldCheck, Star, User, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BookDetailsView({
  book,
  onBorrow,
  alreadyBorrowed,
  busy,
}: {
  book: Book;
  onBorrow: () => void;
  alreadyBorrowed?: boolean;
  busy?: boolean;
}) {
  const out = book.availableCopies !== undefined && book.availableCopies <= 0;
  const copiesFree = book.availableCopies ?? book.totalCopies ?? 0;
  const total = book.totalCopies ?? copiesFree;
  const color = spineColor(book.category);

  return (
    <div className="wrap section">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-brand transition-colors"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_1fr] items-start">
        {/* Left Column: 3D Book Presentation */}
        <div className="relative mx-auto w-full max-w-md self-start lg:sticky lg:top-24">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.image}
              alt={`Cover of ${book.title}`}
              className="h-full w-full object-cover"
            />
            {/* Spine accent bar */}
            <span
              className="absolute inset-y-0 left-0 w-3.5 shadow-[4px_0_12px_rgba(0,0,0,0.35)]"
              style={{ background: color }}
              aria-hidden
            />
            {/* Category Ribbon */}
            <span
              className="absolute top-4 right-4 rounded-xl px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md"
              style={{ background: color }}
            >
              {book.category}
            </span>
          </div>

          {/* Quick highlight banner below book */}
          <div className="mt-6 flex items-center justify-around rounded-2xl border border-line bg-surface p-4 text-center shadow-sm">
            <div>
              <p className="text-xs text-ink-soft">Rating</p>
              <p className="mt-0.5 flex items-center justify-center gap-1 font-bold text-amber-500">
                <Star size={14} className="fill-amber-400" /> 4.9
              </p>
            </div>
            <div className="h-8 w-px bg-line" />
            <div>
              <p className="text-xs text-ink-soft">Loan Period</p>
              <p className="mt-0.5 font-bold text-ink">30 Days</p>
            </div>
            <div className="h-8 w-px bg-line" />
            <div>
              <p className="text-xs text-ink-soft">Format</p>
              <p className="mt-0.5 font-bold text-ink">Hardcover</p>
            </div>
          </div>
        </div>

        {/* Right Column: Book Information & Borrow Action */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: color }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                {book.category} Department
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl tracking-tight text-ink">
              {book.title}
            </h1>
            <p className="mt-3 font-reading text-xl text-ink-soft flex items-center gap-2">
              <User size={18} className="text-ink-faint" />
              <span>Authored by <strong className="text-ink font-semibold">{book.author}</strong></span>
            </p>
          </div>

          {/* Synopsis */}
          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <BookOpen size={18} className="text-blue-600" /> Book Overview
            </h2>
            <p className="font-reading text-base leading-[1.8] text-ink-soft">
              {book.description}
            </p>
          </div>

          {/* Inventory & Status Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <span className="text-xs font-semibold text-ink-soft">Available on Shelf</span>
              <p className="mt-1 text-2xl font-bold text-ink flex items-center gap-2">
                <span className={`inline-block h-3 w-3 rounded-full ${copiesFree > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                {copiesFree} <span className="text-sm font-normal text-ink-soft">of {total} total</span>
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <span className="text-xs font-semibold text-ink-soft">Contributed By</span>
              <p className="mt-1 text-base font-bold text-ink truncate">
                {book.userName || "Community Member"}
              </p>
              <p className="text-xs text-ink-soft truncate">{book.userEmail}</p>
            </div>
          </div>

          {/* Borrow CTA Box */}
          <div className="rounded-2xl border border-line bg-gradient-to-br from-surface to-paper p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-ink">Ready to begin reading?</h3>
                <p className="text-sm text-ink-soft">
                  Select a convenient return date. One copy will be held under your account.
                </p>
              </div>

              {alreadyBorrowed ? (
                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-4 py-2.5 text-sm font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    <CheckCircle2 size={16} /> Currently Borrowed
                  </span>
                  <p className="mt-2 text-xs text-ink-soft">
                    Check <Link href="/my-borrows" className="font-bold underline text-brand">My Borrows</Link> to return.
                  </p>
                </div>
              ) : out ? (
                <button disabled className="btn btn-outline shrink-0 h-12 px-8 font-bold opacity-60">
                  Not Available
                </button>
              ) : (
                <button
                  onClick={onBorrow}
                  disabled={busy}
                  className="btn btn-primary shrink-0 h-12 px-8 font-bold shadow-lg shadow-blue-600/25"
                >
                  <Sparkles size={16} />
                  {busy ? "Processing…" : "Borrow This Book"}
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-line/60 flex items-center gap-2 text-xs text-ink-soft">
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
              <span>Zero late fines • Return anytime online from your member dashboard.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
