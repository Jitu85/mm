"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import QuizHub, { QuizConfig } from "@/components/qa/QuizHub";
import ActiveQuiz from "@/components/qa/ActiveQuiz";
import QuizResults from "@/components/qa/QuizResults";
import CBSEModuleHub from "@/components/cbse/CBSEModuleHub";
import { QASubjectMeta, QAItem, getQASubjects, getAllQAItems, getFilteredQAItems } from "@/lib/qa-data";

export default function ModuleClient({ id: rawId }: { id: string }) {
  const router = useRouter();
  const id = (rawId || "B").toUpperCase();

  const [viewState, setViewState] = useState<"hub" | "active" | "results">("hub");
  const [subjects, setSubjects] = useState<QASubjectMeta[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Active quiz state
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<QAItem[]>([]);
  const [quizResults, setQuizResults] = useState<any>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
      return;
    }

    if (id === "B") {
      setSubjects(getQASubjects());
      setTotalQuestions(getAllQAItems().length);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id, router]);

  const handleStartQuiz = async (config: QuizConfig) => {
    setLoading(true);
    setQuizConfig(config);

    try {
      const qList = getFilteredQAItems({
        subject: config.subject,
        limit: config.questionCount,
        shuffle: true,
      });

      setQuestions(qList);
      setViewState("active");
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (results: any) => {
    setQuizResults(results);
    setViewState("results");
  };

  const handleRestart = () => {
    setViewState("hub");
    setQuizConfig(null);
    setQuizResults(null);
  };

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center font-serif text-maroon">
        <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
        <p className="text-lg font-bold">Loading Arena...</p>
      </div>
    );
  }

  // Handle Module C ("CBSE Board Preparation")
  if (id === "C") {
    return <CBSEModuleHub />;
  }

  // Handle Module B ("Questions & Answers")
  if (id === "B") {
    if (viewState === "hub") {
      return (
        <QuizHub
          subjects={subjects}
          totalQuestions={totalQuestions}
          onStartQuiz={handleStartQuiz}
        />
      );
    }

    if (viewState === "active" && quizConfig && questions.length > 0) {
      return (
        <ActiveQuiz
          config={quizConfig}
          questions={questions}
          onComplete={handleQuizComplete}
          onQuit={handleRestart}
        />
      );
    }

    if (viewState === "results" && quizConfig && quizResults) {
      return (
        <QuizResults
          config={quizConfig}
          questions={questions}
          results={quizResults}
          onRestart={handleRestart}
          onGoHome={handleGoHome}
        />
      );
    }
  }

  // Placeholder for Module C or others
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 fade-in text-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-700 to-maroon flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl font-serif font-bold text-white">{id}</span>
      </div>
      <h1 className="text-3xl font-serif font-bold text-maroon mb-4">
        Content for Module {id}
      </h1>
      <hr className="double-rule max-w-xs mx-auto mb-6" />
      <p className="text-lg text-ink-light mb-8">
        Content for Module {id} is coming soon.
      </p>
      <Link
        href="/dashboard"
        className="btn-maroon inline-block px-6 py-3 rounded-lg font-serif font-semibold"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
