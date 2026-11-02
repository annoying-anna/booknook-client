import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

// Desktop: spines of different heights on a shelf. Mobile: spines lie flat as stacked bars.
const HEIGHTS = ["md:h-72", "md:h-64", "md:h-80", "md:h-60", "md:h-[17rem]"];

export default function CategoryShelf() {
  return (
    <div>
      <div className="flex flex-col gap-2 md:flex-row md:items-end">
        {Object.entries(CATEGORIES).map(([name, c], i) => (
          <Link key={name} href={`/books?category=${name}`} aria-label={`${name}: ${c.blurb}`}
            className={`group flex h-16 items-center justify-between rounded-md px-5 text-white transition-transform hover:-translate-y-1.5 md:flex-1 md:flex-col md:justify-start md:px-0 md:py-6 md:hover:-translate-y-3 ${HEIGHTS[i]}`}
            style={{ background: c.color }}>
            <span className="text-xl font-bold md:[writing-mode:vertical-rl] md:rotate-180 md:text-2xl">{name}</span>
            <span className="text-sm text-white/75 md:mt-auto md:px-3 md:text-center md:text-xs md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-visible:opacity-100">{c.blurb}</span>
          </Link>
        ))}
      </div>
      <div className="hidden h-3 rounded-sm bg-line md:block" aria-hidden />
    </div>
  );
}
