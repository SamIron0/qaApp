import Link from "next/link";
import { Playfair_Display } from "next/font/google";

import { BrowseShell } from "@/components/layout/BrowseShell";
import { QuickAccessWidget } from "@/components/QuickAccessWidget";
import { COURSES, courseBanksPath } from "@/lib/courses";
import { getQuickAccessData } from "@/lib/quick-access-data";
import { createClient } from "@/utils/supabase/server";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch recents + bookmarks in parallel — only for authenticated users
  const quickAccess = user ? await getQuickAccessData(user.id) : null;

  return (
    <BrowseShell>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

        {/* ── Quick access widget — only shown to authenticated users
            who have at least one recent or bookmark ── */}
        {quickAccess && (
          quickAccess.recents.length > 0 || quickAccess.bookmarks.length > 0
        ) && (
          <QuickAccessWidget
            recents={quickAccess.recents}
            bookmarks={quickAccess.bookmarks}
          />
        )}

        <div className="mb-8 max-w-2xl space-y-2">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Courses</h1>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {COURSES.map((course) => {
            const bankCount = course.banks.length;
            const bankLabel =
              bankCount === 1 ? "1 question bank" : `${bankCount} question banks`;

            return (
              <li key={course.id}>
                <Link
                  href={courseBanksPath(course.id)}
                  className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-[#c9a84c]/60 hover:bg-[#fff8e7] dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-[#c9a84c]/60 dark:hover:bg-zinc-900/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2
                      className={`${playfair.className} text-lg font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50`}
                    >
                      {course.name}
                    </h2>
                  </div>
                  <span className="mt-3 inline-flex w-fit rounded-full border border-[#c9a84c]/40 bg-[#fff8e7] px-2.5 py-0.5 text-xs font-medium text-[#8a6a14] dark:border-[#c9a84c]/40 dark:bg-[#3a2f14] dark:text-[#f0dda0]">
                    {course.code}
                  </span>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{course.department}</p>
                  <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">{bankLabel}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </BrowseShell>
  );
}