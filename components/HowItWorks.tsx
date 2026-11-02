const STEPS = [
  { t: "Pick a book", d: "Browse every category. Each book shows how many copies are free right now." },
  { t: "Borrow it", d: "Sign in, choose a return date and confirm. One copy is held for you." },
  { t: "Return it", d: "Done reading? Return it from My Borrows and the copy goes back on the shelf." },
];

export default function HowItWorks() {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <li key={s.t} className="flex gap-5 rounded-xl border border-dashed border-ink-soft/40 bg-surface p-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-lg font-bold text-on-brand">{i + 1}</span>
          <div>
            <h3 className="text-lg font-bold">{s.t}</h3>
            <p className="mt-1.5 font-reading leading-relaxed text-ink-soft">{s.d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
