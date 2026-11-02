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

const SLIDES = [
  { bg: "#1b2f4e", title: "Add a book, borrow a book, return a book.", text: "A community library that lives online. Find your next read in under a minute." },
  { bg: "#5e1f2c", title: "Borrow for a few days, return with one tap.", text: "Pick a return date, read at your own pace, and give the copy back when you finish." },
  { bg: "#0c4a4a", title: "Your shelf helps the next reader.", text: "Share a book you loved. Add it in seconds and see who borrows it." },
];

export default function HeroSlider() {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-[#1b2f4e]">
        <div className="wrap grid min-h-[32rem] items-center gap-10 pb-20 pt-14 md:grid-cols-[1.2fr_1fr]">
          <div className="max-w-xl text-white">
            <h2 className="text-4xl font-bold leading-[1.1] sm:text-5xl">{SLIDES[0].title}</h2>
            <p className="mt-5 font-reading text-lg leading-relaxed text-white/80">{SLIDES[0].text}</p>
            <Link href="/books" className="btn btn-accent mt-8 h-12 px-7">Browse Books</Link>
          </div>
          <ShelfArt className="hidden justify-self-end md:block" />
        </div>
      </div>
    );
  }

  const textVariants = {
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Swiper
      className="hero-swiper"
      modules={[Autoplay, EffectFade, Keyboard, Pagination]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      loop
      keyboard
      pagination={{ clickable: true }}
      autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
    >
      {SLIDES.map((s) => (
        <SwiperSlide key={s.title} style={{ background: s.bg }}>
          <div className="wrap grid min-h-[32rem] items-center gap-10 pb-20 pt-14 md:grid-cols-[1.2fr_1fr]">
            <motion.div
              className="max-w-xl text-white"
              variants={textVariants}
              initial="initial"
              animate="animate"
            >
              <h2 className="text-4xl font-bold leading-[1.1] sm:text-5xl">{s.title}</h2>
              <p className="mt-5 font-reading text-lg leading-relaxed text-white/80">{s.text}</p>
              <Link href="/books" className="btn btn-accent mt-8 h-12 px-7">Browse Books</Link>
            </motion.div>
            <ShelfArt className="hidden justify-self-end md:block" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
