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

  const bookmarkedBankIds = new Set<string>();
  if (user) {
    const { data } = await supabase
      .from("bank_bookmarks")
      .select("bank_id")
      .eq("course_id", course.id);
    for (const row of data ?? []) bookmarkedBankIds.add(row.bank_id);
  }

  const ratingsByBankId = new Map<
    string,
    { userRating: number | null; average: number | null; count: number }
  >();
  {
    const { data: rows } = await supabase
      .from("bank_ratings")
      .select("bank_id,rating,user_id")
      .eq("course_id", course.id);

    const aggregates = new Map<string, { sum: number; count: number }>();
    for (const row of rows ?? []) {
      const bankId = row.bank_id as string;
      const rating = row.rating as number;
      const userId = row.user_id as string;

      const agg = aggregates.get(bankId) ?? { sum: 0, count: 0 };
      agg.sum += rating;
      agg.count += 1;
      aggregates.set(bankId, agg);

      if (user && userId === user.id) {
        const existing = ratingsByBankId.get(bankId);
        ratingsByBankId.set(bankId, {
          userRating: rating,
          average: existing?.average ?? null,
          count: existing?.count ?? 0,
        });
      }
    }

    for (const [bankId, { sum, count }] of aggregates) {
      const average =
        count > 0 ? Math.round((sum / count) * 10) / 10 : null;
      const existing = ratingsByBankId.get(bankId);
      ratingsByBankId.set(bankId, {
        userRating: existing?.userRating ?? null,
        average,
        count,
      });
    }
  }

  const sortedBanks = banksWithCounts
    .map((bank, index) => ({ bank, index }))
    .sort((a, b) => {
      const aBookmarked = bookmarkedBankIds.has(a.bank.id);
      const bBookmarked = bookmarkedBankIds.has(b.bank.id);
      if (aBookmarked !== bBookmarked) return aBookmarked ? -1 : 1;
      return a.index - b.index; // stable within groups
    })
    .map(({ bank }) => bank);

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
          {sortedBanks.map((bank) => {
            const rating = ratingsByBankId.get(bank.id) ?? {
              userRating: null,
              average: null,
              count: 0,
            };

            return (
              <BankCard
                key={bank.id}
                isAuthenticated={isAuthenticated}
                courseId={course.id}
                bankId={bank.id}
                name={bank.name}
                questionCount={bank.questionCount}
                initiallyBookmarked={bookmarkedBankIds.has(bank.id)}
                initialUserRating={rating.userRating}
                initialAverageRating={rating.average}
                initialRatingCount={rating.count}
              />
            );
          })}
        </ul>
      </main>
    </BrowseShell>
  );
}
