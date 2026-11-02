"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { spineColor } from "@/lib/categories";
import type { Book, Borrow } from "@/lib/types";

const fmt = (d: string) => {
  try {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return d;
  }
};

function Thumb({ src, color }: { src: string; color?: string }) {
  return (
    <span className="relative block h-16 w-12 shrink-0 overflow-hidden rounded bg-line/50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-cover" />
      {color && <span className="absolute inset-y-0 left-0 w-1" style={{ background: color }} />}
    </span>
  );
}

export function EmptyState({ title, text, href, action }: { title: string; text: string; href: string; action: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line p-12 text-center">
      <p className="text-lg font-semibold">{title}</p>
      <p className="mt-1 text-ink-soft">{text}</p>
      <Link href={href} className="btn btn-primary mt-5">{action}</Link>
    </div>
  );
}

const TableWrap = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto rounded-xl border border-line bg-surface"><table className="w-full min-w-[40rem] text-left text-sm">{children}</table></div>
);
const Th = ({ children, right }: { children: React.ReactNode; right?: boolean }) => <th className={`border-b border-line bg-paper px-5 py-3.5 font-semibold text-ink-soft ${right ? "text-right" : ""}`}>{children}</th>;

export function MyBooksTable({ books, onEdit, onDelete }: { books: Book[]; onEdit: (b: Book) => void; onDelete: (b: Book) => void }) {
  return (
    <TableWrap>
      <thead><tr><Th>Book</Th><Th>Category</Th><Th>Copies</Th><Th right>Actions</Th></tr></thead>
      <tbody className="divide-y divide-line">
        {books.map((b) => (
          <tr key={b._id}>
            <td className="px-5 py-4"><div className="flex items-center gap-4"><Thumb src={b.image} color={spineColor(b.category)} /><div><p className="font-semibold">{b.title}</p><p className="font-reading text-ink-soft">{b.author}</p></div></div></td>
            <td className="px-5 py-4">{b.category}</td>
            <td className="px-5 py-4">{b.availableCopies ?? "–"} / {b.totalCopies ?? "–"}</td>
            <td className="px-5 py-4"><div className="flex justify-end gap-2">
              <button className="btn btn-outline h-9 px-3" onClick={() => onEdit(b)}><Pencil size={15} /> Edit</button>
              <button className="btn btn-outline h-9 px-3 text-danger hover:border-danger" onClick={() => onDelete(b)}><Trash2 size={15} /> Delete</button>
            </div></td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}

export function MyBorrowsTable({ borrows, onReturn, returningId }: { borrows: Borrow[]; onReturn: (b: Borrow) => void; returningId?: string }) {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  return (
    <TableWrap>
      <thead><tr><Th>Book</Th><Th>Borrowed</Th><Th>Return by</Th><Th right>Action</Th></tr></thead>
      <tbody className="divide-y divide-line">
        {borrows.map((b) => (
          <tr key={b._id}>
            <td className="px-5 py-4"><div className="flex items-center gap-4"><Thumb src={b.bookImage} /><p className="font-semibold">{b.bookTitle}</p></div></td>
            <td className="px-5 py-4">{fmt(b.borrowDate)}</td>
            <td className="px-5 py-4">
              {fmt(b.returnDate)}
              {today && b.returnDate && b.returnDate.slice(0, 10) < today && <span className="ml-2 rounded bg-danger/15 px-2 py-0.5 text-xs font-semibold text-danger">Overdue</span>}
            </td>
            <td className="px-5 py-4 text-right"><button className="btn btn-primary h-9" onClick={() => onReturn(b)} disabled={returningId === b._id}>{returningId === b._id ? "Returning…" : "Return Book"}</button></td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}
