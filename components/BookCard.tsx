import Link from "next/link";
import { spineColor } from "@/lib/categories";
import type { Book } from "@/lib/types";

export default function BookCard({ book }: { book: Book }) {
  const out = book.availableCopies !== undefined && book.availableCopies <= 0;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-line/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={book.image} alt={`Cover of ${book.title}`} className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute inset-y-0 left-0 w-2.5" style={{ background: spineColor(book.category) }} aria-hidden />
        {out && <span className="absolute right-3 top-3 rounded-md bg-ink px-2.5 py-1 text-xs font-semibold text-paper">Not available</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="flex items-center gap-2 text-sm text-ink-soft">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: spineColor(book.category) }} aria-hidden />
          {book.category}
        </span>
        <h3 className="mt-2 line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug">{book.title}</h3>
        <p className="mt-1 line-clamp-1 font-reading text-ink-soft">{book.author}</p>
        <Link href={`/books/${book._id}`} className="btn btn-primary mt-5">View Details</Link>
      </div>
    </article>
  );
}
