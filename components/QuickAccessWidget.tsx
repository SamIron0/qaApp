"use client";

import Link from "next/link";
import { useState } from "react";
import { Playfair_Display } from "next/font/google";

import type { QuickAccessBank } from "@/lib/quick-access-date";
import { useResolvedDark } from "@/hooks/use-resolved-dark";

const playfair = Playfair_Display({ subsets: ["latin"] });

type Tab = "continue" | "bookmarks";

type Props = {
  recents: QuickAccessBank[];
  bookmarks: QuickAccessBank[];
};

export function QuickAccessWidget({ recents, bookmarks }: Props) {
  const [tab, setTab] = useState<Tab>("continue");
  const dark = useResolvedDark();

  const items = tab === "continue" ? recents : bookmarks;

  const shell = dark
    ? "border-zinc-800 bg-zinc-900/60"
    : "border-zinc-200 bg-white/80";

  const emptyText = dark ? "text-zinc-500" : "text-zinc-400";

  return (
    <div className={`mb-10 rounded-3xl border px-5 py-5 shadow-sm sm:px-6 ${shell}`}>
      <SegmentedController tab={tab} onChange={setTab} dark={dark} />

      <div className="mt-4">
        {items.length === 0 ? (
          <EmptyState tab={tab} dark={dark} />
        ) : (
          <ul className="space-y-2">
            {items.map((bank) => (
              <QuickAccessCard key={`${bank.courseId}-${bank.bankId}`} bank={bank} dark={dark} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SegmentedController({
  tab,
  onChange,
  dark,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  dark: boolean;
}) {
  const track = dark ? "bg-zinc-800" : "bg-zinc-100";
  const activeBtn = dark
    ? "bg-zinc-700 text-zinc-100 shadow-sm"
    : "bg-white text-zinc-900 shadow-sm";
  const inactiveBtn = dark
    ? "text-zinc-400 hover:text-zinc-200"
    : "text-zinc-500 hover:text-zinc-700";

  return (
    <div className={`inline-flex items-center rounded-xl p-1 ${track}`}>
      {(["continue", "bookmarks"] as Tab[]).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={[
            "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all",
            tab === t ? activeBtn : inactiveBtn,
          ].join(" ")}
        >
          {t === "continue" ? (
            <>
              <ClockIcon className="h-3.5 w-3.5" />
              Continue
            </>
          ) : (
            <>
              <BookmarkIcon className="h-3.5 w-3.5" />
              Bookmarks
            </>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── QuickAccessCard ──────────────────────────────────────────────────────────

function QuickAccessCard({ bank, dark }: { bank: QuickAccessBank; dark: boolean }) {
  const card = dark
    ? "border-zinc-800 bg-zinc-900/40 hover:border-[#c9a84c]/50 hover:bg-zinc-900/70"
    : "border-zinc-100 bg-zinc-50 hover:border-[#c9a84c]/50 hover:bg-[#fff8e7]";

  const subtext = dark ? "text-zinc-500" : "text-zinc-400";

  return (
    <li>
      <Link
        href={`/courses/${bank.courseId}/${bank.bankId}/setup`}
        className={`group flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition-colors ${card}`}
      >
        <div className="min-w-0">
          <p className={`text-[11px] font-medium uppercase tracking-widest ${subtext}`}>
            {bank.courseCode}
          </p>
          <p className={`${playfair.className} mt-0.5 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50`}>
            {bank.bankName}
          </p>
          <p className={`mt-0.5 text-xs ${subtext}`}>
            {bank.questionCount} question{bank.questionCount === 1 ? "" : "s"}
            {bank.visitedAt && (
              <> · <RelativeTime iso={bank.visitedAt} /></>
            )}
          </p>
        </div>
        <span
          className={`shrink-0 text-xs font-medium transition-all group-hover:translate-x-0.5 ${dark ? "text-zinc-600 group-hover:text-[#f0dda0]" : "text-zinc-400 group-hover:text-[#8a6a14]"}`}
          aria-hidden
        >
          →
        </span>
      </Link>
    </li>
  );
}


function EmptyState({ tab, dark }: { tab: Tab; dark: boolean }) {
  const text = dark ? "text-zinc-500" : "text-zinc-400";
  return (
    <p className={`py-4 text-center text-sm ${text}`}>
      {tab === "continue"
        ? "Open a question bank to start tracking your progress."
        : "Bookmark a question bank to find it here quickly."}
    </p>
  );
}

function RelativeTime({ iso }: { iso: string }) {
  const date = new Date(iso);
  const now = Date.now();
  const diff = now - date.getTime();

  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  let label: string;
  if (mins < 1) label = "just now";
  else if (mins < 60) label = `${mins}m ago`;
  else if (hours < 24) label = `${hours}h ago`;
  else if (days === 1) label = "yesterday";
  else if (days < 7) label = `${days}d ago`;
  else label = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return <span suppressHydrationWarning>{label}</span>;
}

function ClockIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
