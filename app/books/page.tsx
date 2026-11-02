"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchBooks } from "@/lib/api";
import type { Book } from "@/lib/types";
import BookCard from "@/components/BookCard";
import Loader from "@/components/Loader";
import { EmptyState } from "@/components/tables";
import { Search, Sparkles, SlidersHorizontal, BookOpen } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const ALL_CATEGORIES = ["All", ...Object.keys(CATEGORIES)];

function BooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "BookNook | All Books";
    async function load() {
      try {
        setLoading(true);
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        console.error("Failed to load books:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && ALL_CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    } else if (!cat) {
      setSelectedCategory("All");
    }
  }, [searchParams]);

  function handleCategorySelect(cat: string) {
    setSelectedCategory(cat);
    if (cat === "All") {
      router.push("/books");
    } else {
      router.push(`/books?category=${encodeURIComponent(cat)}`);
    }
  }

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchCat =
        selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [books, selectedCategory, searchQuery]);

  return (
    <div className="wrap section space-y-10">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-line pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 px-3 py-1 text-xs font-bold">
            <BookOpen size={14} /> Community Collection
          </div>
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight text-ink">
            Library Catalog
          </h1>
          <p className="font-reading text-base text-ink-soft max-w-xl">
            Browse our complete shelf of community-curated editions. Pick a title to check details or borrow immediately.
          </p>
        </div>

        <div className="text-sm font-semibold text-ink-soft">
          Showing <span className="font-bold text-ink">{filtered.length}</span> of {books.length} volumes
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-line bg-surface p-4 shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-blue-500/25"
                    : "border border-line bg-surface text-ink-soft hover:text-ink hover:border-brand hover:bg-paper"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            placeholder="Search by title, author, keyword…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 text-xs h-11"
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <Loader label="Gathering books from shelves" />
      ) : filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No books matched your criteria"
          text={
            searchQuery
              ? `We couldn't find any titles matching "${searchQuery}" in ${selectedCategory}.`
              : `There are currently no titles cataloged in ${selectedCategory}.`
          }
          href="/books"
          action="Reset all filters"
        />
      )}
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<Loader label="Loading library catalog" />}>
      <BooksContent />
    </Suspense>
  );
}
