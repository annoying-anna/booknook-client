import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Dr. Evelyn Reed",
    role: "Astrophysics Researcher",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    text: "BookNook is my go-to library platform. The selection of science and astrophysics books is top-notch, and the borrowing procedure takes literally 5 seconds.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Vance",
    role: "Literature Teacher",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    text: "My high-school students use BookNook every week to read historical and fictional works. The clean interface and zero confusing ads make reading a pure joy.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sophia Chen",
    role: "Book Club Host",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    text: "Being able to add our local book club recommendations and monitor who is borrowing what has made managing our community books effortless!",
    rating: 5,
  },
];

export default function ReaderReviews() {
  return (
    <section className="py-16 border-t border-slate-200/60 dark:border-slate-800">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Reader Community
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          What Our Readers Say
        </h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Discover why book lovers, teachers, and curious readers trust BookNook every day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{rev.text}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/30"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {rev.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {rev.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
