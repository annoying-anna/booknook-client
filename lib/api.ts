import axios from "axios";
import { authClient } from "@/lib/auth-client";
import type { Book, Borrow } from "@/lib/types";

export type { Book, Borrow } from "@/lib/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://booknook-server-ashy.vercel.app";

export const IMGBB_API_KEY =
  process.env.NEXT_PUBLIC_IMGBB_API_KEY || "5f4837799b0f09a4262a68084a5bf8d6";

/**
 * Get the Authorization header from BetterAuth JWT token
 */
export async function getAuthHeader(): Promise<Record<string, string>> {
  if (typeof window === "undefined") return {};

  try {
    const res = await authClient.token();
    const token = res?.data?.token;
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch (err) {
    console.error("Failed to retrieve BetterAuth token:", err);
  }
  return {};
}

/**
 * Upload an image file to ImgBB
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.success && data.data?.url) {
    return data.data.url;
  }
  throw new Error(data.error?.message || "Failed to upload image to ImgBB");
}

/**
 * Fetch books with optional category, sort, limit, search filters
 */
export async function fetchBooks(params?: {
  category?: string;
  sort?: string;
  limit?: number;
  search?: string;
  mine?: boolean;
}): Promise<Book[]> {
  const headers = await getAuthHeader();
  const res = await axios.get(`${API_BASE_URL}/books`, { params, headers });
  return res.data;
}

/**
 * Fetch a single book by ID
 */
export async function fetchBookById(id: string): Promise<Book> {
  const headers = await getAuthHeader();
  const res = await axios.get(`${API_BASE_URL}/books/${id}`, { headers });
  return res.data;
}

/**
 * Create a new book
 */
export async function createBook(bookData: {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
}): Promise<{ insertedId: string; message: string }> {
  const headers = await getAuthHeader();
  const res = await axios.post(`${API_BASE_URL}/books`, bookData, { headers });
  return res.data;
}

/**
 * Update an existing book (owner only)
 */
export async function updateBook(
  id: string,
  updates: Partial<Book>
): Promise<{ modifiedCount: number; message: string }> {
  const headers = await getAuthHeader();
  const res = await axios.patch(`${API_BASE_URL}/books/${id}`, updates, { headers });
  return res.data;
}

/**
 * Delete a book (owner only)
 */
export async function deleteBook(id: string): Promise<{ deletedCount: number; message: string }> {
  const headers = await getAuthHeader();
  const res = await axios.delete(`${API_BASE_URL}/books/${id}`, { headers });
  return res.data;
}

/**
 * Borrow a book (atomic decrement on server)
 */
export async function borrowBook(borrowData: {
  bookId: string;
  returnDate: string;
}): Promise<{ insertedId: string; message: string }> {
  const headers = await getAuthHeader();
  const res = await axios.post(`${API_BASE_URL}/borrows`, borrowData, { headers });
  return res.data;
}

/**
 * Fetch borrows for the authenticated user
 */
export async function fetchMyBorrows(): Promise<Borrow[]> {
  const headers = await getAuthHeader();
  const res = await axios.get(`${API_BASE_URL}/borrows`, { headers });
  return res.data;
}

/**
 * Return a borrowed book (increments copies on server)
 */
export async function returnBorrow(borrowId: string): Promise<{ message: string }> {
  const headers = await getAuthHeader();
  const res = await axios.delete(`${API_BASE_URL}/borrows/${borrowId}`, { headers });
  return res.data;
}
