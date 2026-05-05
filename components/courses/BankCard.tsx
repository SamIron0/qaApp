"use client";

import Link from "next/link";
import posthog from "posthog-js";

import { BankRating } from "@/components/BankRating";
import { BookmarkButton } from "@/components/ui/bookmark-button";

type BankCardProps = {
  isAuthenticated: boolean;
  courseId: string;
  bankId: string;
  name: string;
  questionCount: number;
  vendor: "quro" | "astar";
  initiallyBookmarked?: boolean;
  initialUserRating?: number | null;
  initialAverageRating?: number | null;
  initialRatingCount?: number;
};

function VendorBadge({ vendor }: { vendor: "quro" | "astar" }) {
  if (vendor === "quro") {
    return (
      <span
        title="This question bank is curated and certified by the site owners"
        className="inline-flex items-center gap-1 rounded-full border border-[#c9a84c]/50 bg-[#fff8e7] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#8a6a14] dark:border-[#c9a84c]/40 dark:bg-[#3a2f14]/80 dark:text-[#f0dda0]"
      >
        {/* Shield-check icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-3 shrink-0"
        >
          <path
            fillRule="evenodd"
            d="M8 1.25a.75.75 0 0 1 .538.227l4.5 4.5A.75.75 0 0 1 13.25 6.5v3a5.75 5.75 0 0 1-5.172 5.718.75.75 0 0 1-.156 0A5.75 5.75 0 0 1 2.75 9.5v-3a.75.75 0 0 1 .212-.523l4.5-4.5A.75.75 0 0 1 8 1.25Zm0 1.591L3.75 7.09v2.41a4.25 4.25 0 0 0 3.633 4.204L8 13.74l.617-.037A4.25 4.25 0 0 0 12.25 9.5V7.09L8 2.841Zm2.03 3.409a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0l-1-1a.75.75 0 1 1 1.06-1.06l.47.47 1.97-1.97a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
        Verified
      </span>
    );
  }

  return (
    <span
      title="This question bank was contributed by the community"
      className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-500"
    >
      {/* Users icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-3 shrink-0"
      >
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
      </svg>
      Community
    </span>
  );
}

export function BankCard({
  isAuthenticated,
  courseId,
  bankId,
  name,
  questionCount,
  vendor,
  initiallyBookmarked,
  initialUserRating,
  initialAverageRating,
  initialRatingCount,
}: BankCardProps) {
  const setupPath = `/courses/${courseId}/${bankId}/setup`;
  const href = isAuthenticated
    ? setupPath
    : `/login?next=${encodeURIComponent(setupPath)}`;

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
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {name}
              </h3>
              <VendorBadge vendor={vendor} />
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {questionCount} question{questionCount === 1 ? "" : "s"}
            </p>
          </div>
          <div
            className="flex shrink-0 items-center gap-2"
            onClick={(e) => e.preventDefault()}
          >
            <BookmarkButton
              courseId={courseId}
              bankId={bankId}
              isAuthenticated={isAuthenticated}
              variant="icon"
              initiallyBookmarked={initiallyBookmarked}
            />
          </div>
        </div>

        <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <BankRating
            courseId={courseId}
            bankId={bankId}
            isAuthenticated={isAuthenticated}
            variant="card"
            initialUserRating={initialUserRating ?? null}
            initialAverage={initialAverageRating ?? null}
            initialCount={initialRatingCount ?? 0}
          />
        </div>
      </Link>
    </li>
  );
}