"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import { fetchBookById, borrowBook, fetchMyBorrows } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/lib/types";
import BookDetailsView from "@/components/BookDetailsView";
import { BorrowModal } from "@/components/modals";
import Loader from "@/components/Loader";
import { toast } from "sonner";

function BookDetailsInner({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      router.push(`/login?redirect=${encodeURIComponent(`/books/${id}`)}`);
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        const bookData = await fetchBookById(id);
        setBook(bookData);
        document.title = `BookNook | ${bookData.title}`;

        try {
          const userBorrows = await fetchMyBorrows();
          const hasIt = userBorrows.some((b) => b.bookId === id);
          setAlreadyBorrowed(hasIt);
        } catch {
          // borrow check failed silently
        }
      } catch (err) {
        console.error("Failed to load book:", err);
        toast.error("Book not found or failed to load");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, session, sessionLoading, router]);

  if (sessionLoading || loading) {
    return <Loader label="Retrieving book details" />;
  }

  if (!book) {
    return (
      <div className="wrap section text-center">
        <p className="text-xl font-semibold">Book not found.</p>
        <button className="btn btn-primary mt-4" onClick={() => router.push("/books")}>
          Return to Catalog
        </button>
      </div>
    );
  }

  function handleOpenBorrow() {
    if (!session?.user) {
      router.push(`/login?redirect=${encodeURIComponent(`/books/${id}`)}`);
      return;
    }
    setBorrowModalOpen(true);
  }

  async function handleConfirmBorrow(returnDate: string) {
    try {
      setBorrowing(true);
      await borrowBook({
        bookId: id,
        returnDate,
      });

      toast.success("Book borrowed successfully!");
      setAlreadyBorrowed(true);
      setBook((prev) =>
        prev
          ? {
              ...prev,
              availableCopies: Math.max(0, (prev.availableCopies ?? prev.totalCopies ?? 1) - 1),
            }
          : null
      );
      setBorrowModalOpen(false);
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      const msg = responseData?.message || responseData?.error || "Failed to borrow book.";
      toast.error(msg);
    } finally {
      setBorrowing(false);
    }
  }

  return (
    <>
      <BookDetailsView
        book={book}
        onBorrow={handleOpenBorrow}
        alreadyBorrowed={alreadyBorrowed}
        busy={borrowing}
      />

      {session?.user && (
        <BorrowModal
          open={borrowModalOpen}
          onClose={() => setBorrowModalOpen(false)}
          onConfirm={handleConfirmBorrow}
          bookTitle={book.title}
          userName={session.user.name || "Reader"}
          userEmail={session.user.email}
          loading={borrowing}
        />
      )}
    </>
  );
}

function BookDetailsWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <BookDetailsInner id={id} />;
}

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Loader label="Loading book" />}>
      <BookDetailsWrapper params={params} />
    </Suspense>
  );
}
