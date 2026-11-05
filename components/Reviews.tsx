import { ArrowRight, BookOpen, LibraryBig, Repeat2 } from "lucide-react";

const FEATURES = [
  {
    icon: LibraryBig,
    title: "A shelf shaped by readers",
    text: "Browse books shared by members and discover a title you might have missed.",
  },
  {
    icon: Repeat2,
    title: "Borrowing stays simple",
    text: "Choose a return date, keep track of your loan, and return a book when you are done.",
  },
  {
    icon: BookOpen,
    title: "Pass a good read along",
    text: "Add books from your own collection so another reader can find their next favorite.",
  },
];

export default function Reviews() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {FEATURES.map(({ icon: Icon, title, text }, index) => (
        <article
          key={title}
          className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-xl"
        >
          <span className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-brand/5 transition-transform group-hover:scale-125" aria-hidden />
          <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-brand-light text-brand">
            <Icon size={22} />
          </span>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-ink-faint">0{index + 1}</p>
          <h3 className="mt-2 text-xl font-bold">{title}</h3>
          <p className="mt-3 font-reading leading-relaxed text-ink-soft">{text}</p>
          <ArrowRight size={16} className="mt-6 text-brand transition-transform group-hover:translate-x-1" aria-hidden />
        </article>
      ))}
    </div>
  );
}
