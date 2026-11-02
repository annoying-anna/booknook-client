"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { fetchBooks, updateBook, deleteBook } from "@/lib/api";
import type { Book } from "@/lib/types";
import { MyBooksTable, EmptyState } from "@/components/tables";
import { ConfirmModal } from "@/components/modals";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import { CATEGORIES } from "@/lib/categories";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const CATEGORY_LIST = Object.keys(CATEGORIES);

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [totalCopies, setTotalCopies] = useState<number>(1);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = "BookNook | My Books";
    if (!sessionLoading && !session?.user) {
      router.push(`/login?redirect=${encodeURIComponent("/my-books")}`);
    }
  }, [session, sessionLoading, router]);

  useEffect(() => {
    if (!session?.user) return;

    async function load() {
      try {
        setLoading(true);
        // The server supports filtering by user email or returning mine
        const allBooks = await fetchBooks({ mine: true });
        // Also client filter defensively:
        const myBooks = allBooks.filter((b) => b.userEmail === session?.user?.email);
        setBooks(myBooks);
      } catch (err) {
        console.error("Failed to load user books:", err);
        toast.error("Failed to load your books.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session]);

  if (sessionLoading || !session?.user) {
    return <Loader label="Checking session" />;
  }

  function handleOpenEdit(b: Book) {
    setEditingBook(b);
    setTitle(b.title);
    setAuthor(b.author);
    setCategory(b.category);
    setTotalCopies(b.totalCopies ?? 1);
    setImage(b.image);
    setDescription(b.description || "");
    setEditOpen(true);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBook) return;

    try {
      setSavingEdit(true);
      await updateBook(editingBook._id, {
        title: title.trim(),
        author: author.trim(),
        category,
        totalCopies: Number(totalCopies),
        image: image.trim(),
        description: description.trim(),
      });

      setBooks((prev) =>
        prev.map((b) =>
          b._id === editingBook._id
            ? {
                ...b,
                title: title.trim(),
                author: author.trim(),
                category,
                totalCopies: Number(totalCopies),
                image: image.trim(),
                description: description.trim(),
              }
            : b
        )
      );

      toast.success("Book updated successfully!");
      setEditOpen(false);
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      const msg = responseData?.message || responseData?.error || "Failed to update book.";
      toast.error(msg);
    } finally {
      setSavingEdit(false);
    }
  }

  function handleOpenDelete(b: Book) {
    setBookToDelete(b);
    setDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    if (!bookToDelete) return;

    try {
      setDeleting(true);
      await deleteBook(bookToDelete._id);
      setBooks((prev) => prev.filter((b) => b._id !== bookToDelete._id));
      toast.success("Book deleted from library.");
      setDeleteOpen(false);
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      const msg = responseData?.message || responseData?.error || "Failed to delete book.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="wrap section space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Books</h1>
          <p className="mt-2 font-reading text-lg text-ink-soft">
            Manage the titles you have added to the BookNook catalog.
          </p>
        </div>
        <Link href="/add-book" className="btn btn-primary self-start">
          <Plus size={16} /> Add New Book
        </Link>
      </div>

      {loading ? (
        <Loader label="Loading your books" />
      ) : books.length > 0 ? (
        <MyBooksTable
          books={books}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      ) : (
        <EmptyState
          title="No books added yet"
          text="You haven't contributed any books to the community yet. Share your first book today!"
          href="/add-book"
          action="Add a Book"
        />
      )}

      {/* Edit Book Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Book">
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="label" htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="edit-author">Author</label>
            <input
              id="edit-author"
              type="text"
              className="input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="edit-cat">Category</label>
              <select
                id="edit-cat"
                className="input bg-surface"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_LIST.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="edit-copies">Total Copies</label>
              <input
                id="edit-copies"
                type="number"
                min="1"
                className="input"
                value={totalCopies}
                onChange={(e) => setTotalCopies(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="edit-image">Cover Image URL</label>
            <input
              id="edit-image"
              type="url"
              className="input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="edit-desc">Description</label>
            <textarea
              id="edit-desc"
              rows={3}
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingEdit}
            >
              {savingEdit ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete this book?"
        message={`Are you sure you want to permanently delete "${bookToDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete Book"
        loading={deleting}
      />
    </div>
  );
}
