"use client";

import Link from "next/link";
import posthog from "posthog-js";

type BankCardProps = {
  isAuthenticated: boolean;
  courseId: string;
  bankId: string;
  name: string;
  questionCount: number;
};

export function BankCard({
  isAuthenticated,
  courseId,
  bankId,
  name,
  questionCount,
}: BankCardProps) {
  const setupPath = `/courses/${courseId}/${bankId}/setup`;
  const href = isAuthenticated
    ? setupPath
    : `/login?next=${encodeURIComponent(setupPath)}`;
  const ctaLabel = isAuthenticated ? "Select mode →" : "Sign in to Start →";

  return (
    <li>
      <Link
        href={href}
        onClick={() => {
          if (isAuthenticated) {
            posthog.capture("question_bank_opened", {
              course_id: courseId,
              bank_id: bankId,
              bank_name: name,
              question_count: questionCount,
            });
          }
        }}
        className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-[#c9a84c]/60 hover:bg-[#fff8e7] dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-[#c9a84c]/60 dark:hover:bg-zinc-900/70"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{name}</h3>
            <p className="mt-3 text-xs text-zinc-500">
              {questionCount} question{questionCount === 1 ? "" : "s"}
            </p>
          </div>
          <span
            className="shrink-0 text-sm font-medium text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-[#8a6a14] dark:group-hover:text-[#f0dda0]"
            aria-hidden
          >
            {ctaLabel}
          </span>
        </div>
      </Link>
    </li>
  );
}
