"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createBook, uploadToImgBB } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  BookPlus,
  Upload,
  Link as LinkIcon,
  User,
  Mail,
  Layers,
  FileText,
  Copy,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

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
      toast.error("Please login to add a new book!");
      router.push("/login?callbackUrl=/add-book");
    }
  }, [session, sessionLoading, router]);

  // Handle local file selection for ImgBB upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl(""); // clear manual URL
    }
  };

  // Handle manual image URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImagePreview(e.target.value);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!imageFile && !imageUrl.trim()) {
      toast.error("Please provide a book cover image (upload a file or paste an image URL).");
      return;
    }

    if (totalCopies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    setSubmitting(true);
    let finalImageUrl = imageUrl.trim();

    try {
      // 1. Upload to ImgBB if a local file was selected
      if (imageFile) {
        setUploadingImage(true);
        const toastId = toast.loading("Uploading cover image to ImgBB...");
        try {
          finalImageUrl = await uploadToImgBB(imageFile);
          toast.success("Image uploaded to ImgBB successfully!", { id: toastId });
        } catch (uploadErr) {
          toast.error("ImgBB upload failed. Please try a direct image URL instead.", { id: toastId });
          setSubmitting(false);
          setUploadingImage(false);
          return;
        }
      }

      // 2. Save book to MongoDB via server API
      await createBook(
        {
          title: title.trim(),
          author: author.trim(),
          category,
          image: finalImageUrl,
          description: description.trim(),
          addedByName: session?.user?.name || "BookNook Member",
          addedByEmail: session?.user?.email,
          totalCopies: Number(totalCopies),
        },
        session!.user.email
      );

      toast.success("Book successfully added to BookNook!");
      router.push("/my-books");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      toast.error(axiosError?.response?.data?.error || "Failed to add book. Please try again.");
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  if (sessionLoading) {
    return <LoadingSpinner text="Checking authentication..." />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-6 pb-16">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-3 shadow-sm">
          <BookPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Add a New Book
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
          Share your favorite literature with the community. Fill out the details below.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Book Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                placeholder="e.g. To Kill a Mockingbird"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Author Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Harper Lee"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Row 2: Category & Total Copies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5 text-emerald-500" />
                Total Copies Available (Challenge) *
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={totalCopies}
                onChange={(e) => setTotalCopies(Math.max(1, parseInt(e.target.value) || 1))}
                required
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Row 3: Book Image (ImgBB File Upload + Image URL Fallback) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-emerald-500" />
              Book Cover Image (ImgBB Upload or URL) *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* File upload box */}
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 hover:border-emerald-500 transition-colors flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 dark:bg-slate-800/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {imageFile ? imageFile.name : "Choose image to upload to ImgBB"}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  JPG, PNG, WEBP up to 5MB
                </span>
              </div>

              {/* Direct URL input */}
              <div className="flex flex-col justify-center">
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="Or paste an image URL directly..."
                    value={imageUrl}
                    onChange={handleUrlChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1.5 pl-1">
                  e.g. Unsplash or PostImage direct image link
                </span>
              </div>
            </div>

            {/* Image Preview Box */}
            {imagePreview && (
              <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-12 h-16 object-cover rounded-lg shadow-sm"
                />
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Cover preview ready
                  </p>
                  <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                    {imageFile ? `Ready for ImgBB upload (${(imageFile.size / 1024).toFixed(1)} KB)` : imageUrl}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Row 4: Short Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              Short Description *
            </label>
            <textarea
              rows={4}
              placeholder="Provide an engaging summary of the book, themes, and key takeaways..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Row 5: Read-only User Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Added By (Name - Read-only)
              </label>
              <input
                type="text"
                value={session.user.name || "Member"}
                readOnly
                className="w-full px-3.5 py-2 rounded-lg text-xs bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Added By (Email - Read-only)
              </label>
              <input
                type="email"
                value={session.user.email}
                readOnly
                className="w-full px-3.5 py-2 rounded-lg text-xs bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:bg-emerald-400 shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{uploadingImage ? "Uploading to ImgBB..." : "Saving Book..."}</span>
                </>
              ) : (
                <>
                  <BookPlus className="w-4 h-4" />
                  <span>Add Book to Library</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
