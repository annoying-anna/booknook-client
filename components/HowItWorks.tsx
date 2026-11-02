import { BookOpen, Calendar, RotateCcw } from "lucide-react";

const STEPS = [
  {
    icon: BookOpen,
    badge: "Step 01",
    t: "Discover a Book",
    d: "Browse our 5 core categories. Filter by genre or search by title and author. See real-time availability on the shelf.",
  },
  {
    icon: Calendar,
    badge: "Step 02",
    t: "Borrow with 1 Click",
    d: "Sign in with your reader account or Google. Select your preferred return date up to 30 days and confirm your loan.",
  },
  {
    icon: RotateCcw,
    badge: "Step 03",
    t: "Read & Return Anytime",
    d: "Enjoy reading at your own pace. Return the book from your My Borrows dashboard with one tap, freeing the copy for the next reader.",
  },
];

export default function HowItWorks() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={s.t}
            className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-extrabold shadow-sm">
                  <Icon size={22} />
                </span>
                <span className="rounded-full bg-paper px-3 py-1 text-xs font-bold text-ink-soft border border-line">
                  {s.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-ink group-hover:text-brand transition-colors">
                {s.t}
              </h3>
              <p className="mt-3 font-reading text-sm leading-relaxed text-ink-soft">
                {s.d}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
