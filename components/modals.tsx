"use client";
import { useState, useEffect } from "react";
import Modal from "./Modal";

/* Delete confirmation (replaces window.confirm) */
export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Delete", loading }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmLabel?: string; loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="font-reading leading-relaxed text-ink-soft">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn btn-outline" onClick={onClose}>Keep it</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>{loading ? "Deleting…" : confirmLabel}</button>
      </div>
    </Modal>
  );
}

export function BorrowModal({ open, onClose, onConfirm, bookTitle, userName, userEmail, loading }: {
  open: boolean; onClose: () => void; onConfirm: (returnDate: string) => void;
  bookTitle: string; userName: string; userEmail: string; loading?: boolean;
}) {
  const [returnDate, setReturnDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    if (open) {
      const now = Date.now();
      const add = (d: number) => new Date(now + d * 864e5).toISOString().slice(0, 10);
      setReturnDate(add(7));
      setMinDate(add(1));
      setMaxDate(add(30));
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Borrow this book">
      <p className="mb-5 font-reading text-ink-soft">You are borrowing <strong className="text-ink">{bookTitle}</strong>.</p>
      <form onSubmit={(e) => { e.preventDefault(); onConfirm(returnDate); }} className="space-y-4">
        <div><label className="label" htmlFor="b-name">Name</label><input id="b-name" className="input" value={userName} readOnly /></div>
        <div><label className="label" htmlFor="b-email">Email</label><input id="b-email" className="input" value={userEmail} readOnly /></div>
        <div>
          <label className="label" htmlFor="b-return">Return by</label>
          <input
            id="b-return"
            type="date"
            className="input"
            value={returnDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
          <p className="mt-1.5 text-sm text-ink-soft">Pick a date within the next 30 days.</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Borrowing…" : "Confirm Borrow"}</button>
        </div>
      </form>
    </Modal>
  );
}
