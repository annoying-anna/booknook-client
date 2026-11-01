import Link from "next/link";
import { BookOpen, Atom, Landmark, Sparkles, Layers, ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Fiction",
    icon: BookOpen,
    description: "Classic novels, dramas, thrillers, and award-winning storytelling.",
    color: "from-purple-500/20 to-purple-500/5 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60",
  },
  {
    name: "Science",
    icon: Atom,
    description: "Astronomy, physics, technology, nature, and scientific breakthroughs.",
    color: "from-blue-500/20 to-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60",
  },
  {
    name: "History",
    icon: Landmark,
    description: "Civilizations, revolutions, biographies, and defining world events.",
    color: "from-amber-500/20 to-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
  },
  {
    name: "Kids",
    icon: Sparkles,
    description: "Fairy tales, bedtime adventures, illustrations, and early learning.",
    color: "from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
  },
  {
    name: "Others",
    icon: Layers,
    description: "Productivity, psychology, art, self-help, philosophy, and lifestyle.",
    color: "from-rose-500/20 to-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60",
  },
];

export default function TopCategories() {
  return (
    <section className="py-16 border-t border-slate-200/60 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Curated Collections
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Top Categories
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Browse through our top genres curated for curious minds of all ages.
          </p>
        </div>
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <span>View All Collections</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={`/books?category=${cat.name}`}
              className={`p-5 rounded-2xl bg-gradient-to-b ${cat.color} border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">Explore</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
