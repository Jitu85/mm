"use client";

import React, { useState, useEffect, useRef } from "react";
import { QAItem } from "@/lib/qa-data";
import { QuizConfig } from "./QuizHub";

interface UserAnswer {
  questionId: string;
  selected: string;
  isCorrect: boolean;
  correctAnswer: string;
  timeSpent: number;
}

interface ActiveQuizProps {
  config: QuizConfig;
  questions: QAItem[];
  onComplete: (results: {
    score: number;
    totalQuestions: number;
    correctCount: number;
    streakMax: number;
    answers: UserAnswer[];
    timeTakenTotal: number;
  }) => void;
  onQuit: () => void;
}

export default function ActiveQuiz({ config, questions, onComplete, onQuit }: ActiveQuizProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [streakMax, setStreakMax] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Timer state
  const isTimed = config.mode !== "practice";
  const [timeLeft, setTimeLeft] = useState<number>(config.timePerQuestion);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const totalStartTimeRef = useRef<number>(Date.now());

  const currentQuestion = questions[currentIndex];

  // Start timer on question change
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowExplanation(false);
    setTimeLeft(config.timePerQuestion);
    startTimeRef.current = Date.now();

    if (isTimed) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, config.mode, config.timePerQuestion]);

  const handleTimeout = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    setSelectedOption("");
    setStreak(0);

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selected: "Time Expired",
      isCorrect: false,
      correctAnswer: currentQuestion.answer,
      timeSpent,
    };
    setUserAnswers((prev) => [...prev, newAnswer]);
    setShowExplanation(true);
  };

  const normalizeText = (txt: string) => txt.trim().toLowerCase();

  const handleOptionClick = (optionText: string) => {
    if (isSubmitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(optionText);
    setIsSubmitted(true);

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const isCorrect = normalizeText(optionText) === normalizeText(currentQuestion.answer);

    let earnedScore = 0;
    let newStreak = streak;

    if (isCorrect) {
      newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > streakMax) setStreakMax(newStreak);

      const baseScore = 10;
      const streakBonus = (newStreak - 1) * 5;
      const speedBonus = isTimed ? Math.max(0, Math.floor(timeLeft / 3)) : 0;
      earnedScore = baseScore + streakBonus + speedBonus;

      setScore((prev) => prev + earnedScore);
    } else {
      setStreak(0);
    }

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selected: optionText,
      isCorrect,
      correctAnswer: currentQuestion.answer,
      timeSpent,
    };
    setUserAnswers((prev) => [...prev, newAnswer]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const totalTimeTaken = Math.round((Date.now() - totalStartTimeRef.current) / 1000);
    const correctCount = userAnswers.filter((a) => a.isCorrect).length;

    onComplete({
      score,
      totalQuestions: questions.length,
      correctCount,
      streakMax,
      answers: userAnswers,
      timeTakenTotal: totalTimeTaken,
    });
  };

  const optionLabels = ["A", "B", "C", "D"];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 fade-in">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4 parchment-card p-4 rounded-xl border border-maroon/20">
        <button
          onClick={onQuit}
          className="text-xs font-serif text-maroon hover:underline flex items-center gap-1 font-bold"
        >
          ← Exit Quiz
        </button>

        <div className="flex items-center gap-4 text-xs font-serif font-bold text-maroon">
          {streak > 1 && (
            <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300 animate-pulse">
              🔥 {streak}x Streak!
            </span>
          )}
          <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300">
            ⭐ Score: {score} pts
          </span>
        </div>
      </div>

      {/* Progress Bar & Timer */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-serif text-maroon font-bold mb-1">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          {isTimed && (
            <span className={`px-2 py-0.5 rounded font-mono font-bold ${
              timeLeft <= 5 ? "bg-red-600 text-white animate-bounce" : "text-maroon"
            }`}>
              ⏱️ {timeLeft}s
            </span>
          )}
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-amber-100/60 rounded-full h-3 overflow-hidden border border-amber-300/60">
          <div
            className="bg-gradient-to-r from-amber-700 to-maroon h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Ticking Timer Bar for Timed Mode */}
        {isTimed && (
          <div className="w-full bg-red-100 rounded-full h-1 mt-1 overflow-hidden">
            <div
              className="bg-red-500 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / config.timePerQuestion) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Main Question Card */}
      <div className="parchment-card p-6 md:p-8 rounded-2xl shadow-md border border-maroon/20 mb-6 relative">
        {/* Subject & Series Tag */}
        <div className="flex justify-between items-center mb-4">
          <span className="bg-maroon text-gold-light text-xs font-serif font-bold px-3 py-1 rounded-full shadow-sm">
            {currentQuestion.subject}
          </span>
          {currentQuestion.series && (
            <span className="text-xs text-ink-light font-mono font-semibold">
              Code: {currentQuestion.series}
            </span>
          )}
        </div>

        {/* Question Text */}
        <h2 className="text-lg md:text-xl font-serif font-bold text-maroon mb-6 leading-snug">
          {currentQuestion.question}
        </h2>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((opt, idx) => {
            const label = optionLabels[idx] || `${idx + 1}`;
            const isSelected = selectedOption === opt;
            const isCorrectAnswer = normalizeText(opt) === normalizeText(currentQuestion.answer);

            let buttonStyle = "parchment-card hover:bg-amber-100/60 text-ink border-maroon/20 hover:border-maroon/50";
            let badgeStyle = "bg-maroon/10 text-maroon";

            if (isSubmitted) {
              if (isCorrectAnswer) {
                buttonStyle = "bg-emerald-700 text-white border-emerald-800 shadow-md font-bold";
                badgeStyle = "bg-emerald-900 text-emerald-100";
              } else if (isSelected && !isCorrectAnswer) {
                buttonStyle = "bg-red-700 text-white border-red-800 shadow-md font-bold";
                badgeStyle = "bg-red-900 text-red-100";
              } else {
                buttonStyle = "opacity-50 parchment-card text-ink-light border-gray-300";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isSubmitted}
                onClick={() => handleOptionClick(opt)}
                className={`w-full text-left p-4 rounded-xl border flex items-start gap-4 transition-all duration-200 cursor-pointer ${buttonStyle}`}
              >
                <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-serif text-xs font-bold ${badgeStyle}`}>
                  {label}
                </span>
                <span className="font-serif text-sm md:text-base leading-relaxed pt-0.5">
                  {opt}
                </span>
                {isSubmitted && isCorrectAnswer && (
                  <span className="ml-auto text-lg">✅</span>
                )}
                {isSubmitted && isSelected && !isCorrectAnswer && (
                  <span className="ml-auto text-lg">❌</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Step-by-Step Explanation Accordion */}
        {isSubmitted && currentQuestion.explanation && (
          <div className="mt-6 border-t border-maroon/20 pt-4 fade-in">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs font-serif font-bold text-maroon hover:underline flex items-center gap-1 mb-2"
            >
              <span>{showExplanation ? "📖 Hide Explanation" : "💡 View Explanation & Logic"}</span>
            </button>

            {showExplanation && (
              <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-ink text-xs md:text-sm font-serif leading-relaxed">
                <div className="font-bold text-maroon mb-1 flex items-center gap-1">
                  🔍 Concept Explanation:
                </div>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Next Question / Finish Action */}
      {isSubmitted && (
        <div className="text-center fade-in">
          <button
            type="button"
            onClick={handleNextQuestion}
            className="btn-maroon text-base px-8 py-3 rounded-xl font-serif font-bold shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>
              {currentIndex + 1 < questions.length ? "Next Question →" : "See Final Scorecard 🏆"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
