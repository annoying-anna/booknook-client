# BookNook – An Online Community Library

A full-stack modern online library application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, **BetterAuth with JWT & JWKS**, and an **Express.js + MongoDB Atlas** backend service.

## 🌐 Live Application
- **Live Client Application**: [https://booknook-client-tau.vercel.app/](https://booknook-client-tau.vercel.app/)
- **Live Server API**: [https://booknook-server-ashy.vercel.app](https://booknook-server-ashy.vercel.app)

---

## ✨ Key Features (60/60 Implementation)
- 📚 **Cloth-Bound Spine Design System**: A bespoke bookish design system where each category (Fiction, Science, History, Kids, Others) features its signature spine color applied to book cards, category shelves, loaders, and footer strips with full Dark/Light theme switching.
- 🔄 **Atomic Borrowing with Duplicate Prevention**: Atomic `findOneAndUpdate` inventory decrement operations with `{ availableCopies: { $gt: 0 } }` and `$inc: -1`. Compound unique indexing on `{ bookId, userEmail }` strictly blocks duplicate borrows with HTTP 409 Conflict.
- 🛡️ **BetterAuth with Remote JWKS Token Verification**: Authentication featuring credentials login, real-time password criteria validation (uppercase, lowercase, minimum 6 characters), Google OAuth 2.0 integration, and cryptographically verified JWT authorization via `jose` remote JWKS (`/api/auth/jwks`).
- ✍️ **Complete Library Management (CRUD)**: Authorized members can contribute books with ImgBB automated cover uploads, edit books with prefilled forms, and delete titles protected by custom `<ConfirmModal/>` dialogs and server-side ownership verification.
- 📖 **Member Dashboard & Smart Return System**: Track active loans on `/my-borrows`, view overdue indicators, and return borrowed copies with one click, automatically incrementing available stock copies on the shelf.
- 🚀 **Zero Flash & Frictionless Hydration**: Protected private routes gracefully retain authenticated sessions during full-page reloads using `<Loader/>` states rather than redirecting to `/login`. Smooth Swiper hero presentation with Framer Motion animations honoring `prefers-reduced-motion`.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 design tokens (`@theme inline`)
- **Authentication**: BetterAuth with MongoDB adapter, Google OAuth, and JWT plugin
- **Icons**: Lucide React & React Icons (including new X logo)
- **Notifications**: Sonner rich toasts
- **Animations**: Framer Motion
- **Carousel**: Swiper.js

### Backend (Server)
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas
- **Token Verification**: `jose` with remote JWKS verification
- **Deployment**: Vercel Serverless Function

---

## ⚙️ Environment Variables (`.env.local`)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@annoying.208jf6p.mongodb.net/booknook
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=https://booknook-client-tau.vercel.app
NEXT_PUBLIC_APP_URL=https://booknook-client-tau.vercel.app
GOOGLE_CLIENT_ID=1036832934745-bm5v9gip03t3oth26bk7hgjlmjhfjed3.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=https://booknook-server-ashy.vercel.app
NEXT_PUBLIC_SERVER_URL=https://booknook-server-ashy.vercel.app
NEXT_PUBLIC_IMGBB_API_KEY=5f4837799b0f09a4262a68084a5bf8d6
```
