"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ArrowRight, BookOpen, Sparkles, BookMarked } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    id: 1,
    title: "Discover Your Next Great Adventure",
    subtitle: "Immerse in Timeless Classics & New Releases",
    description: "Explore thousands of curated titles across science, fiction, history, and children's literature. Borrow instantly and expand your mind.",
    image: "https://images.unsplash.com/photo-1507842229451-7f01be7fe730?auto=format&fit=crop&q=80&w=1600",
    badge: "Trending Now",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Simple, Free & Seamless Book Borrowing",
    subtitle: "Add a Book, Borrow a Book, Return a Book",
    description: "Join a vibrant community of readers. Keep track of your borrowed books, manage returns effortlessly, and share knowledge with fellow bibliophiles.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1600",
    badge: "Community Powered",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "Expand Your Horizons with Every Page",
    subtitle: "From Cosmic Mysteries to Human History",
    description: "Whether you want to understand the cosmos with Stephen Hawking or retrace history with Yuval Noah Harari, BookNook brings library power to your fingertips.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1600",
    badge: "Knowledge Unlocked",
    icon: BookMarked,
  },
];

export default function HomeSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-12 h-[450px] sm:h-[500px] lg:h-[540px] bg-slate-900 flex items-center">
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 lg:px-16 text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trending Now</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Your Next Great Adventure
          </h1>
          <p className="text-base sm:text-lg text-emerald-200 font-medium">
            Immerse in Timeless Classics &amp; New Releases
          </p>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Explore thousands of curated titles across science, fiction, history, and children&apos;s literature.
          </p>
          <div className="pt-2">
            <Link
              href="/books"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/25 transition-all"
            >
              <span>Browse Books</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-12">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className="w-full h-[450px] sm:h-[500px] lg:h-[540px]"
      >
        {slides.map((slide) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full flex items-center">
                {/* Background Image with Dark Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
                  <div className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-2xl px-6 sm:px-12 lg:px-16 text-white space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{slide.badge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-base sm:text-lg text-emerald-200 font-medium">
                    {slide.subtitle}
                  </p>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                    {slide.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/books"
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 shadow-lg shadow-emerald-500/25 transition-all"
                    >
                      <span>Browse Books</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
