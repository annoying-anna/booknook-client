"use client";

import { useState } from "react";
import Link from "next/link";
import { spineColor } from "@/lib/categories";
import type { Book } from "@/lib/types";
import { ArrowRight, BookOpen, CheckCircle2, Star, Sparkles, X } from "lucide-react";

export default function BookshelfView({ books }: { books: Book[] }) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Group books into shelves of 7-8 books each
  const SHELF_SIZE = 7;
  const shelves: Book[][] = [];
  for (let i = 0; i < books.length; i += SHELF_SIZE) {
    shelves.push(books.slice(i, i + SHELF_SIZE));
  }

  return (
    <div className="space-y-12">
      {shelves.map((shelf, shelfIdx) => (
        <div key={shelfIdx} className="relative">
          {/* Shelf Label */}
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink-faint">
            <span>Shelf {shelfIdx + 1} • {shelf.length} Volumes</span>
            <span className="hidden sm:inline">Click a spine to examine volume</span>
          </div>

          {/* Book Row */}
          <div className="relative flex items-end justify-center sm:justify-start gap-2 sm:gap-3 px-4 pt-10 pb-1 overflow-x-auto min-h-[260px] no-scrollbar">
            {shelf.map((book) => {
              const color = spineColor(book.category);
              const isAvailable = (book.availableCopies ?? 1) > 0;
              const isSelected = selectedBook?._id === book._id;

              return (
                <button
                  key={book._id}
                  onClick={() => setSelectedBook(book)}
                  title={`${book.title} by ${book.author}`}
                  className={`group relative flex flex-col items-center justify-between rounded-t-sm transition-all duration-300 transform-gpu cursor-pointer shrink-0 select-none ${
                    isSelected ? "-translate-y-6 scale-105 shadow-2xl z-20" : "hover:-translate-y-4 hover:shadow-xl hover:z-10"
                  }`}
                  style={{
                    width: "clamp(38px, 6vw, 54px)",
                    height: "clamp(200px, 28vw, 240px)",
                    background: color,
                    boxShadow: isSelected
                      ? `0 12px 24px -6px rgba(0,0,0,0.4), inset 3px 0 6px rgba(255,255,255,0.25), inset -3px 0 6px rgba(0,0,0,0.4)`
                      : `2px 2px 8px rgba(0,0,0,0.25), inset 2px 0 4px rgba(255,255,255,0.2), inset -2px 0 4px rgba(0,0,0,0.35)`,
                  }}
                >
                  {/* Gold Foil Top Band */}
                  <div className="w-full h-3 border-b border-amber-300/40 bg-black/15 flex items-center justify-center">
                    <span className="w-2 h-0.5 bg-amber-300/60 rounded-full" />
                  </div>

                  {/* Vertical Spine Title & Author */}
                  <div className="flex-1 flex items-center justify-center py-2 overflow-hidden w-full">
                    <span
                      className="text-[11px] font-bold text-white tracking-wider whitespace-nowrap uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        maxHeight: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {book.title}
                    </span>
                  </div>

                  {/* Gold Foil Bottom Band & Category Mark */}
                  <div className="w-full py-1.5 border-t border-amber-300/40 bg-black/20 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-black text-amber-200/90 tracking-tighter uppercase">
                      {book.category.slice(0, 3)}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-400" : "bg-rose-400"}`}
                      title={isAvailable ? "Available" : "Checked Out"}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Wooden Shelf Plank */}
          <div
            className="h-5 w-full rounded-sm shadow-xl relative"
            style={{
              background: "linear-gradient(180deg, #5c381c 0%, #3e2410 40%, #2a180a 100%)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.15)",
            }}
          >
            {/* Shelf highlight ridge */}
            <div className="absolute top-0 inset-x-0 h-1 bg-amber-500/20" />
            {/* Shadow beneath shelf */}
            <div className="absolute -bottom-3 inset-x-0 h-3 bg-black/30 blur-sm pointer-events-none" />
          </div>
        </div>
      ))}

      {/* Book Inspector Drawer / Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-2xl animate-scale-up">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-line bg-paper text-ink-soft hover:text-ink hover:bg-surface transition-all"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Cover Preview */}
              <div className="relative aspect-[3/4] w-36 shrink-0 overflow-hidden rounded-2xl border border-line bg-paper shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedBook.image}
                  alt={selectedBook.title}
                  className="h-full w-full object-cover"
                />
                <span
                  className="absolute inset-y-0 left-0 w-2.5"
                  style={{ background: spineColor(selectedBook.category) }}
                />
              </div>

              {/* Info Details */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-lg px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm"
                    style={{ background: spineColor(selectedBook.category) }}
                  >
                    {selectedBook.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star size={13} className="fill-amber-400" /> 4.9
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-ink leading-tight">
                  {selectedBook.title}
                </h3>
                <p className="text-sm font-reading text-ink-soft">
                  by <strong className="text-ink">{selectedBook.author}</strong>
                </p>

                <p className="line-clamp-3 text-xs leading-relaxed text-ink-soft font-reading">
                  {selectedBook.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-line">
                  <div className="text-xs">
                    {(selectedBook.availableCopies ?? 1) > 0 ? (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={14} /> {selectedBook.availableCopies ?? selectedBook.totalCopies} Copies Free
                      </span>
                    ) : (
                      <span className="font-bold text-rose-500">Currently Checked Out</span>
                    )}
                  </div>

                  <Link
                    href={`/books/${selectedBook._id}`}
                    className="btn btn-primary h-9 px-4 text-xs font-bold"
                  >
                    <span>Examine Edition</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
