"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, Compass, Check, RefreshCw } from "lucide-react";
import { spineColor } from "@/lib/categories";
import type { Book } from "@/lib/types";

const VIBES = [
  {
    id: "cosmic",
    label: "Cosmic Wonder & Big Questions",
    category: "Science",
    keywords: ["cosmos", "universe", "time", "physics", "science", "astrophysics"],
    reason: "Because you are craving cosmic perspective, the origins of matter, and existential awe.",
  },
  {
    id: "dystopia",
    label: "Dystopian Thrills & Society",
    category: "Fiction",
    keywords: ["1984", "brave", "fahrenheit", "dystopian", "society", "psychological", "surveillance"],
    reason: "For when you want intense psychological suspense, moral friction, and sharp cultural critiques.",
  },
  {
    id: "history",
    label: "Epic Historical Odysseys",
    category: "History",
    keywords: ["sapiens", "silk", "rome", "civilization", "empire", "revolution", "historical"],
    reason: "A sweeping voyage through centuries of human ambition, strategy, and triumph.",
  },
  {
    id: "whimsical",
    label: "Gentle Wonder & Nostalgia",
    category: "Kids",
    keywords: ["prince", "hobbit", "charlotte", "secret", "wild", "adventure", "friendship"],
    reason: "A cozy sanctuary to soothe your mind with warm fables and timeless innocence.",
  },
  {
    id: "wisdom",
    label: "Stoic Wisdom & Focus",
    category: "Others",
    keywords: ["habits", "meditations", "meaning", "deep", "psychology", "money", "essentialism"],
    reason: "Practical philosophical clarity to sharpen your craft, focus, and inner peace.",
  },
];

export default function BookRecommender({ books }: { books: Book[] }) {
  const [selectedVibe, setSelectedVibe] = useState(VIBES[0]);
  const [isMatching, setIsMatching] = useState(false);

  // Find best matching book
  const match = books.find((b) => {
    if (b.category.toLowerCase() !== selectedVibe.category.toLowerCase()) return false;
    const text = `${b.title} ${b.description}`.toLowerCase();
    return selectedVibe.keywords.some((kw) => text.includes(kw));
  }) || books.find((b) => b.category.toLowerCase() === selectedVibe.category.toLowerCase()) || books[0];

  function handleVibeChange(vibe: typeof VIBES[0]) {
    setIsMatching(true);
    setSelectedVibe(vibe);
    setTimeout(() => {
      setIsMatching(false);
    }, 280);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-surface via-surface to-paper p-6 sm:p-10 shadow-lg">
      <div className="absolute top-0 right-0 -z-0 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-0 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20">
          <Compass size={14} /> Literary Matchmaker
        </div>
        <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-ink">
          Not sure what to read next? Choose your vibe.
        </h2>
        <p className="mt-2 font-reading text-sm sm:text-base text-ink-soft">
          Select what your mind is longing for, and our library curator will match you with a volume.
        </p>
      </div>

      {/* Vibe Selector Buttons */}
      <div className="relative z-10 mt-6 flex flex-wrap gap-2.5">
        {VIBES.map((vibe) => {
          const isSelected = selectedVibe.id === vibe.id;
          return (
            <button
              key={vibe.id}
              onClick={() => handleVibeChange(vibe)}
              className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                isSelected
                  ? "bg-ink text-surface shadow-md scale-105"
                  : "border border-line bg-surface/80 text-ink-soft hover:text-ink hover:border-line-strong hover:bg-surface"
              }`}
            >
              {isSelected && <Sparkles size={13} className="text-amber-400" />}
              <span>{vibe.label}</span>
            </button>
          );
        })}
      </div>

      {/* Recommendation Card */}
      {match && (
        <div
          className={`relative z-10 mt-8 rounded-2xl border border-line bg-surface/90 backdrop-blur-md p-6 sm:p-8 shadow-md transition-all duration-300 ${
            isMatching ? "opacity-40 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
            {/* Book Info */}
            <div className="flex gap-5 items-start">
              <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-paper shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={match.image} alt={match.title} className="h-full w-full object-cover" />
                <span
                  className="absolute inset-y-0 left-0 w-2"
                  style={{ background: spineColor(match.category) }}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: spineColor(match.category) }}
                  >
                    {match.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    99% Match
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-ink leading-tight">
                  {match.title}
                </h3>
                <p className="text-xs font-reading text-ink-soft">
                  Authored by <strong className="text-ink">{match.author}</strong>
                </p>
                <p className="font-reading text-xs text-ink-soft italic pt-1 max-w-lg">
                  &ldquo;{selectedVibe.reason}&rdquo;
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="flex shrink-0 items-center gap-3 w-full md:w-auto justify-end pt-4 md:pt-0 border-t md:border-t-0 border-line">
              <Link
                href={`/books/${match._id}`}
                className="btn btn-primary h-11 px-6 text-xs font-bold shadow-md shadow-blue-500/20 w-full sm:w-auto"
              >
                <span>Read Overview & Borrow</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
