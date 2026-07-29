"use client";

import { useState, useEffect } from "react";
import { CBSEMCQItem, getModuleCMCQs } from "@/lib/module-c-data";

interface CBSEExamEngineProps {
  initialSubject: string;
  boardSeriesList: string[];
  onBack: () => void;
}

export default function CBSEExamEngine({
  initialSubject,
  boardSeriesList,
  onBack,
}: CBSEExamEngineProps) {
  // Config state
  const [subject, setSubject] = useState<string>(initialSubject || "All");
  const [mode, setMode] = useState<"board" | "sample" | "all">("board");
  const [selectedSeries, setSelectedSeries] = useState<string>("All");
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);

  // Active Test State
  const [questions, setQuestions] = useState<CBSEMCQItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Filter series options based on selected subject
  const filteredSeriesList = boardSeriesList.filter((s) => {
    if (subject === "All") return true;
    if (subject === "Mathematics" && (s.includes("Mathematics") || s.includes("1158") || s.includes("1159") || s.includes("1171") || s.includes("1164") || s.includes("1167"))) return true;
    if (subject === "Science" && (s.includes("Science") || s.includes("1190") || s.includes("1191") || s.includes("31-"))) return true;
    if (subject === "Computer" && (s.includes("Computer") || s.includes("53_") || s.includes("Artificial") || s.includes("Information"))) return true;
    if (subject === "English" && (s.includes("English") || s.includes("1160") || s.includes("1161") || s.includes("2-"))) return true;
    return true;
  });

  const handleStartTest = async () => {
    setLoading(true);
    try {
      const mcqs = getModuleCMCQs({
        subject: subject === "All" ? undefined : subject,
        dataset: mode,
        series: selectedSeries === "All" ? undefined : selectedSeries,
        limit: questionCount,
        shuffle: true,
      });

      setQuestions(mcqs || []);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowExplanation({});
      setTimerSeconds(0);
      setIsCompleted(false);
      setIsTestStarted(true);
    } catch (err) {
      console.error("Failed to load test questions:", err);
    } finally {
      setLoading(false);
    }
  };


  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTestStarted && !isCompleted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestStarted, isCompleted]);

  const handleOptionSelect = (optionText: string) => {
    if (isCompleted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionText,
    }));
  };

  const toggleExplanation = (idx: number) => {
    setShowExplanation((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const currentQ = questions[currentIndex];

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx]?.trim().toLowerCase();
      const correctAns = q.answer.trim().toLowerCase();
      
      // Match option string or letter
      if (userAns && (userAns === correctAns || userAns.includes(correctAns) || correctAns.includes(userAns))) {
        score += 1;
      }
    });
    return score;
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Setup View
  if (!isTestStarted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 fade-in">
        <button
          onClick={onBack}
          className="text-xs font-bold text-maroon hover:text-amber-800 uppercase tracking-wider mb-4 flex items-center gap-1"
        >
          ← Back to Module C Hub
        </button>

        <div className="parchment-card p-6 md:p-8 rounded-xl border border-gold/40 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-maroon mb-2">
              CBSE MCQ & Board Exam Simulator
            </h1>
            <p className="text-sm text-ink-light italic">
              Practice chapter-wise sample questions or simulate real CBSE Class X Board Papers
            </p>
          </div>

          <div className="space-y-6">
            {/* Mode Selector */}
            <div>
              <label className="block text-xs font-serif font-bold text-maroon uppercase tracking-wider mb-2">
                Select Exam Mode
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMode("board")}
                  className={`p-4 rounded-xl border font-serif text-left transition-all ${
                    mode === "board"
                      ? "border-maroon bg-maroon/10 shadow-md ring-2 ring-maroon/30"
                      : "border-gold/30 hover:bg-parchment-dark"
                  }`}
                >
                  <div className="font-bold text-maroon text-base mb-1">
                    🏛️ Board Exam Paper Simulator
                  </div>
                  <div className="text-xs text-ink-light">
                    304 Questions from 62 official CBSE Class X Board Paper sets
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("sample")}
                  className={`p-4 rounded-xl border font-serif text-left transition-all ${
                    mode === "sample"
                      ? "border-maroon bg-maroon/10 shadow-md ring-2 ring-maroon/30"
                      : "border-gold/30 hover:bg-parchment-dark"
                  }`}
                >
                  <div className="font-bold text-maroon text-base mb-1">
                    📚 Chapter Sample Drill
                  </div>
                  <div className="text-xs text-ink-light">
                    470 Chapter-wise textbook practice questions with explanations
                  </div>
                </button>
              </div>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-serif font-bold text-maroon uppercase tracking-wider mb-2">
                Select Subject
              </label>
              <div className="flex flex-wrap gap-2">
                {["All", "Mathematics", "Science", "Computer", "English"].map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => {
                      setSubject(subj);
                      setSelectedSeries("All");
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-serif transition-all ${
                      subject === subj
                        ? "bg-maroon text-white font-bold shadow-md"
                        : "bg-parchment-dark text-ink hover:bg-gold/20"
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Board Paper Series Filter (if in Board mode) */}
            {mode === "board" && filteredSeriesList.length > 0 && (
              <div>
                <label className="block text-xs font-serif font-bold text-maroon uppercase tracking-wider mb-2">
                  Select Board Paper Series Set ({filteredSeriesList.length} Sets)
                </label>
                <select
                  value={selectedSeries}
                  onChange={(e) => setSelectedSeries(e.target.value)}
                  className="w-full p-3 rounded-lg font-serif text-xs text-ink bg-parchment border border-gold/40"
                >
                  <option value="All">All Board Paper Series Sets</option>
                  {filteredSeriesList.map((s, idx) => (
                    <option key={idx} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Question Count Selector */}
            <div>
              <label className="block text-xs font-serif font-bold text-maroon uppercase tracking-wider mb-2">
                Number of Questions
              </label>
              <div className="flex gap-3">
                {[10, 20, 30, 50].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`px-4 py-2 rounded-lg text-xs font-serif transition-all ${
                      questionCount === cnt
                        ? "bg-gold text-white font-bold shadow-md"
                        : "bg-parchment-dark text-ink hover:bg-gold/20"
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-4">
              <button
                onClick={handleStartTest}
                disabled={loading}
                className="w-full btn-maroon py-4 rounded-xl text-base font-serif font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? "Preparing Test Paper..." : "🚀 Begin CBSE Test Simulator"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Completed Results View
  if (isCompleted) {
    const score = calculateScore();
    const pct = Math.round((score / questions.length) * 100) || 0;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 fade-in">
        <div className="parchment-card p-6 md:p-8 rounded-xl border border-gold/40 shadow-xl text-center mb-8">
          <div className="inline-block w-20 h-20 rounded-full bg-gradient-to-br from-maroon to-gold flex items-center justify-center text-3xl text-white font-bold mx-auto mb-4">
            {pct}%
          </div>
          <h2 className="text-3xl font-serif font-bold text-maroon mb-2">
            Test Performance Summary
          </h2>
          <p className="text-sm text-ink-light italic mb-6">
            Completed {questions.length} questions in {formatTimer(timerSeconds)}
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8 bg-parchment-dark p-4 rounded-xl border border-gold/30">
            <div>
              <div className="text-2xl font-bold text-maroon">{score}</div>
              <div className="text-xs text-ink-light font-serif">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-700">{questions.length - score}</div>
              <div className="text-xs text-ink-light font-serif">Incorrect / Skipped</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">{formatTimer(timerSeconds)}</div>
              <div className="text-xs text-ink-light font-serif">Time Elapsed</div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setIsTestStarted(false);
                setIsCompleted(false);
              }}
              className="btn-gold px-6 py-3 rounded-lg font-serif text-sm font-bold"
            >
              Configure New Test
            </button>
            <button
              onClick={onBack}
              className="btn-maroon px-6 py-3 rounded-lg font-serif text-sm font-bold"
            >
              Return to Hub
            </button>
          </div>
        </div>

        {/* Question by Question Review */}
        <h3 className="text-xl font-serif font-bold text-maroon mb-4">
          Detailed Question Review ({questions.length})
        </h3>
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userAns = selectedAnswers[idx] || "Not Answered";
            const isCorrect =
              userAns !== "Not Answered" &&
              (userAns.trim().toLowerCase() === q.answer.trim().toLowerCase() ||
                userAns.toLowerCase().includes(q.answer.toLowerCase()));

            return (
              <div
                key={idx}
                className={`parchment-card p-5 rounded-xl border ${
                  isCorrect ? "border-green-600/40 bg-green-50/20" : "border-red-600/40 bg-red-50/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-maroon uppercase tracking-wider">
                    Question {idx + 1} • {q.subject} ({q.series})
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-ink mb-3 font-serif leading-relaxed">
                  {q.question}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, oidx) => (
                    <div
                      key={oidx}
                      className={`p-2.5 rounded-lg text-xs font-serif border ${
                        opt === q.answer
                          ? "border-green-600 bg-green-100 text-green-900 font-bold"
                          : opt === userAns
                          ? "border-red-500 bg-red-100 text-red-900"
                          : "border-gold/20 bg-parchment-dark text-ink"
                      }`}
                    >
                      <span className="font-bold mr-1.5">{String.fromCharCode(65 + oidx)}.</span>
                      {opt}
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <div className="bg-gold/10 p-3 rounded-lg border border-gold/30 text-xs text-ink-light font-serif">
                    💡 <span className="font-bold text-maroon">Explanation:</span> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Test Interface
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 fade-in">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gold/30">
        <div>
          <span className="text-xs font-bold text-maroon uppercase tracking-wide">
            CBSE {mode === "board" ? "Board Exam Paper" : "Sample Drill"} • {currentQ?.subject}
          </span>
          <h2 className="text-base font-serif font-bold text-ink">
            Question {currentIndex + 1} of {questions.length}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-parchment-dark px-3 py-1.5 rounded-lg border border-gold/40 text-xs font-mono font-bold text-maroon">
            ⏱️ {formatTimer(timerSeconds)}
          </div>
          <button
            onClick={() => setIsCompleted(true)}
            className="btn-maroon px-4 py-1.5 rounded-lg text-xs font-serif font-bold"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-parchment-dark h-2 rounded-full mb-6 overflow-hidden border border-gold/20">
        <div
          className="bg-maroon h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="parchment-card p-6 md:p-8 rounded-xl border border-gold/40 shadow-md mb-6">
          <div className="text-xs text-gold font-bold uppercase tracking-wider mb-2">
            Set / Series: {currentQ.series}
          </div>

          <h3 className="text-base md:text-lg font-serif font-bold text-ink mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, oidx) => {
              const isSelected = selectedAnswers[currentIndex] === opt;
              return (
                <button
                  key={oidx}
                  type="button"
                  onClick={() => handleOptionSelect(opt)}
                  className={`w-full p-4 rounded-xl text-left font-serif text-xs md:text-sm transition-all flex items-center gap-3 border ${
                    isSelected
                      ? "border-maroon bg-maroon text-white font-bold shadow-md"
                      : "border-gold/30 bg-parchment hover:bg-parchment-dark text-ink"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected ? "bg-white text-maroon" : "bg-gold/20 text-maroon"
                    }`}
                  >
                    {String.fromCharCode(65 + oidx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Toggle */}
          {currentQ.explanation && (
            <div>
              <button
                type="button"
                onClick={() => toggleExplanation(currentIndex)}
                className="text-xs font-serif font-bold text-maroon hover:underline mb-2 flex items-center gap-1"
              >
                {showExplanation[currentIndex] ? "🙈 Hide Explanation" : "💡 Show Explanation"}
              </button>

              {showExplanation[currentIndex] && (
                <div className="bg-gold/10 p-4 rounded-lg border border-gold/30 text-xs text-ink-light font-serif leading-relaxed fade-in">
                  <span className="font-bold text-maroon">Answer Logic:</span> {currentQ.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between items-center gap-4">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className="btn-gold px-5 py-2.5 rounded-lg text-xs font-serif font-bold disabled:opacity-40"
        >
          ← Previous
        </button>

        <div className="flex gap-1 overflow-x-auto max-w-xs py-1">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-7 h-7 rounded-md text-xs font-serif font-bold transition-all ${
                currentIndex === idx
                  ? "bg-maroon text-white ring-2 ring-gold"
                  : selectedAnswers[idx]
                  ? "bg-gold text-white"
                  : "bg-parchment-dark text-ink hover:bg-gold/20"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          disabled={currentIndex === questions.length - 1}
          onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
          className="btn-maroon px-5 py-2.5 rounded-lg text-xs font-serif font-bold disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
