"use client";

import React, { useState, useEffect } from "react";
import { QAItem } from "@/lib/qa-data";
import { QuizConfig } from "./QuizHub";

interface UserAnswer {
  questionId: string;
  selected: string;
  isCorrect: boolean;
  correctAnswer: string;
  timeSpent: number;
}

interface QuizResultsProps {
  config: QuizConfig;
  questions: QAItem[];
  results: {
    score: number;
    totalQuestions: number;
    correctCount: number;
    streakMax: number;
    answers: UserAnswer[];
    timeTakenTotal: number;
  };
  onRestart: () => void;
  onGoHome: () => void;
}

export default function QuizResults({
  config,
  questions,
  results,
  onRestart,
  onGoHome,
}: QuizResultsProps) {
  const [filterMode, setFilterMode] = useState<"all" | "incorrect">("all");

  const accuracy = Math.round((results.correctCount / results.totalQuestions) * 100);

  // Determine Rank Badge
  let rankTitle = "Knowledge Apprentice";
  let rankIcon = "📘";
  let rankColor = "text-amber-800";

  if (accuracy >= 90) {
    rankTitle = "Grandmaster Scholar";
    rankIcon = "🏆";
    rankColor = "text-amber-600 font-extrabold";
  } else if (accuracy >= 75) {
    rankTitle = "Quiz Champion";
    rankIcon = "🌟";
    rankColor = "text-maroon font-bold";
  } else if (accuracy >= 50) {
    rankTitle = "Keen Explorer";
    rankIcon = "🔍";
    rankColor = "text-emerald-800 font-semibold";
  }

  // Save to high score in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vc_qa_high_scores") || "[]";
      const scores = JSON.parse(saved);
      const newRecord = {
        date: new Date().toLocaleDateString(),
        subject: config.subject,
        mode: config.mode,
        score: results.score,
        accuracy,
        timeTaken: results.timeTakenTotal,
      };
      scores.unshift(newRecord);
      localStorage.setItem("vc_qa_high_scores", JSON.stringify(scores.slice(0, 10)));
    } catch (e) {
      console.error(e);
    }
  }, [config, results, accuracy]);

  const questionsMap = new Map(questions.map((q) => [q.id, q]));

  const filteredAnswers = results.answers.filter((ans) => {
    if (filterMode === "incorrect") return !ans.isCorrect;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 fade-in">
      {/* Scorecard Hero */}
      <div className="parchment-card p-8 rounded-2xl shadow-lg border border-maroon/30 text-center mb-8 relative overflow-hidden">
        <div className="text-5xl mb-3">{rankIcon}</div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-maroon mb-1">
          Quiz Completed!
        </h1>

        <div className={`text-lg font-serif mb-4 ${rankColor}`}>
          Title Awarded: {rankTitle}
        </div>

        <hr className="double-rule max-w-sm mx-auto mb-6" />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 font-serif">
          <div className="bg-amber-100/70 p-4 rounded-xl border border-amber-300">
            <div className="text-2xl font-bold text-maroon">{results.score}</div>
            <div className="text-xs text-ink-light font-semibold">Total Score (pts)</div>
          </div>

          <div className="bg-amber-100/70 p-4 rounded-xl border border-amber-300">
            <div className="text-2xl font-bold text-emerald-800">{accuracy}%</div>
            <div className="text-xs text-ink-light font-semibold">
              Accuracy ({results.correctCount}/{results.totalQuestions})
            </div>
          </div>

          <div className="bg-amber-100/70 p-4 rounded-xl border border-amber-300">
            <div className="text-2xl font-bold text-amber-900">{results.streakMax} 🔥</div>
            <div className="text-xs text-ink-light font-semibold">Best Streak</div>
          </div>

          <div className="bg-amber-100/70 p-4 rounded-xl border border-amber-300">
            <div className="text-2xl font-bold text-maroon">{results.timeTakenTotal}s</div>
            <div className="text-xs text-ink-light font-semibold">Total Time</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onRestart}
            className="btn-maroon px-6 py-3 rounded-xl font-serif font-bold text-sm shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            🔄 Try Another Quiz
          </button>

          <button
            onClick={onGoHome}
            className="px-6 py-3 rounded-xl font-serif font-bold text-sm bg-amber-100 text-maroon border border-maroon/30 hover:bg-amber-200 transition-all cursor-pointer"
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>

      {/* Answer Breakdown & Review */}
      <div className="parchment-card p-6 rounded-2xl border border-maroon/20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-serif font-bold text-maroon flex items-center gap-2">
            📝 Question Review & Explanations
          </h2>

          <div className="flex gap-2 text-xs font-serif font-bold">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterMode === "all"
                  ? "bg-maroon text-white border-maroon"
                  : "bg-amber-100/50 text-maroon hover:bg-amber-200/60"
              }`}
            >
              All ({results.answers.length})
            </button>
            <button
              onClick={() => setFilterMode("incorrect")}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterMode === "incorrect"
                  ? "bg-red-700 text-white border-red-700"
                  : "bg-amber-100/50 text-maroon hover:bg-amber-200/60"
              }`}
            >
              Missed ({results.answers.filter((a) => !a.isCorrect).length})
            </button>
          </div>
        </div>

        {filteredAnswers.length === 0 ? (
          <div className="text-center py-8 text-ink-light italic font-serif">
            No questions match this filter! Excellent job!
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnswers.map((ans, idx) => {
              const q = questionsMap.get(ans.questionId);
              if (!q) return null;

              return (
                <div
                  key={ans.questionId + idx}
                  className={`p-4 rounded-xl border font-serif text-xs md:text-sm ${
                    ans.isCorrect
                      ? "bg-emerald-50/60 border-emerald-300 text-emerald-900"
                      : "bg-red-50/60 border-red-300 text-red-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2 font-bold">
                    <span>
                      Q{idx + 1}. {q.question}
                    </span>
                    <span className="shrink-0 text-sm">
                      {ans.isCorrect ? "✅ Correct" : "❌ Incorrect"}
                    </span>
                  </div>

                  <div className="space-y-1 mb-3 text-xs">
                    <div>
                      <span className="font-bold">Your Choice:</span>{" "}
                      <span className={ans.isCorrect ? "font-bold text-emerald-800" : "font-bold text-red-700"}>
                        {ans.selected}
                      </span>
                    </div>
                    {!ans.isCorrect && (
                      <div>
                        <span className="font-bold">Correct Answer:</span>{" "}
                        <span className="font-bold text-emerald-800">{q.answer}</span>
                      </div>
                    )}
                  </div>

                  {q.explanation && (
                    <div className="p-3 rounded-lg bg-white/80 border border-amber-200 text-ink text-xs leading-relaxed">
                      <span className="font-bold text-maroon">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
