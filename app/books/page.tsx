"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchBooks } from "@/lib/api";
import type { Book } from "@/lib/types";
import BookCard from "@/components/BookCard";
import BookshelfView from "@/components/BookshelfView";
import Loader from "@/components/Loader";
import { EmptyState } from "@/components/tables";
import { Search, Sparkles, SlidersHorizontal, BookOpen, LayoutGrid, Library, ArrowUpDown, Filter } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<"grid" | "shelf">("grid");
  const [sortMode, setSortMode] = useState<"newest" | "title" | "author" | "available">("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

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
    const list = books.filter((b) => {
      const matchCat =
        selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStock = !inStockOnly || (b.availableCopies !== undefined ? b.availableCopies > 0 : (b.totalCopies ?? 1) > 0);
      return matchCat && matchQuery && matchStock;
    });

    return list.sort((a, b) => {
      if (sortMode === "title") return a.title.localeCompare(b.title);
      if (sortMode === "author") return a.author.localeCompare(b.author);
      if (sortMode === "available") return (b.availableCopies ?? 0) - (a.availableCopies ?? 0);
      // default "newest"
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [books, selectedCategory, searchQuery, inStockOnly, sortMode]);

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
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

        {/* View Controls & Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-3 text-xs">
          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl border border-line bg-paper/60 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition-all ${
                  viewMode === "grid" ? "bg-surface text-ink shadow-xs" : "text-ink-soft hover:text-ink"
                }`}
                title="Grid Card View"
              >
                <LayoutGrid size={14} />
                <span>Grid View</span>
              </button>
              <button
                onClick={() => setViewMode("shelf")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition-all ${
                  viewMode === "shelf" ? "bg-surface text-ink shadow-xs" : "text-ink-soft hover:text-ink"
                }`}
                title="Wooden Bookshelf View"
              >
                <Library size={14} />
                <span>Bookshelf Mode</span>
              </button>
            </div>

            {/* In-Stock Filter */}
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-ink-soft hover:text-ink select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded-md accent-blue-600"
              />
              <span>In-Stock Only</span>
            </label>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-ink-soft font-medium">
            <ArrowUpDown size={13} className="text-ink-faint" />
            <span>Sort by:</span>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as "newest" | "title" | "author" | "available")}
              className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-bold text-ink outline-none cursor-pointer hover:border-brand"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="title">Title (A – Z)</option>
              <option value="author">Author (A – Z)</option>
              <option value="available">Most Available Copies</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <Loader label="Gathering books from shelves" />
      ) : filtered.length > 0 ? (
        viewMode === "shelf" ? (
          <BookshelfView books={filtered} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )
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
