import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { ArrowRight, BookOpen, Compass, Sparkles } from "lucide-react";

export default function CategoryShelf() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(CATEGORIES).map(([name, c]) => (
          <Link
            key={name}
            href={`/books?category=${encodeURIComponent(name)}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            {/* Top spine color bar */}
            <div
              className="absolute top-0 inset-x-0 h-2 transition-all duration-300 group-hover:h-3"
              style={{ background: c.color }}
            />

            <div>
              <div
                className="mb-4 inline-grid h-10 w-10 place-items-center rounded-xl text-white shadow-md"
                style={{ background: c.color }}
              >
                <BookOpen size={18} />
              </div>
              <h3 className="text-xl font-bold text-ink group-hover:text-brand transition-colors">
                {name}
              </h3>
              <p className="mt-2 text-xs font-reading text-ink-soft leading-relaxed">
                {c.blurb}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-xs font-bold text-ink-soft group-hover:text-brand">
              <span>Explore titles</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
