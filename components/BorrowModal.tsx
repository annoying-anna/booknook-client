"use client";

import { useState, useEffect } from "react";
import { Book, borrowBook } from "@/lib/api";
import { X, Calendar, User, Mail, BookOpen, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface BorrowModalProps {
  isOpen: boolean;
  book: Book;
  userName: string;
  userEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BorrowModal({
  isOpen,
  book,
  userName,
  userEmail,
  onClose,
  onSuccess,
}: BorrowModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [today, setToday] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      const nowStr = new Date().toISOString().split("T")[0];
      const defaultReturn = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      setToday(nowStr);
      setReturnDate(defaultReturn);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnDate) {
      toast.error("Please specify an intended return date.");
      return;
    }

    if (new Date(returnDate) <= new Date(today)) {
      toast.error("Return date must be later than today.");
      return;
    }

    setLoading(true);
    try {
      await borrowBook({
        bookId: book._id,
        bookTitle: book.title,
        bookImage: book.image,
        userEmail,
        userName,
        borrowDate: today,
        returnDate,
      });

      toast.success(`Hurray! "${book.title}" borrowed successfully!`);
      onSuccess();
      onClose();
      router.push("/my-borrows");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
      if (axiosError?.response?.data?.error === "already_borrowed") {
        toast.error("You have already borrowed this book! Please return it before borrowing again.");
      } else if (axiosError?.response?.data?.error === "out_of_stock") {
        toast.error("Sorry! This book is currently out of stock (0 copies available).");
      } else {
        toast.error(axiosError?.response?.data?.message || "Failed to borrow book. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Borrow Confirmation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review your borrowing details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book summary card */}
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.image}
            alt={book.title}
            className="w-12 h-16 object-cover rounded-lg shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {book.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              By {book.author}
            </p>
            <span className="inline-block mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {book.totalCopies} copies remaining
            </span>
          </div>
        </div>

        {/* Borrow Form */}
        <form onSubmit={handleBorrow} className="mt-4 space-y-4">
          {/* User Name (Read-Only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Borrower Name
            </label>
            <input
              type="text"
              value={userName || "Member"}
              readOnly
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-not-allowed font-medium"
            />
          </div>

          {/* User Email (Read-Only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Borrower Email
            </label>
            <input
              type="email"
              value={userEmail}
              readOnly
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-not-allowed font-medium"
            />
          </div>

          {/* Borrow Date & Return Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Borrow Date
              </label>
              <input
                type="date"
                value={today}
                readOnly
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                min={today}
                onChange={(e) => setReturnDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-xs text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Please return the book on or before your selected return date.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-300 dark:border-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 active:scale-[0.98] shadow-md transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Confirming...</span>
                </>
              ) : (
                "Confirm Borrow"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
