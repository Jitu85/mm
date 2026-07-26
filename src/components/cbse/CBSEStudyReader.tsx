"use client";

import { useState } from "react";
import { BookNote } from "@/lib/module-c-data";

interface CBSEStudyReaderProps {
  notes: BookNote[];
  selectedSubject: string;
  onBack: () => void;
}

export default function CBSEStudyReader({
  notes,
  selectedSubject,
  onBack,
}: CBSEStudyReaderProps) {
  const filteredNotes =
    selectedSubject === "All"
      ? notes
      : notes.filter(
          (b) => b.subject.toLowerCase() === selectedSubject.toLowerCase()
        );

  const [activeBookIdx, setActiveBookIdx] = useState<number>(0);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [openQaIdx, setOpenQaIdx] = useState<Record<number, boolean>>({});

  const currentBook = filteredNotes[activeBookIdx] || filteredNotes[0];
  const currentChapter = currentBook?.chapters[activeChapterIdx] || currentBook?.chapters[0];

  const toggleQa = (idx: number) => {
    setOpenQaIdx((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (!filteredNotes || filteredNotes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center parchment-card rounded-xl">
        <h2 className="text-2xl font-serif font-bold text-maroon mb-4">No Study Notes Found</h2>
        <p className="text-ink-light mb-6">No study notes available for subject: {selectedSubject}</p>
        <button onClick={onBack} className="btn-maroon px-6 py-2 rounded-lg font-serif">
          Return to Hub
        </button>
      </div>
    );
  }

  // Render visual SVG illustrations for specific chapters
  const renderChapterIllustration = (title: string, subject: string) => {
    const titleLower = title.toLowerCase();

    // Science Illustrations
    if (subject === "Science") {
      if (titleLower.includes("chemical") || titleLower.includes("reaction")) {
        return (
          <div className="my-6 p-4 bg-gradient-to-r from-teal-900/10 via-emerald-900/10 to-teal-900/10 rounded-xl border border-teal-500/30 text-center">
            <div className="text-xs font-bold font-serif text-teal-800 uppercase tracking-wider mb-2">
              🧪 Reaction Visualiser: Combination & Redox Reactions
            </div>
            <svg viewBox="0 0 400 100" className="w-full max-w-md mx-auto h-24">
              <rect x="10" y="25" width="80" height="50" rx="8" fill="#0d9488" opacity="0.8" />
              <text x="50" y="55" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Reactant A</text>
              
              <text x="110" y="55" fill="#800020" fontSize="20" fontWeight="bold" textAnchor="middle">+</text>
              
              <rect x="130" y="25" width="80" height="50" rx="8" fill="#0284c7" opacity="0.8" />
              <text x="170" y="55" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Reactant B</text>
              
              <path d="M 225 50 L 265 50" stroke="#800020" strokeWidth="3" markerEnd="url(#arrow)" />
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#800020" />
                </marker>
              </defs>
              
              <rect x="275" y="20" width="115" height="60" rx="10" fill="#059669" />
              <text x="332" y="48" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Product (A+B)</text>
              <text x="332" y="66" fill="#a7f3d0" fontSize="10" textAnchor="middle">Energy Released</text>
            </svg>
          </div>
        );
      }

      if (titleLower.includes("acid") || titleLower.includes("base") || titleLower.includes("salt")) {
        return (
          <div className="my-6 p-4 bg-gradient-to-r from-red-900/10 via-amber-900/10 to-blue-900/10 rounded-xl border border-gold/30 text-center">
            <div className="text-xs font-bold font-serif text-maroon uppercase tracking-wider mb-2">
              🧪 pH Scale Indicator (0 to 14)
            </div>
            <div className="h-6 w-full max-w-md mx-auto rounded-full bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600 flex items-center justify-between px-3 text-white text-xs font-bold shadow-inner">
              <span>0 (Acidic)</span>
              <span>7 (Neutral)</span>
              <span>14 (Alkaline)</span>
            </div>
          </div>
        );
      }

      if (titleLower.includes("light") || titleLower.includes("reflection") || titleLower.includes("eye")) {
        return (
          <div className="my-6 p-4 bg-gradient-to-r from-indigo-900/10 to-purple-900/10 rounded-xl border border-indigo-500/30 text-center">
            <div className="text-xs font-bold font-serif text-indigo-900 uppercase tracking-wider mb-2">
              💡 Optics: Convex Lens Converging Ray Diagram
            </div>
            <svg viewBox="0 0 400 100" className="w-full max-w-md mx-auto h-24">
              <line x1="10" y1="50" x2="390" y2="50" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
              <ellipse cx="200" cy="50" rx="15" ry="40" fill="#818cf8" opacity="0.4" stroke="#4f46e5" strokeWidth="2" />
              <path d="M 30 20 L 200 20 L 350 50" stroke="#f59e0b" strokeWidth="2" fill="none" />
              <path d="M 30 80 L 200 80 L 350 50" stroke="#f59e0b" strokeWidth="2" fill="none" />
              <circle cx="350" cy="50" r="4" fill="#dc2626" />
              <text x="350" y="70" fill="#dc2626" fontSize="10" fontWeight="bold" textAnchor="middle">Focus (F)</text>
            </svg>
          </div>
        );
      }

      if (titleLower.includes("electricity") || titleLower.includes("magnetic")) {
        return (
          <div className="my-6 p-4 bg-gradient-to-r from-amber-900/10 to-yellow-900/10 rounded-xl border border-amber-500/30 text-center">
            <div className="text-xs font-bold font-serif text-amber-900 uppercase tracking-wider mb-2">
              ⚡ Electric Circuit & Ohm's Law (V = I × R)
            </div>
            <div className="flex justify-center items-center gap-4 text-xs font-mono font-bold text-maroon">
              <span className="p-2 bg-amber-100 rounded-lg border border-amber-400">Voltage (V) = 220V</span>
              <span>⚡</span>
              <span className="p-2 bg-amber-100 rounded-lg border border-amber-400">Current (I) = V / R</span>
              <span>⚡</span>
              <span className="p-2 bg-amber-100 rounded-lg border border-amber-400">Resistance (R) = ρL/A</span>
            </div>
          </div>
        );
      }
    }

    // Math Illustrations
    if (subject === "Mathematics") {
      if (titleLower.includes("trigonometry")) {
        return (
          <div className="my-6 p-4 bg-gradient-to-r from-blue-900/10 to-indigo-900/10 rounded-xl border border-blue-500/30 text-center">
            <div className="text-xs font-bold font-serif text-blue-900 uppercase tracking-wider mb-2">
              📐 Right Triangle Trigonometric Ratios
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-xs font-serif font-bold text-ink">
              <span className="p-2 bg-blue-50 rounded-lg border border-blue-300">sin θ = Perpendicular / Hypotenuse</span>
              <span className="p-2 bg-blue-50 rounded-lg border border-blue-300">cos θ = Base / Hypotenuse</span>
              <span className="p-2 bg-blue-50 rounded-lg border border-blue-300">tan θ = Perpendicular / Base</span>
            </div>
          </div>
        );
      }

      if (titleLower.includes("quadratic") || titleLower.includes("polynomial")) {
        return (
          <div className="my-6 p-4 bg-gradient-to-r from-emerald-900/10 to-teal-900/10 rounded-xl border border-emerald-500/30 text-center">
            <div className="text-xs font-bold font-serif text-emerald-900 uppercase tracking-wider mb-2">
              🧮 Quadratic Formula & Discriminant (D = b² - 4ac)
            </div>
            <div className="text-sm font-mono font-bold text-maroon bg-emerald-50/50 p-3 rounded-lg border border-emerald-300 inline-block">
              x = [-b ± √(b² - 4ac)] / (2a)
            </div>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 fade-in">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gold/30">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-maroon hover:text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1"
          >
            ← Back to Module C Hub
          </button>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-maroon">
            Textbook Core Content, Explanations & Q&A
          </h1>
          <p className="text-xs text-ink-light italic">
            NCERT Class X Chapter Guides, Class IX Prerequisite Foundations & Step-by-Step Solutions
          </p>
        </div>

        {/* Book Switcher Tabs */}
        <div className="flex flex-wrap gap-2">
          {filteredNotes.map((book, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveBookIdx(idx);
                setActiveChapterIdx(0);
                setOpenQaIdx({});
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-serif transition-all ${
                activeBookIdx === idx
                  ? "bg-maroon text-white font-bold shadow-md ring-2 ring-gold/40"
                  : "bg-parchment-dark text-ink hover:bg-gold/20"
              }`}
            >
              {book.subject}: {book.book}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Chapter Navigation Sidebar */}
        <div className="md:col-span-1 parchment-card p-4 rounded-xl max-h-[75vh] overflow-y-auto border border-gold/30 shadow-md">
          <h3 className="text-xs font-serif font-bold text-maroon mb-3 uppercase tracking-wider border-b border-gold/30 pb-2 flex justify-between items-center">
            <span>Chapters</span>
            <span className="bg-maroon text-white px-2 py-0.5 rounded-full text-[10px]">
              {currentBook?.chapters.length || 0}
            </span>
          </h3>
          <div className="space-y-1.5">
            {currentBook?.chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveChapterIdx(idx);
                  setOpenQaIdx({});
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-serif transition-all flex items-start gap-2 ${
                  activeChapterIdx === idx
                    ? "bg-maroon text-white font-bold shadow-sm"
                    : "text-ink hover:bg-parchment-dark"
                }`}
              >
                <span className="text-gold font-bold">{idx + 1}.</span>
                <span className="line-clamp-2 leading-tight">
                  {ch.title.replace(/^Chapter \d+:?\s*/i, "").replace(/^Unit \d+:?\s*/i, "")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Reader View */}
        <div className="md:col-span-3 parchment-card p-6 md:p-8 rounded-xl border border-gold/40 shadow-xl">
          {currentChapter ? (
            <div>
              {/* Chapter Title Badge */}
              <div className="mb-6 pb-4 border-b border-maroon/20">
                <div className="inline-block px-3 py-1 bg-maroon/10 text-maroon rounded-full text-xs font-bold font-serif mb-2 border border-maroon/20">
                  {currentBook.subject} • {currentBook.book}
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-maroon">
                  {currentChapter.title}
                </h2>
              </div>

              {/* Dynamic Chapter Visual Illustration */}
              {renderChapterIllustration(currentChapter.title, currentBook.subject)}

              {/* Key Subsections / Prerequisite Badges */}
              {currentChapter.subsections.length > 0 && (
                <div className="mb-6 bg-gradient-to-r from-amber-900/10 to-maroon/10 p-4 rounded-xl border-l-4 border-gold shadow-sm">
                  <h4 className="text-xs font-serif font-bold text-maroon uppercase tracking-wider mb-2">
                    📌 Key Themes & Prerequisite Foundations
                  </h4>
                  <ul className="space-y-1 text-xs text-ink-light font-serif">
                    {currentChapter.subsections.map((sub, sidx) => (
                      <li key={sidx} className="flex items-start gap-1.5">
                        <span className="text-gold font-bold">•</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Core Chapter Paragraph Content */}
              <div className="space-y-4 text-ink leading-relaxed font-serif text-sm">
                {currentChapter.content.map((pText, pIdx) => {
                  if (pText.startsWith("Class IX Prerequisite") || pText.startsWith("Class X Core") || pText.startsWith("Master Formula")) {
                    return (
                      <div
                        key={pIdx}
                        className="bg-gold/10 p-4 rounded-xl border border-gold/40 font-serif my-4 shadow-sm"
                      >
                        <h4 className="text-xs font-bold text-maroon uppercase tracking-wider mb-1">
                          ⚡ {pText.split(":")[0]}
                        </h4>
                        <p className="text-xs text-ink leading-relaxed">
                          {pText.includes(":") ? pText.split(":").slice(1).join(":") : pText}
                        </p>
                      </div>
                    );
                  }

                  if (pText.startsWith("Key Equations") || pText.startsWith("Reactants") || pText.startsWith("Ohm's Law")) {
                    return (
                      <div
                        key={pIdx}
                        className="bg-teal-900/10 p-3 rounded-lg border border-teal-500/30 text-xs font-mono font-bold text-teal-900 my-3"
                      >
                        🧪 {pText}
                      </div>
                    );
                  }

                  return (
                    <p key={pIdx} className="text-justify leading-relaxed">
                      {pText}
                    </p>
                  );
                })}
              </div>

              {/* Accordion Q&A Solutions Section */}
              {currentChapter.qa && currentChapter.qa.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gold/40">
                  <h3 className="text-lg font-serif font-bold text-maroon mb-4 flex items-center gap-2">
                    <span>✍️ Step-by-Step Textbook Questions & Solutions</span>
                    <span className="text-xs bg-maroon/10 text-maroon px-2 py-0.5 rounded-full">
                      {currentChapter.qa.length} Q&A
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {currentChapter.qa.map((qa, qidx) => {
                      const isOpen = !!openQaIdx[qidx];
                      return (
                        <div
                          key={qidx}
                          className="border border-gold/30 rounded-xl overflow-hidden bg-parchment-dark/50"
                        >
                          <button
                            type="button"
                            onClick={() => toggleQa(qidx)}
                            className="w-full p-4 text-left font-serif text-xs md:text-sm font-bold text-maroon hover:bg-gold/10 transition-all flex items-start justify-between gap-3"
                          >
                            <span className="flex-1">{qa.question}</span>
                            <span className="text-gold text-lg">{isOpen ? "▲" : "▼"}</span>
                          </button>

                          {isOpen && (
                            <div className="p-4 bg-parchment border-t border-gold/20 text-xs md:text-sm text-ink font-serif leading-relaxed fade-in">
                              <div className="font-bold text-emerald-800 mb-1">Detailed Solution / Answer:</div>
                              <p className="whitespace-pre-line text-justify">{qa.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Chapter Prev / Next Buttons */}
              <div className="mt-8 pt-4 border-t border-gold/30 flex justify-between gap-4">
                <button
                  disabled={activeChapterIdx === 0}
                  onClick={() => {
                    setActiveChapterIdx((prev) => Math.max(0, prev - 1));
                    setOpenQaIdx({});
                  }}
                  className="btn-gold px-5 py-2.5 rounded-lg text-xs font-serif font-bold disabled:opacity-40"
                >
                  ← Previous Chapter
                </button>

                <button
                  disabled={activeChapterIdx === currentBook.chapters.length - 1}
                  onClick={() => {
                    setActiveChapterIdx((prev) =>
                      Math.min(currentBook.chapters.length - 1, prev + 1)
                    );
                    setOpenQaIdx({});
                  }}
                  className="btn-maroon px-5 py-2.5 rounded-lg text-xs font-serif font-bold disabled:opacity-40"
                >
                  Next Chapter →
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-ink-light italic">Select a chapter to view notes.</p>
          )}
        </div>
      </div>
    </div>
  );
}
