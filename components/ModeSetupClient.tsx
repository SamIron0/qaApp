"use client";

import posthog from "posthog-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  courseId: string;
  bankId: string;
  totalQuestions: number;
};

const TIME_LIMIT_OPTIONS = [
  { label: "No limit", value: "none", description: "Untimed" },
  { label: "30s", value: "per_30", description: "Per question" },
  { label: "1 min", value: "per_60", description: "Per question" },
  { label: "10 min", value: "total_600", description: "Total" },
  { label: "20 min", value: "total_1200", description: "Total" },
] as const;
type TimeLimitValue = (typeof TIME_LIMIT_OPTIONS)[number]["value"];

function getCountOptions(total: number): number[] {
  return [10, 20, 30, 50].filter((n) => n <= total);
}

export function ModeSetupClient({ courseId, bankId, totalQuestions }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"practice" | "quiz" | null>(null);

  const countOptions = getCountOptions(totalQuestions);
  const defaultCount =
    countOptions.length > 0
      ? countOptions[Math.min(1, countOptions.length - 1)]
      : totalQuestions;

  const [questionCount, setQuestionCount] = useState<number | "all">(defaultCount);
  const [timeLimit, setTimeLimit] = useState<TimeLimitValue>("none");

  const resolvedCount =
    questionCount === "all" ? totalQuestions : Math.min(questionCount, totalQuestions);

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

    router.push(
      `${base}?${new URLSearchParams({
        mode: "quiz",
        count: String(resolvedCount),
        time: timeLimit,
      })}`,
    );
  };

  return (
    <div className="space-y-3">
      {/* ── Mode cards ── */}
      <div className="grid grid-cols-2 gap-3">
        <ModeButton
          active={mode === "practice"}
          onClick={() => setMode("practice")}
          label="Practice"
          tag="Recommended"
          detail={`All ${totalQuestions} questions · instant feedback`}
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
          }
        />
        <ModeButton
          active={mode === "quiz"}
          onClick={() => setMode("quiz")}
          label="Quiz"
          tag="Timed · scored"
          detail="Score revealed at the end"
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>

      {/* ── Quiz config ── */}
      {mode === "quiz" && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
          {/* Question count */}
          <div className="px-5 py-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
              Questions
            </p>
            <div className="flex flex-wrap gap-2">
              {countOptions.map((n) => (
                <Chip
                  key={n}
                  label={String(n)}
                  active={questionCount === n}
                  onClick={() => setQuestionCount(n)}
                />
              ))}
              <Chip
                label={`All ${totalQuestions}`}
                active={questionCount === "all"}
                onClick={() => setQuestionCount("all")}
              />
            </div>
          </div>

          <div className="mx-5 h-px bg-zinc-100 dark:bg-zinc-800" />

          {/* Time limit — segmented control */}
          <div className="px-5 py-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
              Time limit
            </p>
            <div className="grid grid-cols-5 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
              {TIME_LIMIT_OPTIONS.map((opt, i) => {
                const active = timeLimit === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTimeLimit(opt.value)}
                    className={[
                      "flex flex-col items-center px-1 py-2.5 text-center transition-colors",
                      i > 0 ? "border-l border-zinc-200 dark:border-zinc-700" : "",
                      active
                        ? "bg-zinc-900 dark:bg-zinc-100"
                        : "bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800",
                    ].join(" ")}
                  >
                    <span
                      className={`text-sm font-semibold leading-none ${active ? "text-zinc-50 dark:text-zinc-900" : "text-zinc-700 dark:text-zinc-300"
                        }`}
                    >
                      {opt.label}
                    </span>
                    <span
                      className={`mt-1 text-[10px] leading-none ${active ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-400 dark:text-zinc-500"
                        }`}
                    >
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Config summary receipt */}
          <div className="border-t border-zinc-100 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/80">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
              <ReceiptItem label={`${resolvedCount} questions`} />
              <ReceiptItem
                label={
                  timeLimit === "none"
                    ? "No time limit"
                    : timeLimit.startsWith("per_")
                      ? `${Number(timeLimit.split("_")[1])}s per question`
                      : `${Number(timeLimit.split("_")[1]) / 60} min total`
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <button
        type="button"
        onClick={handleStart}
        disabled={!mode}
        className="btn-auth-primary w-full py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
      >
        {mode === "practice"
          ? `Start Practising · ${totalQuestions} questions`
          : mode === "quiz"
            ? `Start Quiz · ${resolvedCount} questions`
            : "Select a mode to continue"}
      </button>
    </div>
  );
}

// ── Sub-components ──

function ModeButton({
  active,
  onClick,
  label,
  tag,
  detail,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  tag: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-[#c9a84c] bg-[#fff8e7] dark:border-[#c9a84c]/60 dark:bg-[#2a2410]"
          : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700",
      ].join(" ")}
    >
      <span
        className={[
          "absolute right-3 top-3 h-2 w-2 rounded-full transition-all duration-200",
          active ? "bg-[#c9a84c]" : "bg-zinc-200 dark:bg-zinc-700",
        ].join(" ")}
      />

      <span
        className={`mb-3 rounded-lg p-1.5 ${active
            ? "bg-[#c9a84c]/20 text-[#8a6a14] dark:text-[#c9a84c]"
            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
      >
        {icon}
      </span>

      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{label}</p>
      <p className="mt-0.5 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">{tag}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">{detail}</p>
    </button>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-[#c9a84c] bg-[#fff8e7] text-[#8a6a14] dark:border-[#c9a84c]/60 dark:bg-[#3a2f14] dark:text-[#f0dda0]"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ReceiptItem({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-1 w-1 rounded-full bg-[#c9a84c]" />
      {label}
    </span>
  );
}