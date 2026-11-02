"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, BookOpen, Bookmark, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { spineColor } from "@/lib/categories";
import type { Book, Borrow } from "@/lib/types";

const fmt = (d: string) => {
  try {
    return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return d;
  }
};

function Thumb({ src, color }: { src: string; color?: string }) {
  return (
    <span className="relative block h-16 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-cover" />
      {color && <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: color }} />}
    </span>
  );
}

export function EmptyState({
  title,
  text,
  href,
  action,
}: {
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-surface/40 p-14 text-center max-w-lg mx-auto space-y-4">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-sm">
        <BookOpen size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm font-reading text-ink-soft leading-relaxed">{text}</p>
      </div>
      <div className="pt-2">
        <Link href={href} className="btn btn-primary h-11 px-6 text-sm font-bold shadow-md shadow-blue-600/20">
          <Sparkles size={16} /> {action}
        </Link>
      </div>
    </div>
  );
}

const TableWrap = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto rounded-3xl border border-line bg-surface shadow-sm">
    <table className="w-full min-w-[42rem] text-left text-sm">{children}</table>
  </div>
);

const Th = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
  <th
    className={`border-b border-line bg-paper/60 px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink-soft ${
      right ? "text-right" : ""
    }`}
  >
    {children}
  </th>
);

export function MyBooksTable({
  books,
  onEdit,
  onDelete,
}: {
  books: Book[];
  onEdit: (b: Book) => void;
  onDelete: (b: Book) => void;
}) {
  return (
    <TableWrap>
      <thead>
        <tr>
          <Th>Book Volume</Th>
          <Th>Category</Th>
          <Th>Copies In Stock</Th>
          <Th right>Manage</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {books.map((b) => (
          <tr key={b._id} className="hover:bg-paper/40 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-4">
                <Thumb src={b.image} color={spineColor(b.category)} />
                <div>
                  <p className="font-bold text-ink leading-snug">{b.title}</p>
                  <p className="font-reading text-xs text-ink-soft">by {b.author}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-sm"
                style={{ background: spineColor(b.category) }}
              >
                {b.category}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1 text-xs font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {b.availableCopies ?? "–"} / {b.totalCopies ?? "–"} free
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-outline h-9 px-3.5 text-xs font-semibold"
                  onClick={() => onEdit(b)}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="btn btn-outline h-9 px-3.5 text-xs font-semibold text-rose-600 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  onClick={() => onDelete(b)}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}

export function MyBorrowsTable({
  borrows,
  onReturn,
  returningId,
}: {
  borrows: Borrow[];
  onReturn: (b: Borrow) => void;
  returningId?: string;
}) {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  return (
    <TableWrap>
      <thead>
        <tr>
          <Th>Borrowed Volume</Th>
          <Th>Checkout Date</Th>
          <Th>Due Date</Th>
          <Th right>Action</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {borrows.map((b) => {
          const isOverdue = today && b.returnDate && b.returnDate.slice(0, 10) < today;
          return (
            <tr key={b._id} className="hover:bg-paper/40 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <Thumb src={b.bookImage} />
                  <div>
                    <p className="font-bold text-ink leading-snug">{b.bookTitle}</p>
                    <span className="text-xs text-ink-faint">ID: {b.bookId.slice(-6)}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 font-reading text-ink-soft">
                {fmt(b.borrowDate)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink">{fmt(b.returnDate)}</span>
                  {isOverdue && (
                    <span className="rounded-md bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                      Overdue
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  className="btn btn-primary h-9 px-4 text-xs font-bold"
                  onClick={() => onReturn(b)}
                  disabled={returningId === b._id}
                >
                  {returningId === b._id ? "Processing Return…" : "Return Book"}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </TableWrap>
  );
}
