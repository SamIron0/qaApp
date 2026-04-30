"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { QuizQuestion } from "@/lib/quiz-types";

type QuizClientProps = {
  questions: QuizQuestion[];
  courseName: string;
  bankName: string;
  courseId: string;
  bankId: string;
};

export function QuizClient({
  questions,
  courseName,
  bankName,
  courseId,
  bankId,
}: QuizClientProps) {
  const storagePrefix = `qaApp.${courseId}.${bankId}`;
  const storageKeyIndex = `${storagePrefix}.currentIndex`;
  const storageKeyTheme = `${storagePrefix}.theme`;

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState("1");

  const totalQuestions = questions.length;

  useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem(storageKeyTheme);
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
      }
    } catch {
      // ignore localStorage errors
    }
  }, [storageKeyTheme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKeyTheme, theme);
    } catch {
      // ignore localStorage errors
    }
  }, [theme, storageKeyTheme]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKeyIndex);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!Number.isNaN(parsed)) {
          const clamped = Math.max(0, Math.min(totalQuestions - 1, parsed));
          setIndex(clamped);
        }
      }
    } catch {
      // ignore localStorage errors
    }
  }, [storageKeyIndex, totalQuestions]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKeyIndex, String(index));
    } catch {
      // ignore localStorage errors
    }
  }, [index, storageKeyIndex]);

  useEffect(() => {
    setPageInput(String(index + 1));
  }, [index]);

  const goToQuestion = (value: string) => {
    const n = parseInt(value, 10);
    if (!Number.isNaN(n)) {
      const clamped = Math.max(1, Math.min(totalQuestions, n));
      setIndex(clamped - 1);
      setSelectedOption(null);
      setPageInput(String(clamped));
    } else {
      setPageInput(String(index + 1));
    }
  };

  const currentQuestion = useMemo(() => questions[index], [questions, index]);

  const hasAnswered = selectedOption !== null;

  const handleSelect = (optionKey: string) => {
    if (!currentQuestion) return;
    setSelectedOption(optionKey);
  };

  const handlePrev = () => {
    if (index === 0) return;
    setIndex((prev) => prev - 1);
    setSelectedOption(null);
  };

  const handleNext = () => {
    if (index === totalQuestions - 1) return;
    setIndex((prev) => prev + 1);
    setSelectedOption(null);
  };

  const isCorrectSelection =
    selectedOption && currentQuestion && currentQuestion.answerKey.includes(selectedOption);

  const correctAnswers = currentQuestion?.answerKey ?? [];

  if (!totalQuestions || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900">
        <p className="text-sm text-zinc-600">
          No questions available. Please check your questions file.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4 sm:py-10 transition-colors ${
        theme === "dark"
          ? "bg-zinc-950 text-zinc-100"
          : "bg-zinc-50 text-zinc-900"
      }`}
    >
      <main
        className={`w-full max-w-2xl max-h-full min-h-0 overflow-y-auto rounded-3xl border px-5 py-6 shadow-sm sm:px-8 sm:py-8 transition-colors ${
          theme === "dark"
            ? "border-zinc-800 bg-zinc-900/60"
            : "border-zinc-200 bg-white/80"
        }`}
      >
        <header className="mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/courses/${courseId}`}
              className={`text-xs transition-colors hover:underline ${
                theme === "dark"
                  ? "text-zinc-500 hover:text-zinc-300"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              ← Back
            </Link>
            <button
              type="button"
              onClick={() =>
                setTheme((prev) => (prev === "light" ? "dark" : "light"))
              }
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                theme === "dark"
                  ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800"
                  : "border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-zinc-300 hover:bg-zinc-100"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  theme === "dark" ? "bg-zinc-300" : "bg-zinc-900"
                }`}
              />
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </button>
          </div>

          <div className="space-y-1">
            <p
              className={`text-xs sm:text-sm ${
                theme === "dark" ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {courseName}
            </p>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              {bankName}
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-zinc-500 sm:text-sm">
              Question{" "}
              <input
                type="number"
                min={1}
                max={totalQuestions}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={(e) => goToQuestion(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToQuestion(pageInput);
                }}
                className={`w-14 rounded border px-2 py-0.5 text-center text-xs tabular-nums sm:text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                  theme === "dark"
                    ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                    : "border-zinc-300 bg-zinc-50 text-zinc-900"
                }`}
                aria-label="Question number"
              />{" "}
              of {totalQuestions}
            </p>
          </div>
        </header>

        <section className="mb-6 space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Question {currentQuestion.id}
          </p>
          <h2 className="text-base font-medium leading-relaxed sm:text-lg">
            {currentQuestion.question}
          </h2>
        </section>

        <section className="space-y-3">
          {Object.entries(currentQuestion.options)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, label]) => {
              const isSelected = selectedOption === key;
              const isCorrect = correctAnswers.includes(key);

              let optionClasses =
                "w-full rounded-2xl border px-4 py-3 text-left text-sm sm:text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/70 disabled:cursor-not-allowed";

              if (!hasAnswered) {
                optionClasses +=
                  theme === "dark"
                    ? " border-zinc-700 bg-zinc-900/80 hover:border-zinc-500 hover:bg-zinc-800"
                    : " border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50";
              } else if (isSelected && isCorrect) {
                optionClasses +=
                  theme === "dark"
                    ? " border-emerald-500 bg-emerald-900/30 text-emerald-100"
                    : " border-emerald-500 bg-emerald-50 text-emerald-900";
              } else if (isSelected && !isCorrect) {
                optionClasses +=
                  theme === "dark"
                    ? " border-rose-500 bg-rose-900/30 text-rose-100"
                    : " border-rose-500 bg-rose-50 text-rose-900";
              } else if (!isSelected && isCorrect && hasAnswered) {
                optionClasses +=
                  theme === "dark"
                    ? " border-emerald-500/70 bg-emerald-900/20"
                    : " border-emerald-400/70 bg-emerald-50/70";
              } else {
                optionClasses += " opacity-80";
              }

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelect(key)}
                  className={optionClasses}
                >
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                      {key}
                    </span>
                    <span className="flex-1 text-left">{label}</span>
                  </span>
                </button>
              );
            })}
        </section>

        {hasAnswered && (
          <section className="mt-5 rounded-2xl border px-4 py-3 text-xs sm:text-sm">
            <p className="mb-1 font-medium">
              {isCorrectSelection ? "Correct!" : "Not quite."}
            </p>
            <p className="text-zinc-500">
              Correct answer
              {correctAnswers.length > 1 ? "s" : ""}:{" "}
              {correctAnswers
                .map((key) => `${key}. ${currentQuestion.options[key]}`)
                .join(" · ")}
            </p>
          </section>
        )}

        <footer className="mt-7 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={index === 0}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              index === 0
                ? "cursor-not-allowed opacity-40"
                : theme === "dark"
                  ? "border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800"
                  : "border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50"
            }`}
          >
            <span aria-hidden="true">←</span>
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500 sm:text-sm">
            <input
              type="number"
              min={1}
              max={totalQuestions}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={(e) => goToQuestion(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToQuestion(pageInput);
              }}
              className={`w-14 rounded border px-2 py-0.5 text-center text-xs tabular-nums sm:text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                theme === "dark"
                  ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                  : "border-zinc-300 bg-zinc-50 text-zinc-900"
              }`}
              aria-label="Question number"
            />{" "}
            of {totalQuestions}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={index === totalQuestions - 1}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              index === totalQuestions - 1
                ? "cursor-not-allowed opacity-40"
                : theme === "dark"
                  ? "border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800"
                  : "border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50"
            }`}
          >
            <span>Next</span>
            <span aria-hidden="true">→</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
