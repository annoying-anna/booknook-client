"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createBook, uploadToImgBB } from "@/lib/api";
import Loader from "@/components/Loader";
import { CATEGORIES } from "@/lib/categories";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, Sparkles, BookPlus, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const CATEGORY_LIST = Object.keys(CATEGORIES);

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [totalCopies, setTotalCopies] = useState<number>(3);
  const [description, setDescription] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Add Book";
    if (!sessionLoading && !session?.user) {
      router.push(`/login?redirect=${encodeURIComponent("/add-book")}`);
    }
  }, [session, sessionLoading, router]);

  if (sessionLoading || !session?.user) {
    return <Loader label="Verifying membership credentials" />;
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    try {
      setUploadingImage(true);
      const url = await uploadToImgBB(file);
      setImageUrl(url);
      toast.success("Cover image successfully uploaded to ImgBB!");
    } catch (err: unknown) {
      const msg = (err as Error)?.message || "Failed to upload image";
      toast.error(msg);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !description.trim()) {
      toast.error("Please fill in all book details.");
      return;
    }

    const finalImage = imageUrl.trim();
    if (!finalImage) {
      toast.error("Please upload or enter a book cover image URL.");
      return;
    }

    if (totalCopies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    try {
      setSubmitting(true);
      await createBook({
        title: title.trim(),
        author: author.trim(),
        category,
        image: finalImage,
        description: description.trim(),
        totalCopies: Number(totalCopies),
      });

      toast.success("Book successfully added to the community catalog!");
      router.push("/books");
      router.refresh();
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      const msg = responseData?.message || responseData?.error || "Failed to add book.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="wrap section max-w-4xl space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-brand transition-colors"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      <div className="flex flex-col gap-2 border-b border-line pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 px-3 py-1 text-xs font-bold w-fit">
          <BookPlus size={14} /> Contribute to Library
        </div>
        <h1 className="text-3xl font-extrabold sm:text-4xl tracking-tight text-ink">
          Add a New Volume
        </h1>
        <p className="font-reading text-base text-ink-soft">
          Share a book from your personal shelf with our readers. Available copies are automatically tracked.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-line bg-surface p-6 sm:p-10 shadow-sm">
        {/* Basic Book Meta */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="b-title">Book Title</label>
            <input
              id="b-title"
              type="text"
              className="input font-semibold"
              placeholder="e.g. Sapiens: A Brief History of Humankind"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="b-author">Author Name</label>
            <input
              id="b-author"
              type="text"
              className="input"
              placeholder="e.g. Yuval Noah Harari"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Category and Copies */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="b-category">Category Department</label>
            <select
              id="b-category"
              className="input bg-surface font-medium"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORY_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="b-copies">Total Number of Copies</label>
            <input
              id="b-copies"
              type="number"
              min="1"
              max="50"
              className="input"
              value={totalCopies}
              onChange={(e) => setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))}
              required
            />
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="space-y-3">
          <label className="label">Cover Image (Upload file to ImgBB or enter URL)</label>
          <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
            <div className="space-y-4">
              <label
                htmlFor="b-image-file"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-paper/40 p-6 text-center hover:border-brand hover:bg-paper transition-all"
              >
                <div className="mb-2 grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Upload size={20} />
                </div>
                <span className="text-sm font-bold text-ink">
                  {uploadingImage ? "Uploading to ImgBB…" : "Click to select cover image"}
                </span>
                <span className="text-xs text-ink-faint mt-1">PNG, JPG, WebP up to 10MB</span>
                <input
                  id="b-image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>

              <div>
                <span className="text-xs font-semibold text-ink-soft">Or paste direct image URL:</span>
                <input
                  type="url"
                  className="input text-xs mt-1"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative aspect-[3/4] w-32 overflow-hidden rounded-2xl border border-line bg-line/30 flex items-center justify-center shadow-md">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Cover preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon size={32} className="text-ink-faint" />
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 grid place-items-center bg-black/60 text-xs font-bold text-white">
                    Uploading…
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-ink-faint mt-2">Cover Preview</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label" htmlFor="b-desc">Synopsis / Overview</label>
          <textarea
            id="b-desc"
            rows={4}
            className="input font-reading"
            placeholder="Write a concise description or quote that gives readers a preview of the book…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Contributor Read-only Credentials */}
        <div className="grid gap-6 sm:grid-cols-2 pt-6 border-t border-line">
          <div>
            <label className="label" htmlFor="b-username">Contributor Name</label>
            <input
              id="b-username"
              type="text"
              className="input text-ink-soft cursor-not-allowed bg-paper"
              value={session.user.name || "Reader"}
              readOnly
            />
          </div>
          <div>
            <label className="label" htmlFor="b-useremail">Contributor Email</label>
            <input
              id="b-useremail"
              type="email"
              className="input text-ink-soft cursor-not-allowed bg-paper"
              value={session.user.email}
              readOnly
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary h-12 px-8 font-bold shadow-lg shadow-blue-600/25"
            disabled={submitting || uploadingImage}
          >
            <Sparkles size={16} />
            {submitting ? "Adding to Library…" : "Publish Volume to Shelf"}
          </button>
        </div>
      </form>
    </div>
  );
}
