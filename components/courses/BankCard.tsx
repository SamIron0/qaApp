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
  vendor: "quro" | "ad-astra";
  initiallyBookmarked?: boolean;
  initialUserRating?: number | null;
  initialAverageRating?: number | null;
  initialRatingCount?: number;
};

function VendorBadge({ vendor }: { vendor: "quro" | "ad-astra" }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-500">{vendor}</span>;
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