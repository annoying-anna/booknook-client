import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import SectionHeading from "@/components/SectionHeading";
import BookCard from "@/components/BookCard";
import HowItWorks from "@/components/HowItWorks";
import CategoryShelf from "@/components/CategoryShelf";
import Reviews from "@/components/Reviews";
import BookRecommender from "@/components/BookRecommender";
import type { Book } from "@/lib/types";
import { BookOpen, Trophy, Users, ShieldCheck } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export const metadata = { title: "BookNook | Home" };

async function getNewArrivals(): Promise<Book[]> {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SERVER_URL || "https://booknook-server-ashy.vercel.app";
    const res = await fetch(`${serverUrl}/books?sort=newest&limit=6`, { cache: "no-store" });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

async function getAllBooks(): Promise<Book[]> {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SERVER_URL || "https://booknook-server-ashy.vercel.app";
    const res = await fetch(`${serverUrl}/books`, { cache: "no-store" });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [books, allBooks] = await Promise.all([
    getNewArrivals(),
    getAllBooks(),
  ]);

  return (
    <>
      <HeroSlider />

      {/* Live community catalog snapshot */}
      <section className="border-b border-line bg-surface/80 py-6">
        <div className="wrap grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-ink">{allBooks.length}</p>
            <p className="text-xs font-reading text-ink-soft flex items-center justify-center gap-1">
              <BookOpen size={13} className="text-blue-500" /> Books in the catalog
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-ink">{new Set(allBooks.map((book) => book.userEmail).filter(Boolean)).size}</p>
            <p className="text-xs font-reading text-ink-soft flex items-center justify-center gap-1">
              <Users size={13} className="text-emerald-500" /> Book contributors
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-ink">{allBooks.reduce((total, book) => total + (book.availableCopies ?? book.totalCopies ?? 0), 0)}</p>
            <p className="text-xs font-reading text-ink-soft flex items-center justify-center gap-1">
              <ShieldCheck size={13} className="text-indigo-500" /> Copies available
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-ink">{Object.keys(CATEGORIES).length}</p>
            <p className="text-xs font-reading text-ink-soft flex items-center justify-center gap-1">
              <Trophy size={13} className="text-amber-500" /> Book categories
            </p>
          </div>
        </div>
      </section>

      {/* New Arrivals Section (Rule 8) */}
      <section className="section wrap">
        <SectionHeading title="New arrivals" text="The six newest books added by our members." href="/books" action="See All Books" />
        {books.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{books.map((b) => <BookCard key={b._id} book={b} />)}</div>
        ) : (
          <div className="rounded-xl border border-dashed border-line p-10 text-center">
            <p className="text-lg font-semibold">The shelves are empty.</p>
            <p className="mt-1 text-ink-soft">Be the first to add a book.</p>
            <Link href="/add-book" className="btn btn-primary mt-5">Add a Book</Link>
          </div>
        )}
      </section>

      {/* Interactive Literary Matchmaker */}
      <section className="section wrap pt-0">
        <BookRecommender books={allBooks.length ? allBooks : books} />
      </section>

      {/* How Borrowing Works Section (Rule 8) */}
      <section className="section border-y border-line bg-surface/60">
        <div className="wrap">
          <SectionHeading title="How borrowing works" text="Three steps from browsing to returning." />
          <HowItWorks />
        </div>
      </section>

      {/* Browse by Category Section (Rule 8) */}
      <section className="section wrap">
        <SectionHeading title="Browse by category" text="Each category has its own spine colour. You will see it on every card." />
        <CategoryShelf />
      </section>

      {/* Ways to use the community library */}
      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHeading title="A little more room for reading" text="Everything you need to share a book and keep a loan on track." />
          <Reviews />
        </div>
      </section>
    </>
  );
}
