import { spineColor } from "@/lib/categories";
import type { Book } from "@/lib/types";

export default function BookDetailsView({ book, onBorrow, alreadyBorrowed, busy }: { book: Book; onBorrow: () => void; alreadyBorrowed?: boolean; busy?: boolean }) {
  const out = book.availableCopies !== undefined && book.availableCopies <= 0;
  const label = out ? "Not Available" : alreadyBorrowed ? "Already Borrowed" : "Borrow This Book";
  return (
    <div className="wrap section grid gap-10 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-14">
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm self-start overflow-hidden rounded-xl border border-line bg-line/50 md:sticky md:top-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={book.image} alt={`Cover of ${book.title}`} className="h-full w-full object-cover" />
        <span className="absolute inset-y-0 left-0 w-3" style={{ background: spineColor(book.category) }} aria-hidden />
      </div>

      <div>
        <span className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1 text-sm font-medium">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: spineColor(book.category) }} />{book.category}
        </span>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{book.title}</h1>
        <p className="mt-2 font-reading text-xl text-ink-soft">by {book.author}</p>

        <p className="mt-8 max-w-prose font-reading text-lg leading-[1.8]">{book.description}</p>

        <dl className="mt-8 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line text-sm">
          <div className="bg-surface p-4"><dt className="text-ink-soft">Added by</dt><dd className="mt-1 font-semibold">{book.userName}</dd></div>
          <div className="bg-surface p-4"><dt className="text-ink-soft">Copies free</dt><dd className="mt-1 font-semibold">{book.availableCopies ?? "–"}{book.totalCopies ? ` of ${book.totalCopies}` : ""}</dd></div>
        </dl>

        <button onClick={onBorrow} disabled={out || alreadyBorrowed || busy} className="btn btn-accent mt-8 h-12 px-8">{label}</button>
        {alreadyBorrowed && <p className="mt-3 text-sm text-ink-soft">Return it from My Borrows to borrow it again.</p>}
      </div>
    </div>
  );
}
