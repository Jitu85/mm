"use client";

import React, { useState, useEffect } from "react";
import { QASubjectMeta } from "@/lib/qa-data";

export interface QuizConfig {
  subject: string;
  mode: "practice" | "timeAttack" | "exam";
  questionCount: number;
  timePerQuestion: number; // in seconds
}

interface QuizHubProps {
  subjects: QASubjectMeta[];
  totalQuestions: number;
  onStartQuiz: (config: QuizConfig) => void;
}

export default function QuizHub({ subjects, totalQuestions, onStartQuiz }: QuizHubProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [mode, setMode] = useState<"practice" | "timeAttack" | "exam">("practice");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(30);
  const [highScores, setHighScores] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vc_qa_high_scores");
      if (saved) {
        setHighScores(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleStart = () => {
    onStartQuiz({
      subject: selectedSubject,
      mode,
      questionCount,
      timePerQuestion,
    });
  };

  const getSubjectCount = (subjName: string) => {
    if (subjName === "All") return totalQuestions;
    const found = subjects.find((s) => s.subject === subjName);
    return found ? found.count : 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-in">
      {/* Header Banner */}
      <div className="text-center mb-8 parchment-card p-6 rounded-2xl shadow-sm border border-maroon/20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-maroon text-gold-light text-2xl font-bold mb-3 shadow-inner">
          💡
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-maroon mb-2">
          Questions & Answers
        </h1>
        <p className="text-ink-light italic text-base md:text-lg max-w-2xl mx-auto font-serif">
          &ldquo;A place to test your skills and knowledge in Science, Mathematics and Computer.&rdquo;
        </p>
        <hr className="double-rule max-w-md mx-auto my-4" />
        <div className="flex flex-wrap justify-center gap-4 text-xs font-serif text-maroon font-semibold">
          <span className="bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            📊 {totalQuestions} Total Questions
          </span>
          <span className="bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            🎯 4 Knowledge Domains
          </span>
          <span className="bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            ⚡ Interactive Speed & Practice Modes
          </span>
        </div>
      </div>

      {/* Step 1: Select Subject */}
      <div className="mb-8">
        <h2 className="text-xl font-serif font-bold text-maroon mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-maroon text-white text-sm">1</span>
          Select Subject Domain
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => setSelectedSubject("All")}
            className={`p-4 rounded-xl border text-left transition-all font-serif cursor-pointer ${
              selectedSubject === "All"
                ? "bg-maroon text-white border-maroon shadow-md scale-102"
                : "parchment-card text-ink hover:border-maroon/50"
            }`}
          >
            <div className="text-2xl mb-1">🌐</div>
            <div className="font-bold text-sm">All Subjects</div>
            <div className={`text-xs mt-1 ${selectedSubject === "All" ? "text-amber-200" : "text-ink-light"}`}>
              {totalQuestions} Questions
            </div>
          </button>

          {subjects.map((subj) => (
            <button
              key={subj.subject}
              type="button"
              onClick={() => setSelectedSubject(subj.subject)}
              className={`p-4 rounded-xl border text-left transition-all font-serif cursor-pointer ${
                selectedSubject === subj.subject
                  ? "bg-maroon text-white border-maroon shadow-md scale-102"
                  : "parchment-card text-ink hover:border-maroon/50"
              }`}
            >
              <div className="text-2xl mb-1">{subj.icon}</div>
              <div className="font-bold text-sm leading-tight">{subj.subject}</div>
              <div className={`text-xs mt-1 ${selectedSubject === subj.subject ? "text-amber-200" : "text-ink-light"}`}>
                {subj.count} Questions
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Select Mode */}
      <div className="mb-8">
        <h2 className="text-xl font-serif font-bold text-maroon mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-maroon text-white text-sm">2</span>
          Choose Interactive Challenge Mode
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Practice Mode */}
          <div
            onClick={() => setMode("practice")}
            className={`p-5 rounded-xl border cursor-pointer transition-all parchment-card ${
              mode === "practice"
                ? "ring-2 ring-maroon border-maroon bg-amber-50/80 shadow-md"
                : "hover:border-maroon/40"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="font-serif font-bold text-maroon text-lg">Practice Mode</h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                  Untimed & Relaxed
                </span>
              </div>
            </div>
            <p className="text-xs text-ink-light leading-relaxed mt-2">
              Instant answer feedback with step-by-step explanations after every question. Ideal for learning and conceptual clarity.
            </p>
          </div>

          {/* Time Attack Mode */}
          <div
            onClick={() => setMode("timeAttack")}
            className={`p-5 rounded-xl border cursor-pointer transition-all parchment-card ${
              mode === "timeAttack"
                ? "ring-2 ring-maroon border-maroon bg-amber-50/80 shadow-md"
                : "hover:border-maroon/40"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⚡</span>
              <div>
                <h3 className="font-serif font-bold text-maroon text-lg">Time Attack</h3>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                  Fast & Ticking
                </span>
              </div>
            </div>
            <p className="text-xs text-ink-light leading-relaxed mt-2">
              Race against a ticking timer per question! Build consecutive streak multipliers and earn speed bonus points.
            </p>
          </div>

          {/* Challenge Exam Mode */}
          <div
            onClick={() => setMode("exam")}
            className={`p-5 rounded-xl border cursor-pointer transition-all parchment-card ${
              mode === "exam"
                ? "ring-2 ring-maroon border-maroon bg-amber-50/80 shadow-md"
                : "hover:border-maroon/40"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏆</span>
              <div>
                <h3 className="font-serif font-bold text-maroon text-lg">Challenge Exam</h3>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-semibold">
                  Real Exam Simulation
                </span>
              </div>
            </div>
            <p className="text-xs text-ink-light leading-relaxed mt-2">
              Simulates a formal test with score evaluation, accuracy grade, subject breakdown, and performance title awards.
            </p>
          </div>
        </div>
      </div>

      {/* Step 3: Customize Options */}
      <div className="mb-8 parchment-card p-6 rounded-xl border border-maroon/20">
        <h2 className="text-lg font-serif font-bold text-maroon mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-maroon text-white text-xs">3</span>
          Configure Options
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Question Count */}
          <div>
            <label className="block text-xs font-serif font-bold text-maroon mb-2">
              Number of Questions ({getSubjectCount(selectedSubject)} available)
            </label>
            <div className="flex gap-2">
              {[10, 20, 50, Math.min(100, getSubjectCount(selectedSubject))].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`px-4 py-2 rounded-lg text-xs font-serif font-bold transition-all ${
                    questionCount === cnt
                      ? "bg-maroon text-white"
                      : "bg-amber-100/60 text-maroon hover:bg-amber-200/80"
                  }`}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Time Per Question (if Timed Mode) */}
          {mode !== "practice" && (
            <div>
              <label className="block text-xs font-serif font-bold text-maroon mb-2">
                Timer Limit per Question
              </label>
              <div className="flex gap-2">
                {[15, 30, 45, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setTimePerQuestion(sec)}
                    className={`px-4 py-2 rounded-lg text-xs font-serif font-bold transition-all ${
                      timePerQuestion === sec
                        ? "bg-maroon text-white"
                        : "bg-amber-100/60 text-maroon hover:bg-amber-200/80"
                    }`}
                  >
                    ⏱️ {sec}s
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center mb-8">
        <button
          type="button"
          onClick={handleStart}
          className="btn-maroon text-lg px-10 py-4 rounded-xl font-serif font-bold shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 cursor-pointer"
        >
          <span>🚀</span> Start Interactive Quiz ({questionCount} Questions)
        </button>
      </div>

      {/* Recent High Scores */}
      {highScores.length > 0 && (
        <div className="parchment-card p-6 rounded-xl border border-maroon/20">
          <h3 className="font-serif font-bold text-maroon text-base mb-3 flex items-center gap-2">
            🥇 Recent Achievements & High Scores
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-serif">
              <thead>
                <tr className="border-b border-maroon/20 text-maroon font-bold">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Subject</th>
                  <th className="pb-2">Mode</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maroon/10">
                {highScores.slice(0, 5).map((score: any, idx: number) => (
                  <tr key={idx} className="hover:bg-amber-50/50">
                    <td className="py-2 text-ink-light">{score.date}</td>
                    <td className="py-2 font-bold text-maroon">{score.subject}</td>
                    <td className="py-2 capitalize">{score.mode}</td>
                    <td className="py-2 font-bold text-emerald-700">{score.score} pts</td>
                    <td className="py-2 font-bold">{score.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
