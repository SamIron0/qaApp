"use client";

import { StarRating } from "./ui/star-rating";
import { useRating } from "@/hooks/use-rating";

type BankRatingProps = {
  courseId: string;
  bankId: string;
  isAuthenticated: boolean;
  /** "card" = compact read+rate on hover; "setup" = full with label */
  variant?: "card" | "setup";
  initialUserRating?: number | null;
  initialAverage?: number | null;
  initialCount?: number;
};

export function BankRating({
  courseId,
  bankId,
  isAuthenticated,
  variant = "card",
  initialUserRating,
  initialAverage,
  initialCount,
}: BankRatingProps) {
  const { userRating, average, count, loading, submitting, submitRating } =
    useRating({
      courseId,
      bankId,
      isAuthenticated,
      initialUserRating,
      initialAverage,
      initialCount,
    });

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 opacity-30">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-3.5 w-3.5 rounded-sm bg-zinc-300 dark:bg-zinc-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
        <StarRating
          value={userRating}
          onChange={isAuthenticated ? submitRating : undefined}
          interactive={isAuthenticated}
          size="sm"
          showAverage={count > 0}
          average={average}
          count={count}
          submitting={submitting}
        />
        {!isAuthenticated && count === 0 && (
          <span className="text-[11px] text-zinc-400">No ratings yet</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Rate this bank
        </p>
        {count > 0 && (
          <p className="text-xs text-zinc-500">
            {average?.toFixed(1)} avg · {count} {count === 1 ? "rating" : "ratings"}
          </p>
        )}
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <StarRating
            value={userRating}
            onChange={submitRating}
            interactive
            size="lg"
            submitting={submitting}
          />
          {userRating !== null && (
            <span className="text-xs text-zinc-500">
              {submitting ? "Saving…" : "Your rating saved"}
            </span>
          )}
        </div>
      ) : (
        <p className="text-xs text-zinc-500">Sign in to rate this bank.</p>
      )}
    </div>
  );
}