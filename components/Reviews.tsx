import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    q: "The science and astrophysics shelf is outstanding. Borrowing takes literally five seconds, and stock tracking is transparent.",
    n: "Dr. Evelyn Reed",
    r: "Astrophysics Researcher",
    avatarBg: "bg-blue-600",
  },
  {
    q: "My literature students use BookNook weekly. No distracting ads, zero clutter, and beautiful typography. Just pure reading.",
    n: "Marcus Vance",
    r: "Literature Teacher",
    avatarBg: "bg-emerald-600",
  },
  {
    q: "Our local book club hosts our monthly reading list on BookNook. It keeps our copies organised and everyone stays on track.",
    n: "Sophia Chen",
    r: "Book Club Host",
    avatarBg: "bg-purple-600",
  },
];

export default function Reviews() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {REVIEWS.map((r) => (
        <figure
          key={r.n}
          className="flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-line-strong"
        >
          <div>
            <div className="flex items-center gap-1 text-amber-500 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="font-reading text-base leading-relaxed text-ink-soft">
              “{r.q}”
            </blockquote>
          </div>

          <figcaption className="mt-6 pt-5 border-t border-line/60 flex items-center gap-3">
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl text-white font-bold text-sm shadow-sm ${r.avatarBg}`}
            >
              {r.n[0]}
            </span>
            <div>
              <span className="block font-bold text-sm text-ink">{r.n}</span>
              <span className="text-xs text-ink-soft">{r.r}</span>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
