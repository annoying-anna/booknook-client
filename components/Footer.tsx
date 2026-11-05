"use client";

import Link from "next/link";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { ExternalLink } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { Logo } from "./Navbar";

const REPOSITORY = "https://github.com/annoying-anna/booknook-client";

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
          <div className="flex items-center gap-3 pt-1">
            <a
              href={REPOSITORY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-blue-500 hover:text-white"
            >
              <FaGithub size={14} /> GitHub <ExternalLink size={12} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-blue-500 hover:text-white"
              title="Follow BookNook on X"
            >
              <FaXTwitter size={14} /> X
            </a>
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

        {/* Project & Contact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Project</h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            BookNook is a community library project. For questions or feedback, open an issue in the project repository.
          </p>
          <a href={`${REPOSITORY}/issues`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-white">
            Contact the project <ExternalLink size={14} />
          </a>
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
