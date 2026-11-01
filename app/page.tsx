"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Book, fetchNewArrivals } from "@/lib/api";
import HomeSlider from "@/components/HomeSlider";
import BookCard from "@/components/BookCard";
import HowItWorks from "@/components/HowItWorks";
import TopCategories from "@/components/TopCategories";
import ReaderReviews from "@/components/ReaderReviews";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "BookNook | Home";
    async function loadBooks() {
      try {
        const books = await fetchNewArrivals();
        setNewArrivals(books);
      } catch (err) {
        console.error("Failed to load new arrivals:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  return (
    <div className="space-y-12 pb-8">
      {/* 1. Hero Banner Slider with Swiper.js (min 3 slides) */}
      <HomeSlider />

      {/* 2. New Arrivals (Dynamic from MongoDB) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Off The Press</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              New Arrivals
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Explore the latest 6 additions to our community library collection.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching new arrivals..." />
        ) : newArrivals.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No books available right now.
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Be the first reader to add a book to BookNook!
            </p>
            <Link
              href="/add-book"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              Add a Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}

        {/* "See All Books" button below cards as required */}
        {newArrivals.length > 0 && (
          <div className="pt-4 text-center">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>See All Books</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* 3. Extra Section 1: How Borrowing Works */}
      <HowItWorks />

      {/* 4. Extra Section 2: Top Categories */}
      <TopCategories />

      {/* 5. Extra Section 3: Reader Community & Reviews */}
      <ReaderReviews />
    </div>
  );
}
