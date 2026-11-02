import Link from "next/link";
import ShelfArt from "@/components/ShelfArt";

export const metadata = { title: "BookNook | Page not found" };

export default function NotFound() {
  return (
    <div className="wrap section grid min-h-[60vh] items-center gap-12 md:grid-cols-2">
      <div>
        <p className="text-8xl font-bold leading-none text-brand sm:text-9xl">404</p>
        <h1 className="mt-6 text-3xl font-bold">This page isn&apos;t on our shelves.</h1>
        <p className="mt-3 max-w-md font-reading text-lg text-ink-soft">The link may be old or mistyped. Head back home and find your book from there.</p>
        <Link href="/" className="btn btn-accent mt-8 h-12 px-7">Back to Home</Link>
      </div>
      <div className="justify-self-center rounded-2xl bg-brand p-8 md:justify-self-end" style={{ background: "#1b2f4e" }}><ShelfArt /></div>
    </div>
  );
}
