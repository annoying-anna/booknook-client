"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Keyboard, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import ShelfArt from "./ShelfArt";
import { ArrowRight, BookOpen, Sparkles, ShieldCheck, Clock } from "lucide-react";

const SLIDES = [
  {
    bg: "from-slate-950 via-blue-950 to-indigo-950",
    accent: "from-blue-400 to-indigo-300",
    tag: "Online Community Catalog",
    title: "Discover, Borrow, and Return Books Effortlessly.",
    text: "Access a rich community-curated digital shelf across fiction, modern science, world history, and bedtime tales. Find your next page-turner in seconds.",
    cta: "Explore Library Catalog",
  },
  {
    bg: "from-slate-950 via-rose-950 to-purple-950",
    accent: "from-rose-400 to-amber-300",
    tag: "Flexible Reading Loans",
    title: "Borrow for up to 30 Days with Zero Hassle.",
    text: "Select a custom return date that fits your pace. Automatic stock tracking keeps books circulating seamlessly between readers.",
    cta: "Browse All Genres",
  },
  {
    bg: "from-slate-950 via-emerald-950 to-teal-950",
    accent: "from-emerald-400 to-teal-200",
    tag: "Share Your Passion",
    title: "Contribute Your Shelf to the Next Reader.",
    text: "Own a book you love? Add it to BookNook in under a minute with automated cover uploads and see community members discover it.",
    cta: "Contribute a Book",
    href: "/add-book",
  },
];

export default function HeroSlider() {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">
        <div className="wrap grid min-h-[34rem] items-center gap-12 py-16 md:grid-cols-[1.3fr_1fr]">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Sparkles size={14} /> Community Library
            </span>
            <h1 className="text-4xl font-extrabold sm:text-6xl">{SLIDES[0].title}</h1>
            <p className="font-reading text-lg text-slate-300">{SLIDES[0].text}</p>
            <div className="pt-4 flex gap-4">
              <Link href="/books" className="btn btn-accent h-12 px-7 text-sm">
                Browse Books <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <ShelfArt className="hidden md:block justify-self-end" />
        </div>
      </div>
    );
  }

  const textVariants = {
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative overflow-hidden border-b border-line/60">
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, EffectFade, Keyboard, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        keyboard
        pagination={{ clickable: true }}
        autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
      >
        {SLIDES.map((s) => (
          <SwiperSlide key={s.title}>
            <div className={`relative bg-gradient-to-br ${s.bg} text-white`}>
              {/* Decorative radial glows */}
              <div className="absolute top-0 right-1/4 -z-0 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 -z-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

              <div className="wrap relative z-10 grid min-h-[34rem] items-center gap-12 py-16 md:grid-cols-[1.3fr_1fr]">
                <motion.div
                  className="max-w-2xl space-y-6"
                  variants={textVariants}
                  initial="initial"
                  animate="animate"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md">
                    <Sparkles size={14} className="text-amber-400" />
                    <span className="tracking-wide uppercase text-white/90">{s.tag}</span>
                  </div>

                  <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-6xl tracking-tight">
                    <span className={`bg-gradient-to-r ${s.accent} bg-clip-text text-transparent`}>
                      {s.title.split(" ")[0]}
                    </span>{" "}
                    {s.title.split(" ").slice(1).join(" ")}
                  </h1>

                  <p className="font-reading text-lg leading-relaxed text-slate-300 max-w-xl">
                    {s.text}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link href={s.href || "/books"} className="btn btn-accent h-12 px-7 text-sm font-bold shadow-xl">
                      {s.cta} <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/books"
                      className="btn bg-white/10 text-white hover:bg-white/20 border border-white/20 h-12 px-6 text-sm backdrop-blur-md"
                    >
                      <BookOpen size={16} /> Explore Shelves
                    </Link>
                  </div>

                  {/* Highlights Bar */}
                  <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                      <span>Verified Copies</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock size={16} className="text-amber-400 shrink-0" />
                      <span>Instant Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Sparkles size={16} className="text-blue-400 shrink-0" />
                      <span>100% Free Access</span>
                    </div>
                  </div>
                </motion.div>

                {/* Right Book Art Showcase */}
                <div className="hidden md:flex flex-col items-end justify-center">
                  <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                    <div className="absolute -top-3 -left-3 rounded-xl bg-amber-500 text-slate-950 px-3 py-1 text-xs font-bold shadow-lg">
                      Curated Shelves
                    </div>
                    <ShelfArt />
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                      <span>5 Spine Categories</span>
                      <span className="font-semibold text-white">Cloth-Bound Edition</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
