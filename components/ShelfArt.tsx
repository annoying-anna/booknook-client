// Decorative row of book spines (CSS only, no images).
const SPINES = [
  { h: "h-40", w: "w-9", c: "--spine-history" },
  { h: "h-56", w: "w-11", c: "--spine-fiction" },
  { h: "h-48", w: "w-8", c: "--spine-science" },
  { h: "h-60", w: "w-10", c: "--spine-kids" },
  { h: "h-44", w: "w-12", c: "--spine-others" },
  { h: "h-52", w: "w-9", c: "--spine-fiction", lean: true },
];

export default function ShelfArt({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div className="flex items-end gap-1.5">
        {SPINES.map((s, i) => (
          <div key={i} className={`relative rounded-t-sm shadow-[inset_-3px_0_0_rgba(0,0,0,0.18)] ${s.h} ${s.w} ${s.lean ? "origin-bottom-left rotate-[7deg]" : ""}`} style={{ background: `var(${s.c})` }}>
            <span className="absolute inset-x-0 top-5 h-1.5 bg-white/35" />
            <span className="absolute inset-x-0 top-9 h-px bg-white/25" />
            <span className="absolute inset-x-0 bottom-6 h-1.5 bg-white/35" />
          </div>
        ))}
      </div>
      <div className="h-3 rounded-sm bg-white/20" />
    </div>
  );
}
