"use client";

import Link from "next/link";

import { quizSessionPath } from "@/lib/courses";

type BankCardProps = {
  isAuthenticated: boolean;
  courseId: string;
  bankId: string;
  name: string;
  description: string;
  questionCount: number;
};

export function BankCard({
  isAuthenticated,
  courseId,
  bankId,
  name,
  description,
  questionCount,
}: BankCardProps) {
  const quizPath = quizSessionPath(courseId, bankId);
  const href = isAuthenticated
    ? quizPath
    : `/login?next=${encodeURIComponent(quizPath)}`;
  const ctaLabel = isAuthenticated ? "Start Practicing →" : "Sign in to Start →";

  return (
    <li>
      <Link
        href={href}
        className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/70"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
            <p className="mt-3 text-xs text-zinc-500">
              {questionCount} question
              {questionCount === 1 ? "" : "s"}
            </p>
          </div>
          <span
            className="shrink-0 text-sm font-medium text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
            aria-hidden
          >
            {ctaLabel}
          </span>
        </div>
      </Link>
    </li>
  );
}
