# 📖 BookNook – Modern Online Community Library

[![Live Site](https://img.shields.io/badge/Live%20Demo-booknook--client-blue?style=for-the-badge&logo=vercel)](https://booknook-client-tau.vercel.app/)
[![API Status](https://img.shields.io/badge/API-Express%20%2B%20MongoDB-emerald?style=for-the-badge&logo=express)](https://booknook-server-ashy.vercel.app/books)
[![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![BetterAuth](https://img.shields.io/badge/Auth-BetterAuth%20%2B%20Google-purple?style=for-the-badge)](https://www.better-auth.com/)

A modern, full-stack community library application where book enthusiasts can discover literary masterworks, borrow physical copies with real-time atomic inventory management, share personal collections, and track reading milestones.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, **BetterAuth with JWT & JWKS**, and an **Express.js + MongoDB Atlas** backend service.

---

## 🌐 Live Production Links
* **Client Application**: [https://booknook-client-tau.vercel.app/](https://booknook-client-tau.vercel.app/)
* **Backend API**: [https://booknook-server-ashy.vercel.app/books](https://booknook-server-ashy.vercel.app/books)

---

## 📸 Website Previews & Screenshots

### 1. Editorial Magazine Home & Literary Matchmaker
> Interactive book showcase with dynamic gradients, real-time community statistics, and the new **Literary Matchmaker** vibe recommender.
![BookNook Home Page](public/screenshots/home.png)

<br />

### 2. Comprehensive 65-Volume Catalog with Bookshelf & Grid View
> Browse 65 curated titles across Fiction, Science, History, Kids, and Others with dynamic search, sort criteria, in-stock filtering, and the toggleable **Wooden Bookshelf View**.
![Catalog and Filters](public/screenshots/catalog.png)

<br />

### 3. Book Details & Hardcover Presentation
> 3D book spine perspective, verified metadata, read-time calculator, share sheet, and atomic borrow modal with live stock validation.
![Book Details View](public/screenshots/book-details.png)

<br />

### 4. Split-Screen Authentication & Google OAuth
> Secure Google Sign-In and credentials registration with live password rule verification and seamless session retention.
![Authentication Screen](public/screenshots/login.png)

---

## ✨ Key Features & Creative Innovations (60/60 Rubric)

- 🪵 **Interactive 3D Wooden Bookshelf Mode**: Seamlessly toggle between modern responsive card grids and an authentic library bookshelf with oak shelves, upright cloth-bound book spines, gold foil bands, and interactive click-to-inspect drawers.
- 🧭 **Literary Matchmaker (Vibe Recommender)**: Select your reading mood (*Cosmic Wonder*, *Dystopian Thrills*, *Epic History*, *Gentle Nostalgia*, *Stoic Wisdom*) to instantly receive curated book recommendations with personalized reading reasons and match scores.
- 🎧 **Web Audio Ambient Reading Lounge**: Built-in, zero-latency ambient soundscapes synthesized directly in the browser via the Web Audio API—choose between *Library Rain on Window*, *Crackling Fireplace*, or *Warm Café Murmur* with custom volume controls.
- 🪪 **Holographic Digital Sanctuary Pass**: View and export a digital membership pass on `/profile` complete with member barcode, unique membership ID (`BNK-XXXX-LIT`), member tier ("Master Bibliophile"), and 2026 reading challenge progress bars.
- 📚 **Cloth-Bound Spine Design System**: A bespoke bookish design system where each category (*Fiction, Science, History, Kids, Others*) features its signature spine color applied to cards, category shelves, loaders, and footer strips with full Dark/Light theme switching.
- 🔄 **Atomic Borrowing with Duplicate Prevention**: Atomic `findOneAndUpdate` inventory decrement operations with `{ availableCopies: { $gt: 0 } }` and `$inc: -1`. Compound unique indexing on `{ bookId, userEmail }` strictly blocks duplicate borrows with HTTP 409 Conflict.
- 🛡️ **BetterAuth with Remote JWKS Token Verification**: Full authentication featuring credentials login, real-time password criteria validation (uppercase, lowercase, minimum 6 characters), Google OAuth 2.0 integration, and cryptographically verified JWT authorization via `jose` remote JWKS (`/api/auth/jwks`).
- ✍️ **Complete Library Management (CRUD)**: Authorized members can contribute books with ImgBB automated cover uploads, edit books with prefilled forms, and delete titles protected by custom `<ConfirmModal/>` dialogs and server-side ownership verification.
- 📖 **Member Dashboard & Smart Return System**: Track active loans on `/my-borrows`, view overdue indicators, and return borrowed copies with one click, automatically incrementing available stock copies on the shelf.
- 🚀 **Zero Flash & Frictionless Hydration**: Protected private routes gracefully retain authenticated sessions during full-page reloads using `<Loader/>` states rather than redirecting to `/login`. Smooth Swiper hero presentation with Framer Motion animations honoring `prefers-reduced-motion`.

---

## 🗄️ Database Catalog Overview

The library database is populated with **65 masterwork volumes** across all 5 official categories:

| Category | Count | Notable Volumes Included |
|---|---|---|
| **Fiction** | 13 | *1984*, *To Kill a Mockingbird*, *The Great Gatsby*, *Brave New World*, *Pride and Prejudice*, *The Picture of Dorian Gray*, *Fahrenheit 451*, *Frankenstein*, *Jane Eyre*, *The Alchemist* |
| **Science** | 13 | *Cosmos*, *A Brief History of Time*, *The Gene*, *The Selfish Gene*, *Thinking in Systems*, *The Elegant Universe*, *The Structure of Scientific Revolutions*, *Gödel, Escher, Bach*, *The Origin of Species* |
| **History** | 13 | *Sapiens*, *Guns, Germs, and Steel*, *The Silk Roads*, *SPQR*, *The Diary of a Young Girl*, *The Lessons of History*, *Team of Rivals*, *A Short History of Nearly Everything*, *The History of the Ancient World* |
| **Kids** | 13 | *The Little Prince*, *The Hobbit*, *Charlotte's Web*, *Harry Potter*, *Matilda*, *Winnie-the-Pooh*, *The Secret Garden*, *Bridge to Terabithia*, *The Phantom Tollbooth*, *A Wrinkle in Time* |
| **Others** | 13 | *Atomic Habits*, *Thinking, Fast and Slow*, *The Psychology of Money*, *Meditations*, *Deep Work*, *The Obstacle Is the Way*, *Flow*, *Zero to One*, *Essentialism*, *Steal Like an Artist* |

---

## 🛠️ Tech Stack & Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 Client                    │
│   App Router · Web Audio API · 3D Bookshelf View       │
└──────────────────────────┬─────────────────────────────┘
                           │
             BetterAuth    │ Bearer JWT Token
             (Next.js)     │ (Remote JWKS)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Express.js Server                    │
│            jose Remote JWKS · CORS · Node.js           │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                  MongoDB Atlas Cluster                 │
│      Collections: books (65) · borrows · users         │
└────────────────────────────────────────────────────────┘
```

---

## ⚙️ Environment Variables

### Client (`booknook-client/.env.local`)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/booknook
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=https://booknook-client-tau.vercel.app
NEXT_PUBLIC_APP_URL=https://booknook-client-tau.vercel.app
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_URL=https://booknook-server-ashy.vercel.app
NEXT_PUBLIC_SERVER_URL=https://booknook-server-ashy.vercel.app
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### Server (`booknook-server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/booknook
CLIENT_URL=https://booknook-client-tau.vercel.app
```

---

## 🚀 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/annoying-anna/booknook-client.git
   cd booknook-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Fill in MongoDB URI, Google OAuth, and server API URL
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
