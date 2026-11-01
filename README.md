# BookNook – A Small Online Library

A modern, responsive, full-stack online library application built with **Next.js 14/16 (App Router)**, **TypeScript**, **Tailwind CSS**, **BetterAuth**, and **MongoDB Atlas**.

## 🌐 Live Website URL
- **Client Deployment**: [https://booknook-library.vercel.app](https://booknook-library.vercel.app)
- **Server API**: [https://booknook-server.vercel.app](https://booknook-server.vercel.app)

---

## ✨ 5 Key Features of BookNook
- 📚 **Full CRUD Library Catalog**: Browse an extensive collection of books across Fiction, Science, History, Kids, and Other genres. Authenticated members can contribute new books with ImgBB cover image uploads, edit book metadata, and remove listings with custom confirmation dialogs.
- 🔄 **Smart Borrowing & Return System**: Borrow books with one click for up to 14 days. Active loans are tracked on the member dashboard and can be returned anytime with automated inventory reconciliation.
- 🔒 **Zero Double-Borrow & Stock Protection**: Intelligent safeguards prevent users from borrowing the same book concurrently. Decrements available stock copies atomically using MongoDB `$inc` and automatically disables borrowing when stock hits zero.
- 🛡️ **Robust Authentication with BetterAuth & JWT**: Complete authentication workflow featuring credentials login, password complexity validation (uppercase, lowercase, minimum 6 characters), Google OAuth 2.0 integration, and JWT validation for protected backend mutations.
- 🎨 **Adaptive Responsive Design with Dark/Light Mode**: Elegant theme switcher with persistent local storage, custom Swiper.js hero banner, responsive mobile navigation, modern X social logo, and custom 404 error handling.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom dark mode variants
- **Authentication**: BetterAuth with MongoDB adapter & Google OAuth
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Banner Slider**: Swiper.js
- **Image Hosting**: ImgBB API

### Backend (Server)
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas native driver
- **Security**: JSON Web Token (JWT) verification middleware
- **CORS**: Cross-Origin Resource Sharing enabled for local and production hosts

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/himelbarman/booknook-client.git
cd booknook-client
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@annoying.208jf6p.mongodb.net/booknook
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=5f4837799b0f09a4262a68084a5bf8d6
JWT_SECRET=booknook_jwt_secret_key_2024
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.
