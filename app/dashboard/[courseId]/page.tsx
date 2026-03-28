import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { getCourseById } from "@/lib/courses";
import { countQuestionsInJsonFile } from "@/lib/questions-server";

const playfair = Playfair_Display({
  subsets: ["latin"],
});

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function DashboardCourseBanksPage({ params }: PageProps) {
  const { courseId } = await params;
  const course = getCourseById(courseId);
  if (!course) notFound();

  const banksWithCounts = course.banks.map((bank) => ({
    ...bank,
    questionCount: countQuestionsInJsonFile(bank.file),
  }));

  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="mb-6 text-sm">
          <Link
            href="/dashboard"
            className="text-zinc-500 transition-colors hover:text-zinc-800 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← Back to Courses
          </Link>
        </p>

        <div className="mb-8 space-y-2">
          <span className="inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
            {course.code}
          </span>
          <h1
            className={`${playfair.className} text-2xl font-semibold tracking-tight sm:text-3xl`}
          >
            {course.name}
          </h1>
        </div>

        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.12em] text-zinc-500">
          Question banks
        </h2>

        <ul className="flex flex-col gap-4">
          {banksWithCounts.map((bank) => (
            <li key={bank.id}>
              <Link
                href={`/dashboard/${course.id}/${bank.id}`}
                className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/70"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {bank.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {bank.description}
                    </p>
                    <p className="mt-3 text-xs text-zinc-500">
                      {bank.questionCount} question
                      {bank.questionCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-sm font-medium text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
                    aria-hidden
                  >
                    Start Practicing →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
