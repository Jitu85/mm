"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Slide {
  id: number;
  image: string;
  badge: string;
  label: string;
  sub: string;
  ctaText: string;
  ctaHref: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/slide1-grammar.svg",
    badge: "Module A",
    label: "Modern English Grammar",
    sub: "Interactive volume readers, exercises & language fundamentals",
    ctaText: "Explore Grammar",
    ctaHref: "/grammar",
  },
  {
    id: 2,
    image: "/images/slide2-qa.svg",
    badge: "Module B",
    label: "Questions & Answers Arena",
    sub: "570+ interactive questions in Science, Math, Computer & AI",
    ctaText: "Start Q&A Quiz",
    ctaHref: "/module/B",
  },
  {
    id: 3,
    image: "/images/slide3-science.svg",
    badge: "Interactive Learning",
    label: "Science & Technology",
    sub: "Discover scientific concepts, computing & artificial intelligence",
    ctaText: "Test Science Skills",
    ctaHref: "/module/B",
  },
  {
    id: 4,
    image: "/images/slide4-gamified.svg",
    badge: "Challenge Modes",
    label: "Speed Quiz & Exam Modes",
    sub: "Race against ticking timers, build streaks & earn rank badges",
    ctaText: "Play Speed Quiz",
    ctaHref: "/module/B",
  },
  {
    id: 5,
    image: "/images/slide5-progress.svg",
    badge: "Learning Analytics",
    label: "Track Progress & Mastery",
    sub: "Watch your accuracy, streaks & high scores grow over time",
    ctaText: "View Dashboard",
    ctaHref: "/dashboard",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-full min-h-[360px] md:min-h-[420px] overflow-hidden rounded-2xl shadow-xl border border-maroon/20 group">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-7000"
            style={{ backgroundImage: `url(${s.image})` }}
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 flex flex-col justify-end p-6 md:p-10 text-white">
            <span className="inline-block self-start bg-amber-500/90 text-black text-xs font-serif font-bold px-3 py-1 rounded-full mb-2 shadow-sm">
              {s.badge}
            </span>

            <h2 className="text-2xl md:text-4xl font-serif font-bold mb-2 text-white drop-shadow-md">
              {s.label}
            </h2>

            <p className="text-sm md:text-lg font-serif italic text-amber-100/90 mb-4 max-w-xl leading-relaxed">
              {s.sub}
            </p>

            <div>
              <Link
                href={s.ctaHref}
                className="inline-flex items-center gap-2 bg-maroon hover:bg-amber-700 text-white font-serif font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <span>{s.ctaText}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Prev Arrow */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-maroon transition-all flex items-center justify-center text-xl backdrop-blur-sm cursor-pointer"
        aria-label="Previous slide"
      >
        ‹
      </button>

      {/* Next Arrow */}
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-maroon transition-all flex items-center justify-center text-xl backdrop-blur-sm cursor-pointer"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 right-6 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === current ? "bg-amber-400 w-8" : "bg-white/50 w-2 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
