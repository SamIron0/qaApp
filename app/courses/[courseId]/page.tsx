import Link from "next/link";
import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { BankCard } from "@/components/courses/BankCard";
import { BrowseShell } from "@/components/layout/BrowseShell";
import { getCourseById } from "@/lib/courses";
import { countQuestionsInJsonFile } from "@/lib/questions-server";
import { createClient } from "@/utils/supabase/server";

const playfair = Playfair_Display({
  subsets: ["latin"],
});

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseBanksPage({ params }: PageProps) {
  const { courseId } = await params;
  const course = getCourseById(courseId);
  if (!course) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = Boolean(user);

  const banksWithCounts = course.banks.map((bank) => ({
    ...bank,
    questionCount: countQuestionsInJsonFile(bank.file),
  }));

  return (
    <BrowseShell>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="mb-6 text-sm">
          <Link
            href="/"
            className="text-zinc-500 transition-colors hover:text-[#c9a84c] hover:underline dark:text-zinc-400 dark:hover:text-[#e8d5a0]"
          >
            ← Back to Courses
          </Link>
        </p>

        <div className="mb-8 space-y-2">
          <span className="inline-flex rounded-full border border-[#c9a84c]/40 bg-[#fff8e7] px-2.5 py-0.5 text-xs font-medium text-[#8a6a14] dark:border-[#c9a84c]/40 dark:bg-[#3a2f14] dark:text-[#f0dda0]">
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
            <BankCard
              key={bank.id}
              isAuthenticated={isAuthenticated}
              courseId={course.id}
              bankId={bank.id}
              name={bank.name}
              questionCount={bank.questionCount}
            />
          ))}
        </ul>
      </main>
    </BrowseShell>
  );
}
