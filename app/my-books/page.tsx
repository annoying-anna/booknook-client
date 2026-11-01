"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Book, fetchBooks, updateBook, deleteBook } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmModal from "@/components/ConfirmModal";
import {
  BookOpen,
  Edit3,
  Trash2,
  PlusCircle,
  X,
  Save,
  Layers,
  Copy,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editCategory, setEditCategory] = useState("Fiction");
  const [editCopies, setEditCopies] = useState<number>(1);
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = "BookNook | My Books";
    if (!sessionLoading && !session?.user) {
      toast.error("Please login to view your added books!");
      router.push("/login?callbackUrl=/my-books");
      return;
    }

    async function loadUserBooks() {
      if (!session?.user?.email) return;
      try {
        setLoading(true);
        const data = await fetchBooks({ email: session.user.email });
        setBooks(data);
      } catch (err) {
        console.error("Failed to load user books:", err);
        toast.error("Failed to load your added books.");
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      loadUserBooks();
    }
  }, [session, sessionLoading, router]);

  // Open Edit Modal
  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditCategory(book.category);
    setEditCopies(book.totalCopies ?? 1);
    setEditImage(book.image);
    setEditDescription(book.description);
    setEditModalOpen(true);
  };

  // Submit Edit Form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !session?.user) return;

    setEditSaving(true);
    try {
      await updateBook(
        editingBook._id,
        {
          title: editTitle.trim(),
          author: editAuthor.trim(),
          category: editCategory,
          totalCopies: Number(editCopies),
          image: editImage.trim(),
          description: editDescription.trim(),
        },
        session.user.email
      );

      // Update in local state
      setBooks((prev) =>
        prev.map((b) =>
          b._id === editingBook._id
            ? {
                ...b,
                title: editTitle.trim(),
                author: editAuthor.trim(),
                category: editCategory,
                totalCopies: Number(editCopies),
                image: editImage.trim(),
                description: editDescription.trim(),
              }
            : b
        )
      );

      toast.success("Book updated successfully!");
      setEditModalOpen(false);
      setEditingBook(null);
    } catch {
      toast.error("Failed to update book. Please try again.");
    } finally {
      setEditSaving(false);
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (book: Book) => {
    setDeletingBook(book);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingBook || !session?.user) return;

    setDeleting(true);
    try {
      await deleteBook(deletingBook._id, session.user.email);
      setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
      toast.success(`"${deletingBook.title}" removed from library!`);
      setDeleteModalOpen(false);
      setDeletingBook(null);
    } catch {
      toast.error("Failed to delete book. Please try again.");
    } finally {
      setDeleting(false);
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
            My Added Books
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage books you contributed to the BookNook community library.
          </p>
        </div>

        <Link
          href="/add-book"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your books..." />
      ) : books.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            You haven&apos;t added any books yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Share books from your bookshelf with the community and let others borrow them.
          </p>
          <Link
            href="/add-book"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Your First Book</span>
          </Link>
        </div>
      ) : (
        /* Books Table / Card Layout */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Book
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Copies
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Date Added
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {books.map((book) => (
                  <tr
                    key={book._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Book Info */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/books/${book._id}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 truncate block max-w-xs"
                        >
                          {book.title}
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          By {book.author}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {book.category}
                      </span>
                    </td>

                    {/* Copies */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          book.totalCopies > 0
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                        }`}
                      >
                        {book.totalCopies} left
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {book.createdAt
                        ? new Date(book.createdAt).toLocaleDateString()
                        : "Recently"}
                    </td>

                    {/* Edit & Delete Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(book)}
                          className="p-2 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                          title="Edit Book"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(book)}
                          className="p-2 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Book Details
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Total Copies
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editCopies}
                    onChange={(e) => setEditCopies(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  disabled={editSaving}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (custom, not browser confirm) */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Book?"
        message={`Are you sure you want to permanently delete "${deletingBook?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete Book"
        isDangerous={true}
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
