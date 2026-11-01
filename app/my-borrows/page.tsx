"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Borrow, fetchMyBorrows, returnBorrow } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmModal from "@/components/ConfirmModal";
import { Bookmark, RotateCcw, BookOpen, Calendar, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<string>("");

  // Return Confirm Modal State
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returningBorrow, setReturningBorrow] = useState<Borrow | null>(null);
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split("T")[0]);
    document.title = "BookNook | My Borrows";
    if (!sessionLoading && !session?.user) {
      toast.error("Please login to view your borrowed books!");
      router.push("/login?callbackUrl=/my-borrows");
      return;
    }

    async function loadBorrows() {
      if (!session?.user?.email) return;
      try {
        setLoading(true);
        const data = await fetchMyBorrows(session.user.email);
        setBorrows(data);
      } catch (err) {
        console.error("Failed to load borrows:", err);
        toast.error("Failed to load your borrowed books.");
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      loadBorrows();
    }
  }, [session, sessionLoading, router]);

  // Open Return Confirm Modal
  const handleOpenReturn = (borrow: Borrow) => {
    setReturningBorrow(borrow);
    setReturnModalOpen(true);
  };

  // Confirm Return Book
  const handleConfirmReturn = async () => {
    if (!returningBorrow || !session?.user) return;

    setReturning(true);
    try {
      await returnBorrow(returningBorrow._id, session.user.email);
      setBorrows((prev) => prev.filter((b) => b._id !== returningBorrow._id));
      toast.success(`"${returningBorrow.bookTitle}" returned successfully! Thank you for sharing.`);
      setReturnModalOpen(false);
      setReturningBorrow(null);
    } catch {
      toast.error("Failed to return book. Please try again.");
    } finally {
      setReturning(false);
    }
  };

  if (sessionLoading) {
    return <LoadingSpinner text="Checking credentials..." />;
  }

  if (!session?.user) return null;

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Borrowed Books
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Track active loans and return books when you are done reading.
          </p>
        </div>

        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse More Books</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading borrowed books..." />
      ) : borrows.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            You don&apos;t have any active borrows
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Find an interesting novel, history book, or scientific paper and start borrowing!
          </p>
          <Link
            href="/books"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            <span>Explore All Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Borrows Table as required: Image, Title, Borrow Date, Return Date, and "Return Book" button */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Book
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Borrow Date
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Due Return Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {borrows.map((borrow) => {
                  const isOverdue =
                    borrow.returnDate &&
                    currentDate &&
                    borrow.returnDate < currentDate;

                  return (
                    <tr
                      key={borrow._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Image & Title */}
                      <td className="px-6 py-4 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={borrow.bookImage}
                          alt={borrow.bookTitle}
                          className="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/books/${borrow.bookId}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 truncate block max-w-xs"
                          >
                            {borrow.bookTitle}
                          </Link>
                          <span className="text-xs text-slate-400">
                            Loan ID: {borrow._id.slice(-6)}
                          </span>
                        </div>
                      </td>

                      {/* Borrow Date */}
                      <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{borrow.borrowDate}</span>
                        </div>
                      </td>

                      {/* Return Date */}
                      <td className="px-6 py-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar
                            className={`w-3.5 h-3.5 ${
                              isOverdue ? "text-rose-500" : "text-emerald-500"
                            }`}
                          />
                          <span
                            className={
                              isOverdue
                                ? "text-rose-600 dark:text-rose-400 font-bold"
                                : "text-slate-600 dark:text-slate-300"
                            }
                          >
                            {borrow.returnDate}
                          </span>
                          {isOverdue && (
                            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Return Book Button */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenReturn(borrow)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-emerald-600 dark:bg-slate-700 dark:hover:bg-emerald-600 active:scale-95 transition-all shadow-sm"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return Book</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Return Confirmation Modal */}
      <ConfirmModal
        isOpen={returnModalOpen}
        title="Return Book"
        message={`Are you ready to return "${returningBorrow?.bookTitle}"? This will return the copy back to the library for other members.`}
        confirmText="Confirm Return"
        isLoading={returning}
        onConfirm={handleConfirmReturn}
        onClose={() => setReturnModalOpen(false)}
      />
    </div>
  );
}
