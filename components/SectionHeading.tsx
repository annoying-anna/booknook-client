import Link from "next/link";

export default function SectionHeading({ title, text, href, action }: { title: string; text?: string; href?: string; action?: string }) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
        {text && <p className="mt-3 font-reading text-lg leading-relaxed text-ink-soft">{text}</p>}
      </div>
      {href && action && <Link href={href} className="btn btn-outline shrink-0">{action}</Link>}
    </div>
  );
}
