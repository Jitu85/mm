"use client";

import { useState, useEffect } from "react";
import CBSEStudyReader from "./CBSEStudyReader";
import CBSEExamEngine from "./CBSEExamEngine";
import { BookNote, getModuleCMeta, getModuleCNotes } from "@/lib/module-c-data";

export default function CBSEModuleHub() {
  const [activeTab, setActiveTab] = useState<"hub" | "study" | "exam">("hub");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [meta, setMeta] = useState<any>(null);
  const [notes, setNotes] = useState<BookNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const metaData = getModuleCMeta();
      const notesData = getModuleCNotes();

      setMeta(metaData);
      setNotes(notesData || []);
    } catch (err) {
      console.error("Failed to load CBSE Hub data:", err);
    } finally {
      setLoading(false);
    }
  }, []);



  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-serif text-maroon">
        <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
        <p className="text-lg font-bold">Loading Module C - CBSE Board Preparation Portal...</p>
      </div>
    );
  }

  if (activeTab === "study") {
    return (
      <CBSEStudyReader
        notes={notes}
        selectedSubject={selectedSubject}
        onBack={() => setActiveTab("hub")}
      />
    );
  }

  if (activeTab === "exam") {
    return (
      <CBSEExamEngine
        initialSubject={selectedSubject}
        boardSeriesList={meta?.boardSeriesList || []}
        onBack={() => setActiveTab("hub")}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 fade-in">
      {/* Hero Banner */}
      <div className="parchment-card p-6 md:p-8 rounded-2xl border border-gold/40 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gold/10 to-maroon/10 rounded-full blur-2xl -z-10" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-maroon/10 text-maroon rounded-full text-xs font-bold font-serif mb-3 border border-maroon/20">
              Module C • CBSE Class X
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-maroon mb-2">
              CBSE Board Preparation Portal
            </h1>
            <p className="text-sm text-ink-light leading-relaxed font-serif">
              Comprehensive Class X Study Notes, Step-by-Step Textbook Q&A, Chapter Practice Drills, and Official Board Paper Simulator based on 62 real CBSE board sets.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("study")}
              className="btn-gold px-5 py-3 rounded-xl font-serif text-xs md:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              📖 Study Notes & Solutions
            </button>
            <button
              onClick={() => setActiveTab("exam")}
              className="btn-maroon px-5 py-3 rounded-xl font-serif text-xs md:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              🎯 Board Exam Simulator
            </button>
          </div>
        </div>

        {/* Global Statistics Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gold/30">
          <div className="text-center p-3 rounded-lg bg-parchment-dark/60 border border-gold/20">
            <div className="text-2xl font-serif font-bold text-maroon">{meta?.totalNotesBooks || 5}</div>
            <div className="text-xs text-ink-light font-serif">Master Study Guides</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-parchment-dark/60 border border-gold/20">
            <div className="text-2xl font-serif font-bold text-maroon">{meta?.totalSampleMCQs || 470}</div>
            <div className="text-xs text-ink-light font-serif">Sample Drill MCQs</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-parchment-dark/60 border border-gold/20">
            <div className="text-2xl font-serif font-bold text-maroon">{meta?.totalBoardMCQs || 304}</div>
            <div className="text-xs text-ink-light font-serif">Extracted Board MCQs</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-parchment-dark/60 border border-gold/20">
            <div className="text-2xl font-serif font-bold text-gold">{meta?.boardSeriesList?.length || 62}</div>
            <div className="text-xs text-ink-light font-serif">Official Board Paper Sets</div>
          </div>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-serif font-bold text-maroon">Subject Selection</h2>

        <div className="flex gap-2 bg-parchment-dark p-1 rounded-xl border border-gold/30">
          {["All", "English", "Mathematics", "Science", "Computer"].map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-4 py-1.5 rounded-lg text-xs font-serif transition-all ${
                selectedSubject === subj
                  ? "bg-maroon text-white font-bold shadow-sm"
                  : "text-ink hover:text-maroon"
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Grid Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Subject Card 1: English */}
        {(selectedSubject === "All" || selectedSubject === "English") && (
          <div className="parchment-card p-6 rounded-xl border border-gold/30 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold font-serif">
                  English Language & Literature
                </span>
                <span className="text-xs text-ink-light font-serif">Class X</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-maroon mb-2">
                English (First Flight & Footprints)
              </h3>
              <p className="text-xs text-ink-light mb-4 font-serif leading-relaxed">
                First Flight (Prose & Poems), Footprints Without Feet, and Words & Expressions 2 Workbook Solutions.
              </p>
              <div className="text-xs text-ink font-serif space-y-1 mb-4">
                <div>📚 <strong>3 Books</strong> • Prose, Poems & Grammar</div>
                <div>📝 <strong>150 Sample MCQs</strong> + Board Passages</div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gold/20">
              <button
                onClick={() => {
                  setSelectedSubject("English");
                  setActiveTab("study");
                }}
                className="flex-1 btn-gold py-2 rounded-lg text-xs font-serif font-bold"
              >
                Read Notes & Q&A
              </button>
              <button
                onClick={() => {
                  setSelectedSubject("English");
                  setActiveTab("exam");
                }}
                className="flex-1 btn-maroon py-2 rounded-lg text-xs font-serif font-bold"
              >
                Practice Exam
              </button>
            </div>
          </div>
        )}

        {/* Subject Card 2: Mathematics */}
        {(selectedSubject === "All" || selectedSubject === "Mathematics") && (
          <div className="parchment-card p-6 rounded-xl border border-gold/30 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-serif">
                  Mathematics (Basic & Standard)
                </span>
                <span className="text-xs text-ink-light font-serif">Class X</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-maroon mb-2">
                Mathematics Complete Guide
              </h3>
              <p className="text-xs text-ink-light mb-4 font-serif leading-relaxed">
                14 Chapters: Class IX Prerequisite Foundations, Class X Core Theorems, Formulas & Step-by-Step Solutions.
              </p>
              <div className="text-xs text-ink font-serif space-y-1 mb-4">
                <div>📚 <strong>14 Chapters</strong> • Algebra, Geometry, Trig</div>
                <div>📝 <strong>200 Sample MCQs</strong> + 156 Board MCQs</div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gold/20">
              <button
                onClick={() => {
                  setSelectedSubject("Mathematics");
                  setActiveTab("study");
                }}
                className="flex-1 btn-gold py-2 rounded-lg text-xs font-serif font-bold"
              >
                Read Notes & Q&A
              </button>
              <button
                onClick={() => {
                  setSelectedSubject("Mathematics");
                  setActiveTab("exam");
                }}
                className="flex-1 btn-maroon py-2 rounded-lg text-xs font-serif font-bold"
              >
                Practice Exam
              </button>
            </div>
          </div>
        )}

        {/* Subject Card 3: Science */}
        {(selectedSubject === "All" || selectedSubject === "Science") && (
          <div className="parchment-card p-6 rounded-xl border border-gold/30 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-serif">
                  Science (Physics, Chemistry, Bio)
                </span>
                <span className="text-xs text-ink-light font-serif">Class X</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-maroon mb-2">
                Science Complete Guide
              </h3>
              <p className="text-xs text-ink-light mb-4 font-serif leading-relaxed">
                13 Chapters: Chemical Reactions, Acids/Bases, Life Processes, Heredity, Light, Electricity & Environment.
              </p>
              <div className="text-xs text-ink font-serif space-y-1 mb-4">
                <div>📚 <strong>13 Chapters</strong> • Core Explanations & Q&A</div>
                <div>📝 <strong>120 Sample MCQs</strong> + 97 Board MCQs</div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gold/20">
              <button
                onClick={() => {
                  setSelectedSubject("Science");
                  setActiveTab("study");
                }}
                className="flex-1 btn-gold py-2 rounded-lg text-xs font-serif font-bold"
              >
                Read Notes & Q&A
              </button>
              <button
                onClick={() => {
                  setSelectedSubject("Science");
                  setActiveTab("exam");
                }}
                className="flex-1 btn-maroon py-2 rounded-lg text-xs font-serif font-bold"
              >
                Practice Exam
              </button>
            </div>
          </div>
        )}

        {/* Subject Card 4: Computer Applications & AI */}
        {(selectedSubject === "All" || selectedSubject === "Computer") && (
          <div className="parchment-card p-6 rounded-xl border border-gold/30 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-bold font-serif">
                  Computer Applications & AI
                </span>
                <span className="text-xs text-ink-light font-serif">Class X</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-maroon mb-2">
                Computer Applications & IT
              </h3>
              <p className="text-xs text-ink-light mb-4 font-serif leading-relaxed">
                HTML, Networking Protocols, Cyber Ethics, Artificial Intelligence & IT Board Exam Paper sets.
              </p>
              <div className="text-xs text-ink font-serif space-y-1 mb-4">
                <div>💻 <strong>Networking & HTML</strong> • Cyber Ethics & AI</div>
                <div>📝 <strong>45 Extracted Board MCQs</strong> across 7 Sets</div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gold/20">
              <button
                onClick={() => {
                  setSelectedSubject("Computer");
                  setActiveTab("exam");
                }}
                className="w-full btn-maroon py-2 rounded-lg text-xs font-serif font-bold"
              >
                Practice Board Exam
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
