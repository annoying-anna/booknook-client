import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import SectionHeading from "@/components/SectionHeading";
import BookCard from "@/components/BookCard";
import HowItWorks from "@/components/HowItWorks";
import CategoryShelf from "@/components/CategoryShelf";
import Reviews from "@/components/Reviews";
import type { Book } from "@/lib/types";

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

export default async function Home() {
  const books = await getNewArrivals();
  return (
    <>
      <HeroSlider />

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

      <section className="section border-y border-line bg-surface/60">
        <div className="wrap">
          <SectionHeading title="How borrowing works" text="Three steps from browsing to returning." />
          <HowItWorks />
        </div>
      </section>

      <section className="section wrap">
        <SectionHeading title="Browse by category" text="Each category has its own spine colour. You will see it on every card." />
        <CategoryShelf />
      </section>

      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHeading title="What readers say" />
          <Reviews />
        </div>
      </section>
    </>
  );
}
