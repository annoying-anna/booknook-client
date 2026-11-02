// Adjust field names to match what your Express API returns.
export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies?: number;
  availableCopies?: number;
  userName: string;
  userEmail: string;
  createdAt?: string;
};

export type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
};
