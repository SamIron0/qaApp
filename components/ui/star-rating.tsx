"use client";

import { useState } from "react";

type StarRatingProps = {
  value: number | null;
  onChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  showAverage?: boolean;
  average?: number | null;
  count?: number;
  submitting?: boolean;
};

const SIZE = {
  sm: { star: "h-3.5 w-3.5", gap: "gap-0.5", text: "text-[11px]" },
  md: { star: "h-5 w-5",   gap: "gap-1",   text: "text-xs"     },
  lg: { star: "h-6 w-6",   gap: "gap-1.5", text: "text-sm"     },
};

export function StarRating({
  value,
  onChange,
  interactive = true,
  size = "md",
  showAverage = false,
  average,
  count,
  submitting = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const s = SIZE[size];

  const displayRating = hovered ?? value ?? 0;

  const canInteract = interactive && !!onChange && !submitting;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center ${s.gap}`}
        onMouseLeave={() => canInteract && setHovered(null)}
        role={canInteract ? "radiogroup" : undefined}
        aria-label={canInteract ? "Rate this question bank" : "Rating"}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayRating;
          return (
            <button
              key={star}
              type="button"
              disabled={!canInteract}
              aria-label={`${star} star${star === 1 ? "" : "s"}`}
              aria-pressed={value === star}
              onMouseEnter={() => canInteract && setHovered(star)}
              onClick={() => canInteract && onChange?.(star)}
              className={[
                "transition-all duration-100",
                canInteract
                  ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]/60 rounded-sm"
                  : "cursor-default",
              ].join(" ")}
            >
              <StarIcon
                filled={filled}
                halfFilled={false}
                className={s.star}
                scale={canInteract && hovered === star ? 1.25 : 1}
              />
            </button>
          );
        })}
      </div>

      {showAverage && (
        <span className={`tabular-nums ${s.text} text-zinc-500 dark:text-zinc-400`}>
          {average !== null && average !== undefined
            ? `${average.toFixed(1)}`
            : "—"}
          {count !== undefined && count > 0 && (
            <span className="ml-0.5 opacity-70">({count})</span>
          )}
        </span>
      )}
    </div>
  );
}

function StarIcon({
  filled,
  halfFilled,
  className,
  scale,
}: {
  filled: boolean;
  halfFilled: boolean;
  className: string;
  scale: number;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `scale(${scale})`, transition: "transform 100ms ease" }}
      aria-hidden
    >
      {filled ? (
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          fill="#c9a84c"
        />
      ) : (
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-zinc-300 dark:text-zinc-600"
        />
      )}
    </svg>
  );
}