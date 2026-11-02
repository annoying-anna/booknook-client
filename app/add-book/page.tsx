"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createBook, uploadToImgBB } from "@/lib/api";
import Loader from "@/components/Loader";
import { CATEGORIES } from "@/lib/categories";
import { toast } from "sonner";
import { Upload, Image as ImageIcon } from "lucide-react";

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
    return <Loader label="Verifying membership" />;
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
      toast.success("Cover image uploaded to ImgBB!");
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

      toast.success("Book successfully added to the catalog!");
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
    <div className="wrap section max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Add a Book</h1>
        <p className="mt-2 font-reading text-lg text-ink-soft">
          Contribute a new title to the BookNook community library.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Title */}
          <div>
            <label className="label" htmlFor="b-title">Book Title</label>
            <input
              id="b-title"
              type="text"
              className="input"
              placeholder="e.g. The Great Gatsby"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="label" htmlFor="b-author">Author</label>
            <input
              id="b-author"
              type="text"
              className="input"
              placeholder="e.g. F. Scott Fitzgerald"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Category */}
          <div>
            <label className="label" htmlFor="b-category">Category</label>
            <select
              id="b-category"
              className="input bg-surface"
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

          {/* Total Copies */}
          <div>
            <label className="label" htmlFor="b-copies">Total Copies</label>
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

        {/* Cover Image Upload (ImgBB) */}
        <div>
          <label className="label">Book Cover Image</label>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <label
                htmlFor="b-image-file"
                className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-paper/50 px-4 py-4 text-sm font-medium hover:border-brand"
              >
                <Upload size={18} className="text-ink-soft" />
                <span>{uploadingImage ? "Uploading to ImgBB…" : "Choose cover image file to upload"}</span>
                <input
                  id="b-image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>

              <div className="text-xs text-ink-soft">Or paste an existing image URL:</div>
              <input
                type="url"
                className="input text-xs"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
              />
            </div>

            {/* Preview Box */}
            <div className="relative aspect-[3/4] w-24 overflow-hidden rounded-lg border border-line bg-line/30 flex items-center justify-center">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Cover preview" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon size={24} className="text-ink-soft/50" />
              )}
              {uploadingImage && (
                <div className="absolute inset-0 grid place-items-center bg-black/40 text-xs text-white">
                  Uploading…
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label" htmlFor="b-desc">Description</label>
          <textarea
            id="b-desc"
            rows={4}
            className="input"
            placeholder="A short synopsis or background on this book…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Read-only User Name and Email */}
        <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-line">
          <div>
            <label className="label" htmlFor="b-username">Added by (User Name)</label>
            <input
              id="b-username"
              type="text"
              className="input text-ink-soft"
              value={session.user.name || "Reader"}
              readOnly
            />
          </div>
          <div>
            <label className="label" htmlFor="b-useremail">User Email</label>
            <input
              id="b-useremail"
              type="email"
              className="input text-ink-soft"
              value={session.user.email}
              readOnly
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || uploadingImage}
          >
            {submitting ? "Adding Book…" : "Save Book to Library"}
          </button>
        </div>
      </form>
    </div>
  );
}
