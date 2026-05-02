import { notFound } from "next/navigation";
import { Playfair_Display } from "next/font/google";

import { AppHeader } from "@/components/layout/AppHeader";
import { ModeSetupClient } from "@/components/ModeSetupClient";
import { getCourseAndBank } from "@/lib/courses";
import { countQuestionsInJsonFile } from "@/lib/questions-server";

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

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-50 dark:bg-zinc-950">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="mb-8 space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              {course.code}
            </p>
            <h1
              className={`${playfair.className} text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl`}
            >
              {bank.name}
            </h1>
          </div>
          <ModeSetupClient
            courseId={courseId}
            bankId={bankId}
            totalQuestions={totalQuestions}
          />
        </div>
      </main>
    </div>
  );
}
