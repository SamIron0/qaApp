"use client";

import { useBookmark } from "@/hooks/use-bookmark";
import { useResolvedDark } from "@/hooks/use-resolved-dark";

type BookmarkButtonProps = {
  courseId: string;
  bankId: string;
  isAuthenticated: boolean;
  variant?: "icon" | "full";
  initiallyBookmarked?: boolean;
};

export function BookmarkButton({
  courseId,
  bankId,
  isAuthenticated,
  variant = "icon",
  initiallyBookmarked,
}: BookmarkButtonProps) {
  const { bookmarked, loading, toggling, toggle } = useBookmark({
    courseId,
    bankId,
    isAuthenticated,
    initialBookmarked: initiallyBookmarked,
  });
  const dark = useResolvedDark();

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div
        className={`h-7 w-7 animate-pulse rounded-lg ${dark ? "bg-zinc-800" : "bg-zinc-200"}`}
      />
    );
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={toggling}
        aria-label="Bookmark"
        aria-pressed={bookmarked}
        className={[
          "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/60",
          "disabled:opacity-50",
          bookmarked
            ? dark
              ? "border-[#c9a84c]/60 bg-[#2a2410] text-[#f0dda0]"
              : "border-[#c9a84c] bg-[#fff8e7] text-[#8a6a14]"
            : dark
              ? "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-[#c9a84c]/50 hover:text-[#f0dda0]"
              : "border-zinc-200 bg-white text-zinc-500 hover:border-[#c9a84c]/50 hover:text-[#8a6a14]",
        ].join(" ")}
      >
        <BookmarkIcon filled={bookmarked} className="h-4 w-4 shrink-0" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={toggling}
      aria-label="Bookmark"
      aria-pressed={bookmarked}
      className={[
        "rounded-lg p-1.5 transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/60",
        "disabled:opacity-50",
        bookmarked
          ? dark
            ? "text-[#f0dda0]"
            : "text-[#8a6a14]"
          : dark
            ? "text-zinc-600 hover:text-[#f0dda0]"
            : "text-zinc-400 hover:text-[#8a6a14]",
      ].join(" ")}
    >
      <BookmarkIcon filled={bookmarked} className="h-4 w-4" />
    </button>
  );
}

function BookmarkIcon({ filled, className }: { filled: boolean; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {filled ? (
        <path
          d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2H5z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2H5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}