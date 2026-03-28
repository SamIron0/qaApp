import Link from "next/link";
import { Playfair_Display } from "next/font/google";

import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { COURSES } from "@/lib/courses";
import { createClient } from "@/utils/supabase/server";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-dashboard-serif",
});

export default async function DashboardCoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "Student";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    const name = profile?.full_name?.trim();
    if (name) displayName = name;
    else if (user.email) displayName = user.email;
  }

  return (
    <div
      className={`${playfair.variable} min-h-[100dvh] bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100`}
    >
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <span className="text-sm font-semibold tracking-tight">Practice Q&amp;A</span>
          <div className="flex items-center gap-3">
            <span className="max-w-[200px] truncate text-sm text-zinc-600 dark:text-zinc-400">
              {displayName}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 max-w-2xl space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Choose a course</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Select where you want to practice. You&apos;ll pick a question bank on the next step.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {COURSES.map((course) => {
            const bankCount = course.banks.length;
            const bankLabel =
              bankCount === 1 ? "1 question bank" : `${bankCount} question banks`;

            return (
              <li key={course.id}>
                <Link
                  href={`/dashboard/${course.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2
                      className={`${playfair.className} text-lg font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50`}
                    >
                      {course.name}
                    </h2>
                    <span
                      className="mt-0.5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500"
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                  <span className="mt-3 inline-flex w-fit rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
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
    </div>
  );
}
