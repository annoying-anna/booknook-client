import { Search, BookMarked, RotateCcw } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Browse & Select",
    description: "Explore our rich catalog across categories. Find the book you love with real-time stock availability.",
    icon: Search,
    color: "emerald",
  },
  {
    step: "02",
    title: "Borrow with One Click",
    description: "Sign in with your account or Google. Confirm your borrowing date with instant zero-deposit checkout.",
    icon: BookMarked,
    color: "blue",
  },
  {
    step: "03",
    title: "Read & Return",
    description: "Enjoy reading your borrowed book at your leisure. Return it anytime from your dashboard with one tap.",
    icon: RotateCcw,
    color: "purple",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 border-t border-slate-200/60 dark:border-slate-800">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Effortless Process
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How Borrowing Works
        </h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          BookNook makes sharing and borrowing physical & digital books simpler than ever.
          Follow three effortless steps to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all group"
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-200 dark:text-slate-700 select-none">
                  {item.step}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
