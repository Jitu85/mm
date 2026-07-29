"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getVolumes } from "@/lib/grammar-data";

export default function GrammarIndexPage() {
  const [open, setOpen] = useState<number | null>(1);
  const [vols, setVols] = useState<any[]>([]);

  useEffect(() => {
    setVols(getVolumes());
  }, []);


  const getVolCover = (num: number) => {
    if (num === 1) return "/images/vol1-cover.svg";
    if (num === 2) return "/images/vol2-cover.svg";
    return "/images/vol3-cover.svg";
  };

  const getVolSubtitle = (num: number) => {
    if (num === 1) return "Foundations of Grammar, Nouns, Verbs & Syntax";
    if (num === 2) return "Tenses, Clauses & Advanced Sentence Structure";
    return "Advanced Composition, Rhetoric & Comprehension";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-in">
      {/* Visual Hero Banner */}
      <div className="relative w-full h-[220px] md:h-[260px] rounded-2xl overflow-hidden shadow-lg mb-8 border border-maroon/30">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/grammar-hero.svg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-6 md:p-10 flex flex-col justify-center text-white">
          <span className="inline-block bg-amber-400 text-maroon text-xs font-serif font-bold px-3 py-1 rounded-full mb-2 self-start shadow-sm">
            MODULE A • 28 CHAPTERS
          </span>
          <h1 className="text-2xl md:text-4xl font-serif font-bold mb-2 drop-shadow-md">
            Modern English Grammar &amp; Composition
          </h1>
          <p className="text-sm md:text-base font-serif italic text-amber-100/90 max-w-lg">
            Interactive volume readers, structured chapter lessons &amp; self-testing exercises.
          </p>
        </div>
      </div>

      {/* Volume Cards Accordion */}
      <div className="space-y-6">
        {vols.map((v) => {
          const isOpen = open === v.number;
          const cover = getVolCover(v.number);
          const subtitle = getVolSubtitle(v.number);

          return (
            <div
              key={v.number}
              className="parchment-card rounded-2xl overflow-hidden border border-maroon/20 shadow-md hover:shadow-lg transition-all"
            >
              {/* Card Header Banner */}
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : v.number)}
                className="w-full text-left p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-amber-50/50 transition-colors"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {/* Volume Visual Cover Thumbnail */}
                  <div
                    className="w-24 h-16 md:w-32 md:h-20 rounded-xl bg-cover bg-center shrink-0 shadow-sm border border-maroon/20 overflow-hidden"
                    style={{ backgroundImage: `url('${cover}')` }}
                  />

                  <div>
                    <span className="text-xs font-serif font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      Volume {v.number}
                    </span>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-maroon mt-1">
                      {v.title}
                    </h3>
                    <p className="text-xs text-ink-light font-serif mt-0.5">
                      {subtitle} • {v.chapters.length} Chapters
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <span className="text-xs font-serif font-bold text-maroon bg-maroon/10 px-3 py-1 rounded-full">
                    {v.chapters.length} Chapters
                  </span>
                  <span
                    className="text-maroon text-2xl transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {/* Chapter Items inside Accordion */}
              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-maroon/10 bg-amber-50/30">
                  {v.chapters.length === 0 ? (
                    <p className="px-4 py-3 text-ink-light italic text-sm">
                      This volume is currently pending extraction review.
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-2 mt-2">
                      {v.chapters.map((c: any) => (
                        <Link
                          key={`${c.volNum}-${c.chNum}`}
                          href={`/grammar/${c.volNum}/${c.chNum}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-maroon/20 transition-all group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-maroon/10 text-maroon font-serif font-bold text-xs flex items-center justify-center group-hover:bg-maroon group-hover:text-white transition-colors">
                            {c.chNum}
                          </span>
                          <span className="font-serif text-sm text-ink group-hover:text-maroon font-medium line-clamp-1">
                            {c.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="mt-10 text-center">
        <Link
          href="/dashboard"
          className="btn-maroon inline-block px-8 py-3 rounded-xl font-serif font-semibold shadow-md hover:scale-105 transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
