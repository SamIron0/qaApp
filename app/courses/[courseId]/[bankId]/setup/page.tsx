import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { AppHeader } from "@/components/layout/AppHeader";
import { ModeSetupClient } from "@/components/ModeSetupClient";
import { BankRating } from "@/components/BankRating";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { getCourseAndBank } from "@/lib/courses";
import { countQuestionsInJsonFile } from "@/lib/questions-server";
import { createClient } from "@/utils/supabase/server";

const playfair = Playfair_Display({ subsets: ["latin"] });

type PageProps = {
  params: Promise<{ courseId: string; bankId: string }>;
};

export default async function SetupPage({ params }: PageProps) {
  const { courseId, bankId } = await params;
  const found = getCourseAndBank(courseId, bankId);
  if (!found) notFound();

  const { course, bank } = found;
  const totalQuestions = countQuestionsInJsonFile(bank.file);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  const { data: ratingRows } = await supabase
    .from("bank_ratings")
    .select("rating,user_id")
    .eq("course_id", courseId)
    .eq("bank_id", bankId);

  const count = ratingRows?.length ?? 0;
  const average =
    count > 0
      ? Math.round(
          ((ratingRows ?? []).reduce((s, r) => s + (r.rating as number), 0) / count) * 10,
        ) / 10
      : null;
  const userRating = user
    ? ((ratingRows ?? []).find((r) => (r.user_id as string) === user.id)?.rating as
        | number
        | undefined) ?? null
    : null;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-50 dark:bg-zinc-950">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                {course.code}
              </p>
              <h1
                className={`${playfair.className} text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl`}
              >
                {bank.name}
              </h1>
            </div>
            <div className="mt-1 shrink-0">
              <BookmarkButton
                courseId={courseId}
                bankId={bankId}
                isAuthenticated={isAuthenticated}
                variant="full"
              />
            </div>
          </div>

          <ModeSetupClient
            courseId={courseId}
            bankId={bankId}
            totalQuestions={totalQuestions}
          />

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <BankRating
              courseId={courseId}
              bankId={bankId}
              isAuthenticated={isAuthenticated}
              variant="setup"
              initialUserRating={userRating}
              initialAverage={average}
              initialCount={count}
            />
          </div>
        </div>
      </main>
    </div>
  );
}