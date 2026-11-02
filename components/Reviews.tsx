const REVIEWS = [
  { q: "The science shelf is excellent, and borrowing takes about five seconds.", n: "Dr. Evelyn Reed", r: "Astrophysics researcher" },
  { q: "My students read here every week. No ads, no clutter, just books.", n: "Marcus Vance", r: "Literature teacher" },
  { q: "We add our book club picks and can see who has what. It keeps our shelf organised.", n: "Sophia Chen", r: "Book club host" },
];

export default function Reviews() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {REVIEWS.map((r) => (
        <figure key={r.n} className="flex h-full flex-col rounded-xl border border-line bg-surface p-6">
          <blockquote className="flex-1 font-reading text-lg leading-relaxed">“{r.q}”</blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand font-bold text-on-brand">{r.n[0]}</span>
            <span><span className="block font-semibold">{r.n}</span><span className="text-sm text-ink-soft">{r.r}</span></span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
