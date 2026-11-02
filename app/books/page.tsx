"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchBooks } from "@/lib/api";
import type { Book } from "@/lib/types";
import BookCard from "@/components/BookCard";
import Loader from "@/components/Loader";
import { EmptyState } from "@/components/tables";
import { Search } from "lucide-react";
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
      const matchCat = selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [books, selectedCategory, searchQuery]);

  return (
    <div className="wrap section space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All Books</h1>
        <p className="mt-2 font-reading text-lg text-ink-soft">
          Explore our entire library catalog across fiction, science, history, children, and more.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-brand text-on-brand"
                  : "border border-line bg-surface text-ink-soft hover:text-ink hover:border-brand"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            placeholder="Search by title or author…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 h-10 text-xs"
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
          title="No books found"
          text={
            searchQuery
              ? `No books matching "${searchQuery}" in ${selectedCategory} category.`
              : "No books available in this category yet."
          }
          href="/books"
          action="Show all books"
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
