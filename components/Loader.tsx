export default function Loader({ label = "Loading" }: { label?: string }) {
  const colors = ["--spine-fiction", "--spine-science", "--spine-history", "--spine-kids", "--spine-others"];
  return (
    <div role="status" className="grid min-h-[40vh] place-items-center">
      <div className="text-center">
        <div className="spine-load flex h-12 items-end justify-center gap-1.5" aria-hidden>
          {colors.map((c, i) => <span key={c} className="h-full w-3 rounded-sm" style={{ background: `var(${c})`, animationDelay: `${i * 0.12}s` }} />)}
        </div>
        <p className="mt-4 text-sm text-ink-soft">{label}…</p>
      </div>
    </div>
  );
}
