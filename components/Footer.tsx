"use client";

import Link from "next/link";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Mail, MapPin, Phone, Heart, BookOpen } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { Logo } from "./Navbar";

const SOCIALS = [
  { href: "https://x.com", label: "X (formerly Twitter)", Icon: FaXTwitter },
  { href: "https://github.com", label: "GitHub", Icon: FaGithub },
  { href: "https://facebook.com", label: "Facebook", Icon: FaFacebookF },
  { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: FaLinkedinIn },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-slate-950 text-slate-300">
      {/* Category Multi-Spine Top Strip */}
      <div className="flex h-2" aria-hidden>
        {Object.values(CATEGORIES).map((c, i) => (
          <span key={i} className="flex-1" style={{ background: c.color }} />
        ))}
      </div>

      <div className="wrap grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand Column */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="[&_span]:text-white">
            <Logo />
          </div>
          <p className="text-sm font-reading text-slate-400 leading-relaxed max-w-sm">
            A community-first online library built for book lovers. Add a book, borrow with one tap, and share the joy of reading.
          </p>
          <div className="flex gap-2.5 pt-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-blue-500 hover:bg-blue-600 hover:text-white"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Home Shelf", "/"],
              ["All Books Catalog", "/books"],
              ["Fiction", "/books?category=Fiction"],
              ["Science", "/books?category=Science"],
              ["History", "/books?category=History"],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="hover:text-white transition-colors">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Member Services */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Reader Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Add a New Book", "/add-book"],
              ["My Borrowed Books", "/my-borrows"],
              ["My Added Books", "/my-books"],
              ["Member Profile", "/profile"],
              ["Sign In / Register", "/login"],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="hover:text-white transition-colors">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Library Info */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Central Library</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-blue-400" />
              <span>124 Central Library Way, Reading Avenue, Dhaka</span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-amber-400" />
              <span>+880 1712-345678</span>
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>support@booknook.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p className="wrap">
          © 2026 BookNook – An Online Community Library. Designed with care for passionate readers.
        </p>
      </div>
    </footer>
  );
}
