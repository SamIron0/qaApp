"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { QuizQuestion } from "@/lib/quiz-types";

type Props = {
  questions: QuizQuestion[];
  courseName: string;
  bankName: string;
  courseId: string;
  bankId: string;
  /** "none" | "per_30" | "per_60" | "total_600" | "total_1200" */
  timeConfig: string;
};

type AnswerMap = Record<number, string>; // questionIndex -> selectedKey

// ─── Timer helpers ────────────────────────────────────────────────────────────

function parseTimeConfig(cfg: string): { mode: "none" | "per" | "total"; seconds: number } {
  if (cfg === "none") return { mode: "none", seconds: 0 };
  if (cfg.startsWith("per_")) return { mode: "per", seconds: parseInt(cfg.split("_")[1], 10) };
  if (cfg.startsWith("total_")) return { mode: "total", seconds: parseInt(cfg.split("_")[1], 10) };
  return { mode: "none", seconds: 0 };
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  questions,
  answers,
  courseName,
  bankName,
  courseId,
  bankId,
  timeTaken,
  theme,
}: {
  questions: QuizQuestion[];
  answers: AnswerMap;
  courseName: string;
  bankName: string;
  courseId: string;
  bankId: string;
  timeTaken: number;
  theme: "light" | "dark";
}) {
  const total = questions.length;
  const correct = questions.filter((q, i) => {
    const sel = answers[i];
    return sel !== undefined && q.answerKey.includes(sel);
  }).length;
  const unanswered = questions.filter((_, i) => answers[i] === undefined).length;
  const wrong = total - correct - unanswered;
  const pct = Math.round((correct / total) * 100);

  const grade =
    pct >= 70 ? { label: "Pass", color: "text-emerald-500" } : { label: "Fail", color: "text-rose-500" };

  const card = theme === "dark"
    ? "border-zinc-800 bg-zinc-900/60"
    : "border-zinc-200 bg-white/80";

  const subtext = theme === "dark" ? "text-zinc-400" : "text-zinc-600";

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col items-center justify-start px-4 py-8 sm:py-12 transition-colors ${
        theme === "dark" ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      <div className={`w-full max-w-2xl rounded-3xl border px-5 py-8 shadow-sm sm:px-8 ${card}`}>
        {/* Score header */}
        <div className="mb-8 text-center">
          <p className={`text-xs font-medium uppercase tracking-widest mb-1 ${subtext}`}>
            Quiz Complete
          </p>
          <div className="my-4 inline-flex flex-col items-center">
            <span className="text-7xl font-bold tabular-nums tracking-tight">{pct}%</span>
            <span className={`mt-1 text-lg font-semibold ${grade.color}`}>{grade.label}</span>
          </div>
          <p className={`text-sm ${subtext}`}>
            {correct} of {total} correct
            {timeTaken > 0 && ` · ${formatTime(timeTaken)} taken`}
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { label: "Correct", value: correct, color: "text-emerald-500" },
            { label: "Wrong", value: wrong, color: "text-rose-400" },
            { label: "Skipped", value: unanswered, color: "text-zinc-400" },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl border px-3 py-4 text-center ${
                theme === "dark" ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-zinc-50"
              }`}
            >
              <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
              <p className={`mt-0.5 text-xs ${subtext}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Question review */}
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Review</p>
          {questions.map((q, i) => {
            const sel = answers[i];
            const isCorrect = sel !== undefined && q.answerKey.includes(sel);
            const skipped = sel === undefined;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border px-4 py-3 ${
                  theme === "dark" ? "border-zinc-800 bg-zinc-900/40" : "border-zinc-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 shrink-0 text-xs font-bold ${
                      skipped
                        ? "text-zinc-400"
                        : isCorrect
                          ? "text-emerald-500"
                          : "text-rose-400"
                    }`}
                  >
                    {skipped ? "–" : isCorrect ? "✓" : "✗"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{q.question}</p>
                    {!skipped && (
                      <p
                        className={`mt-1 text-xs ${
                          isCorrect ? "text-emerald-500" : "text-rose-400"
                        }`}
                      >
                        Your answer: {sel}. {q.options[sel]}
                      </p>
                    )}
                    {(!isCorrect || skipped) && (
                      <p className="mt-0.5 text-xs text-emerald-500">
                        Correct:{" "}
                        {q.answerKey.map((k) => `${k}. ${q.options[k]}`).join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/courses/${courseId}/${bankId}/setup`}
            className="btn-auth-primary flex-1 py-2.5 text-center text-sm font-semibold"
          >
            Try Again
          </Link>
          <Link
            href={`/courses/${courseId}`}
            className={`flex-1 rounded-lg border py-2.5 text-center text-sm font-medium transition-colors ${
              theme === "dark"
                ? "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800"
                : "border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
            }`}
          >
            Back to Banks
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function QuizModeClient({
  questions,
  courseName,
  bankName,
  courseId,
  bankId,
  timeConfig,
}: Props) {
  const totalQuestions = questions.length;
  const timeCfg = useMemo(() => parseTimeConfig(timeConfig), [timeConfig]);

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  // Per-question timer (resets on navigation)
  const [perSecondsLeft, setPerSecondsLeft] = useState(
    timeCfg.mode === "per" ? timeCfg.seconds : 0,
  );
  // Total timer
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(
    timeCfg.mode === "total" ? timeCfg.seconds : 0,
  );

  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = questions[index];
  const selectedOption = answers[index] ?? null;
  const answeredCount = Object.keys(answers).length;

  // ── Theme persistence ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`qaApp.theme`);
      if (stored === "light" || stored === "dark") setTheme(stored);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("qaApp.theme", theme); } catch {}
  }, [theme]);

  // ── Submit quiz ──
  const handleSubmit = useCallback(
    (fromTimer = false) => {
      if (submitted) return;
      setSubmitted(true);
      if (timerRef.current) clearInterval(timerRef.current);
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      setTimeTaken(elapsed);

      const correct = questions.filter((q, i) => {
        const sel = answers[i];
        return sel !== undefined && q.answerKey.includes(sel);
      }).length;

      posthog.capture("quiz_completed", {
        course_id: courseId,
        bank_id: bankId,
        mode: "quiz",
        total_questions: totalQuestions,
        answered: Object.keys(answers).length,
        correct,
        score_pct: Math.round((correct / totalQuestions) * 100),
        time_config: timeConfig,
        time_taken_seconds: elapsed,
        timed_out: fromTimer,
      });
    },
    [submitted, questions, answers, courseId, bankId, totalQuestions, timeConfig],
  );

  // ── Timers ──
  useEffect(() => {
    if (submitted) return;

    if (timeCfg.mode === "total") {
      timerRef.current = setInterval(() => {
        setTotalSecondsLeft((prev) => {
          if (prev <= 1) {
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeCfg.mode, submitted, handleSubmit]);

  // Per-question timer — reset when index changes
  useEffect(() => {
    if (submitted || timeCfg.mode !== "per") return;
    setPerSecondsLeft(timeCfg.seconds);

    const id = setInterval(() => {
      setPerSecondsLeft((prev) => {
        if (prev <= 1) {
          // Auto-advance to next question or submit
          clearInterval(id);
          setIndex((cur) => {
            if (cur >= totalQuestions - 1) {
              handleSubmit(true);
              return cur;
            }
            return cur + 1;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, submitted]);

  const handleSelect = (key: string) => {
    if (selectedOption !== null || submitted) return;
    setAnswers((prev) => ({ ...prev, [index]: key }));
  };

  const handlePrev = () => {
    if (index === 0) return;
    setIndex((p) => p - 1);
  };

  const handleNext = () => {
    if (index === totalQuestions - 1) return;
    setIndex((p) => p + 1);
  };

  // ── Timer display helpers ──
  const showPerTimer = timeCfg.mode === "per" && !submitted;
  const showTotalTimer = timeCfg.mode === "total" && !submitted;
  const perPct = timeCfg.mode === "per" ? (perSecondsLeft / timeCfg.seconds) * 100 : 100;
  const totalPct = timeCfg.mode === "total" ? (totalSecondsLeft / timeCfg.seconds) * 100 : 100;
  const timerUrgent =
    (timeCfg.mode === "per" && perSecondsLeft <= 5) ||
    (timeCfg.mode === "total" && totalSecondsLeft <= 30);

  // ── Theme classes ──
  const bg = theme === "dark" ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900";
  const card = theme === "dark" ? "border-zinc-800 bg-zinc-900/60" : "border-zinc-200 bg-white/80";
  const subtext = theme === "dark" ? "text-zinc-400" : "text-zinc-600";

  if (submitted) {
    return (
      <ResultsScreen
        questions={questions}
        answers={answers}
        courseName={courseName}
        bankName={bankName}
        courseId={courseId}
        bankId={bankId}
        timeTaken={timeTaken}
        theme={theme}
      />
    );
  }

  return (
    <div className={`flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-4 sm:py-10 transition-colors ${bg}`}>
      <main className={`w-full max-w-2xl min-h-0 overflow-y-auto rounded-3xl border px-5 py-6 shadow-sm sm:px-8 sm:py-8 transition-colors ${card}`}>

        {/* Header */}
        <header className="mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/courses/${courseId}/${bankId}/setup`}
              className={`text-xs transition-colors hover:underline ${subtext} hover:text-[#c9a84c]`}
            >
              ← Exit Quiz
            </Link>
            <button
              type="button"
              onClick={() => setTheme((p) => (p === "light" ? "dark" : "light"))}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                theme === "dark"
                  ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-[#c9a84c]/70"
                  : "border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-[#c9a84c]/60 hover:bg-[#fff8e7]"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${theme === "dark" ? "bg-zinc-300" : "bg-zinc-900"}`} />
              {theme === "dark" ? "Dark" : "Light"}
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className={`text-xs sm:text-sm ${subtext}`}>{courseName}</p>
              {/* Total timer badge */}
              {showTotalTimer && (
                <span
                  className={`tabular-nums rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    timerUrgent
                      ? "border-rose-500/60 bg-rose-900/30 text-rose-300"
                      : theme === "dark"
                        ? "border-zinc-700 bg-zinc-900 text-zinc-300"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700"
                  }`}
                >
                  {formatTime(totalSecondsLeft)}
                </span>
              )}
            </div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{bankName}</h1>

            {/* Progress + answered count */}
            <div className="flex items-center gap-3">
              <div
                className={`h-1.5 flex-1 rounded-full overflow-hidden ${
                  theme === "dark" ? "bg-zinc-800" : "bg-zinc-200"
                }`}
              >
                <div
                  className="h-full rounded-full bg-[#c9a84c] transition-all duration-300"
                  style={{ width: `${((index + 1) / totalQuestions) * 100}%` }}
                />
              </div>
              <span className="shrink-0 text-xs tabular-nums text-zinc-500">
                {index + 1} / {totalQuestions}
              </span>
            </div>

            {/* Answered pills */}
            <p className="text-xs text-zinc-500">
              {answeredCount} answered · {totalQuestions - answeredCount} remaining
            </p>
          </div>
        </header>

        {/* Per-question timer bar */}
        {showPerTimer && (
          <div className="mb-5">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className={subtext}>Time per question</span>
              <span className={`tabular-nums font-semibold ${timerUrgent ? "text-rose-400" : "text-zinc-400"}`}>
                {perSecondsLeft}s
              </span>
            </div>
            <div className={`h-1.5 w-full rounded-full overflow-hidden ${theme === "dark" ? "bg-zinc-800" : "bg-zinc-200"}`}>
              <div
                className={`h-full rounded-full transition-all duration-1000 ${timerUrgent ? "bg-rose-500" : "bg-[#c9a84c]"}`}
                style={{ width: `${perPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Question */}
        <section className="mb-6 space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Question {currentQuestion.id}
          </p>
          <h2 className="text-base font-medium leading-relaxed sm:text-lg">
            {currentQuestion.question}
          </h2>
        </section>

        {/* Options — no feedback shown */}
        <section className="space-y-3">
          {Object.entries(currentQuestion.options)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, label]) => {
              const isSelected = selectedOption === key;

              let cls =
                "w-full rounded-2xl border px-4 py-3 text-left text-sm sm:text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/70";

              if (isSelected) {
                cls +=
                  theme === "dark"
                    ? " border-[#c9a84c]/80 bg-[#2a2410] text-[#f0dda0]"
                    : " border-[#c9a84c] bg-[#fff8e7] text-[#8a6a14]";
              } else {
                cls +=
                  theme === "dark"
                    ? " border-zinc-700 bg-zinc-900/80 hover:border-[#c9a84c]/50 hover:bg-zinc-800"
                    : " border-zinc-200 bg-white hover:border-[#c9a84c]/50 hover:bg-[#fff8e7]/60";
              }

              return (
                <button key={key} type="button" onClick={() => handleSelect(key)} className={cls}>
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

        {/* Footer nav + submit */}
        <footer className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={index === 0}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              index === 0
                ? "cursor-not-allowed opacity-40"
                : theme === "dark"
                  ? "border-zinc-700 bg-zinc-900 hover:border-[#c9a84c]/70 hover:bg-zinc-800"
                  : "border-zinc-200 bg-white hover:border-[#c9a84c]/60 hover:bg-[#fff8e7]"
            }`}
          >
            <span aria-hidden>←</span>
            <span>Prev</span>
          </button>

          {index === totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="btn-auth-primary px-5 py-2 text-sm font-semibold"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "border-zinc-700 bg-zinc-900 hover:border-[#c9a84c]/70 hover:bg-zinc-800"
                  : "border-zinc-200 bg-white hover:border-[#c9a84c]/60 hover:bg-[#fff8e7]"
              }`}
            >
              <span>Next</span>
              <span aria-hidden>→</span>
            </button>
          )}
        </footer>

        {/* Early submit from any question */}
        {index < totalQuestions - 1 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className={`text-xs underline underline-offset-2 transition-colors ${subtext} hover:text-[#c9a84c]`}
            >
              Submit early ({answeredCount}/{totalQuestions} answered)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
