"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Book, fetchBookById } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import BorrowModal from "@/components/BorrowModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  BookOpen,
  User,
  Mail,
  Calendar,
  Layers,
  CheckCircle,
  XCircle,
  ArrowLeft,
  BookmarkCheck,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";

const categoryColors: Record<string, string> = {
  Fiction: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  Science: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  History: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Kids: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Others: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

function BookDetailsContent({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      toast.error("Please login to view book details and borrow!");
      router.push(`/login?callbackUrl=/books/${id}`);
      return;
    }

    async function loadBook() {
      try {
        setLoading(true);
        const data = await fetchBookById(id);
        setBook(data);
        document.title = `BookNook | ${data.title}`;
      } catch (err) {
        console.error("Failed to load book:", err);
        toast.error("Book not found or failed to load");
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      loadBook();
    }
  }, [id, session, sessionLoading, router]);

  const handleBorrowClick = () => {
    if (!session?.user) {
      toast.error("Please login first to borrow this book!");
      router.push(`/login?callbackUrl=/books/${id}`);
      return;
    }

    if ((book?.totalCopies ?? 0) <= 0) {
      toast.error("Sorry, this book is currently out of stock!");
      return;
    }

    setBorrowModalOpen(true);
  };

  const handleBorrowSuccess = () => {
    if (book) {
      setBook({
        ...book,
        totalCopies: Math.max(0, book.totalCopies - 1),
      });
    }
  };

  if (sessionLoading || loading) {
    return <LoadingSpinner text="Fetching book details..." />;
  }

  if (!book) {
    return (
      <div className="p-16 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Book Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          The requested book could not be found or may have been deleted.
        </p>
        <Link
          href="/books"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Books</span>
        </Link>
      </div>
    );
  }

  const isAvailable = (book.totalCopies ?? 0) > 0;
  const badgeStyle = categoryColors[book.category] || categoryColors.Others;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Back Button */}
      <div>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Books</span>
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
        {/* Book Cover */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-[3/4] bg-slate-100 dark:bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Stock Ribbon */}
            <div className="absolute top-4 right-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${
                  isAvailable
                    ? "bg-emerald-600/90 text-white"
                    : "bg-rose-600/90 text-white"
                }`}
              >
                {isAvailable ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{book.totalCopies} Available</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Not Available</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Book Metadata & Description */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}
            >
              <Layers className="w-3.5 h-3.5 mr-1" />
              {book.category}
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              {book.title}
            </h1>

            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-base">
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Written by {book.author}</span>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                About This Book
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Copies in Stock:</strong> {book.totalCopies}
                </span>
              </div>
              {book.addedByName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>
                    <strong>Added by:</strong> {book.addedByName}
                  </span>
                </div>
              )}
              {book.addedByEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="truncate">
                    <strong>Email:</strong> {book.addedByEmail}
                  </span>
                </div>
              )}
              {book.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    <strong>Listed on:</strong>{" "}
                    {new Date(book.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Borrow Action Area */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            {isAvailable ? (
              <button
                onClick={handleBorrowClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/25 transition-all"
              >
                <BookmarkCheck className="w-5 h-5" />
                <span>Borrow This Book</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-400 bg-slate-200 dark:bg-slate-800 cursor-not-allowed transition-all"
              >
                <XCircle className="w-5 h-5" />
                <span>Not Available (0 Copies)</span>
              </button>
            )}
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Free 14-day borrowing for all verified BookNook members.
            </p>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {book && session?.user && (
        <BorrowModal
          isOpen={borrowModalOpen}
          book={book}
          userName={session.user.name || "Member"}
          userEmail={session.user.email}
          onClose={() => setBorrowModalOpen(false)}
          onSuccess={handleBorrowSuccess}
        />
      )}
    </div>
  );
}

function InnerBookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  return <BookDetailsContent id={resolved.id} />;
}

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<LoadingSpinner text="Fetching book details..." />}>
      <InnerBookDetailsPage params={params} />
    </Suspense>
  );
}
