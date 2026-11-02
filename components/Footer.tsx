"use client";
import Link from "next/link";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Mail, MapPin, Phone } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { Logo } from "./Navbar";

const SOCIALS = [
  { href: "https://x.com", label: "X", Icon: FaXTwitter },
  { href: "https://github.com", label: "GitHub", Icon: FaGithub },
  { href: "https://facebook.com", label: "Facebook", Icon: FaFacebookF },
  { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: FaLinkedinIn },
];

export default function Footer() {
  return (
    <footer className="mt-10 bg-[#0f1b2e] text-slate-300">
      {/* spine strip */}
      <div className="flex h-1.5" aria-hidden>
        {Object.values(CATEGORIES).map((c, i) => <span key={i} className="flex-1" style={{ background: c.color }} />)}
      </div>

      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="[&_span]:text-white [&_span:first-child]:bg-white [&_span:first-child]:!text-[#0f1b2e]"><Logo /></div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">A community library you can borrow from online. Add a book, borrow a book, return a book.</p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 text-white transition-colors hover:bg-white hover:text-[#0f1b2e]"><Icon size={16} /></a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Quick links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[["Home", "/"], ["All Books", "/books"], ["Add Book", "/add-book"], ["My Borrows", "/my-borrows"], ["Login", "/login"]].map(([l, h]) => (
              <li key={h}><Link href={h} className="hover:text-white">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0" /> 124 Central Library Way, Reading Avenue, Dhaka</li>
            <li className="flex gap-3"><Phone size={16} className="mt-0.5 shrink-0" /> +880 1712-345678</li>
            <li className="flex gap-3"><Mail size={16} className="mt-0.5 shrink-0" /> support@booknook.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm">© 2026 BookNook. All rights reserved.</div>
    </footer>
  );
}
