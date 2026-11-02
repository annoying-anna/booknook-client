"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { fetchMyBorrows, returnBorrow } from "@/lib/api";
import type { Borrow } from "@/lib/types";
import { MyBorrowsTable, EmptyState } from "@/components/tables";
import Loader from "@/components/Loader";
import { toast } from "sonner";

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = "BookNook | My Borrows";
    if (!sessionLoading && !session?.user) {
      router.push(`/login?redirect=${encodeURIComponent("/my-borrows")}`);
    }
  }, [session, sessionLoading, router]);

  useEffect(() => {
    if (!session?.user) return;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchMyBorrows();
        setBorrows(data);
      } catch (err) {
        console.error("Failed to load borrows:", err);
        toast.error("Failed to load borrowed books.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session]);

  if (sessionLoading || !session?.user) {
    return <Loader label="Checking session" />;
  }

  async function handleReturn(b: Borrow) {
    try {
      setReturningId(b._id);
      await returnBorrow(b._id);
      setBorrows((prev) => prev.filter((item) => item._id !== b._id));
      toast.success(`"${b.bookTitle}" has been returned to the library.`);
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      const msg = responseData?.message || responseData?.error || "Failed to return book.";
      toast.error(msg);
    } finally {
      setReturningId(undefined);
    }
  }

  return (
    <div className="wrap section space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Borrows</h1>
        <p className="mt-2 font-reading text-lg text-ink-soft">
          Keep track of your borrowed books and upcoming return dates.
        </p>
      </div>

      {loading ? (
        <Loader label="Loading borrowed books" />
      ) : borrows.length > 0 ? (
        <MyBorrowsTable
          borrows={borrows}
          onReturn={handleReturn}
          returningId={returningId}
        />
      ) : (
        <EmptyState
          title="No borrowed books"
          text="You don't have any books borrowed right now. Browse our shelves to pick your next read!"
          href="/books"
          action="Browse Catalog"
        />
      )}
    </div>
  );
}
