import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
export const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: "Fiction" | "Science" | "History" | "Kids" | "Others" | string;
  image: string;
  description: string;
  addedByName?: string;
  addedByEmail?: string;
  totalCopies: number;
  createdAt?: string;
}

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
  borrowedAt?: string;
}

/**
 * Obtain or reuse a valid JWT token for the user's email
 */
export async function getJwtToken(email: string): Promise<string> {
  if (typeof window === "undefined") return "";

  const stored = localStorage.getItem(`booknook_jwt_${email}`);
  if (stored) {
    try {
      const payload = JSON.parse(atob(stored.split(".")[1]));
      if (payload.exp && payload.exp * 1000 > Date.now()) {
        return stored;
      }
    } catch {
      // invalid token, refetch
    }
  }

  try {
    const res = await axios.post(`${API_BASE_URL}/jwt`, { email });
    const token = res.data.token;
    if (token) {
      localStorage.setItem(`booknook_jwt_${email}`, token);
      localStorage.setItem("booknook_current_token", token);
      return token;
    }
  } catch (err) {
    console.error("Failed to obtain JWT token:", err);
  }
  return "";
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
 * Fetch all books with optional filters
 */
export async function fetchBooks(params?: { category?: string; email?: string; limit?: number }): Promise<Book[]> {
  const res = await axios.get(`${API_BASE_URL}/books`, { params });
  return res.data;
}

/**
 * Fetch latest 6 new arrivals
 */
export async function fetchNewArrivals(): Promise<Book[]> {
  const res = await axios.get(`${API_BASE_URL}/books/new-arrivals`);
  return res.data;
}

/**
 * Fetch a single book by ID
 */
export async function fetchBookById(id: string): Promise<Book> {
  const res = await axios.get(`${API_BASE_URL}/books/${id}`);
  return res.data;
}

/**
 * Create a new book
 */
export async function createBook(bookData: Partial<Book>, userEmail: string): Promise<{ insertedId: string; message: string }> {
  const token = await getJwtToken(userEmail);
  const res = await axios.post(`${API_BASE_URL}/books`, bookData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

/**
 * Update an existing book
 */
export async function updateBook(id: string, updates: Partial<Book>, userEmail: string): Promise<{ modifiedCount: number; message: string }> {
  const token = await getJwtToken(userEmail);
  const res = await axios.patch(`${API_BASE_URL}/books/${id}`, updates, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

/**
 * Delete a book
 */
export async function deleteBook(id: string, userEmail: string): Promise<{ deletedCount: number; message: string }> {
  const token = await getJwtToken(userEmail);
  const res = await axios.delete(`${API_BASE_URL}/books/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

/**
 * Borrow a book
 */
export async function borrowBook(borrowData: {
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
}): Promise<{ insertedId: string; message: string }> {
  const token = await getJwtToken(borrowData.userEmail);
  const res = await axios.post(`${API_BASE_URL}/borrows`, borrowData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

/**
 * Get borrows for the logged-in user
 */
export async function fetchMyBorrows(userEmail: string): Promise<Borrow[]> {
  const token = await getJwtToken(userEmail);
  const res = await axios.get(`${API_BASE_URL}/borrows`, {
    params: { email: userEmail },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

/**
 * Return a borrowed book
 */
export async function returnBorrow(borrowId: string, userEmail: string): Promise<{ message: string }> {
  const token = await getJwtToken(userEmail);
  const res = await axios.delete(`${API_BASE_URL}/borrows/${borrowId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
