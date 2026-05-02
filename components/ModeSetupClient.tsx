"use client";

import posthog from "posthog-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  courseId: string;
  bankId: string;
  totalQuestions: number;
};

const QUESTION_COUNT_OPTIONS = [10, 20, 30, "All"] as const;
type QuestionCountOption = (typeof QUESTION_COUNT_OPTIONS)[number];

const TIME_LIMIT_OPTIONS = [
  { label: "30s / question", value: "per_30" },
  { label: "1 min / question", value: "per_60" },
  { label: "10 min total", value: "total_600" },
  { label: "20 min total", value: "total_1200" },
  { label: "No limit", value: "none" },
] as const;
type TimeLimitValue = (typeof TIME_LIMIT_OPTIONS)[number]["value"];

export function ModeSetupClient({ courseId, bankId, totalQuestions }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"practice" | "quiz" | null>(null);

  // Quiz config
  const [questionCount, setQuestionCount] = useState<QuestionCountOption>(
    totalQuestions >= 20 ? 20 : "All",
  );
  const [timeLimit, setTimeLimit] = useState<TimeLimitValue>("none");

  const resolvedCount =
    questionCount === "All"
      ? totalQuestions
      : Math.min(questionCount, totalQuestions);

  const handleStart = () => {
    if (!mode) return;
    const base = `/courses/${courseId}/${bankId}`;
    if (mode === "practice") {
      posthog.capture("study_mode_started", {
        study_mode: "practice",
        course_id: courseId,
        bank_id: bankId,
        total_questions: totalQuestions,
      });
      router.push(`${base}?mode=practice`);
      return;
    }
    posthog.capture("study_mode_started", {
      study_mode: "quiz",
      course_id: courseId,
      bank_id: bankId,
      question_count: resolvedCount,
      time_config: timeLimit,
      bank_total_questions: totalQuestions,
    });
    const params = new URLSearchParams({
      mode: "quiz",
      count: String(resolvedCount),
      time: timeLimit,
    });
    router.push(`${base}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Mode picker */}
      <div className="grid grid-cols-2 gap-3">
        <ModeCard
          active={mode === "practice"}
          onClick={() => setMode("practice")}
          title="Practice"
          description="Answer at your own pace. See the correct answer immediately after each question."
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          }
        />
        <ModeCard
          active={mode === "quiz"}
          onClick={() => setMode("quiz")}
          title="Quiz"
          description="Simulate an exam. No feedback until the end. Get a score and review your answers."
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          }
        />
      </div>

      {/* Quiz config */}
      {mode === "quiz" && (
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          {/* Question count */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Number of questions
            </label>
            <div className="flex flex-wrap gap-2">
              {QUESTION_COUNT_OPTIONS.map((opt) => {
                const count = opt === "All" ? totalQuestions : opt;
                const unavailable = opt !== "All" && opt > totalQuestions;
                const active = questionCount === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={unavailable}
                    onClick={() => setQuestionCount(opt)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                      active
                        ? "border-[#c9a84c] bg-[#fff8e7] text-[#8a6a14] dark:border-[#c9a84c]/70 dark:bg-[#3a2f14] dark:text-[#f0dda0]"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-[#c9a84c]/50 hover:bg-[#fff8e7]/60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-[#c9a84c]/40"
                    }`}
                  >
                    {opt === "All" ? `All ${totalQuestions}` : count}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time limit */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Time limit
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_LIMIT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTimeLimit(opt.value)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    timeLimit === opt.value
                      ? "border-[#c9a84c] bg-[#fff8e7] text-[#8a6a14] dark:border-[#c9a84c]/70 dark:bg-[#3a2f14] dark:text-[#f0dda0]"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-[#c9a84c]/50 hover:bg-[#fff8e7]/60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-[#c9a84c]/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {resolvedCount} questions
            {timeLimit === "none"
              ? ", no time limit"
              : timeLimit.startsWith("per_")
                ? `, ${Number(timeLimit.split("_")[1])}s per question`
                : `, ${Number(timeLimit.split("_")[1]) / 60} min total`}
            {" · "}shuffled order
          </p>
        </div>
      )}

      {/* Practice note */}
      {mode === "practice" && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          All {totalQuestions} questions · no time limit · instant feedback
        </p>
      )}

      {/* Start button */}
      <button
        type="button"
        onClick={handleStart}
        disabled={!mode}
        className="btn-auth-primary w-full py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {mode === "practice"
          ? "Start Practising"
          : mode === "quiz"
            ? "Start Quiz"
            : "Select a mode to continue"}
      </button>
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  title,
  description,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-[#c9a84c] bg-[#fff8e7] dark:border-[#c9a84c]/70 dark:bg-[#2a2410]"
          : "border-zinc-200 bg-white hover:border-[#c9a84c]/40 hover:bg-[#fff8e7]/40 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-[#c9a84c]/30"
      }`}
    >
      <span
        className={`${active ? "text-[#c9a84c]" : "text-zinc-400 dark:text-zinc-500"}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </button>
  );
}
