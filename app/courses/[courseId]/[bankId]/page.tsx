import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/AppHeader";
import { PracticeModeClient } from "@/components/PracticeModeClient";
import { QuizModeClient } from "@/components/QuizModeClient";
import { getCourseAndBank } from "@/lib/courses";
import { loadQuestionsFromJsonFile } from "@/lib/questions-server";

type PageProps = {
  params: Promise<{ courseId: string; bankId: string }>;
  searchParams: Promise<{ mode?: string; count?: string; time?: string }>;
};

export default async function QuizSessionPage({ params, searchParams }: PageProps) {
  const { courseId, bankId } = await params;
  const { mode, count, time } = await searchParams;

  const found = getCourseAndBank(courseId, bankId);
  if (!found) notFound();

  if (!mode) {
    redirect(`/courses/${courseId}/${bankId}/setup`);
  }

  const { course, bank } = found;
  const allQuestions = loadQuestionsFromJsonFile(bank.file);

  if (mode === "practice") {
    return (
      <div className="flex min-h-[100dvh] flex-col">
        <AppHeader />
        <PracticeModeClient
          questions={allQuestions}
          courseName={course.name}
          bankName={bank.name}
          courseId={course.id}
          bankId={bank.id}
        />
      </div>
    );
  }

  if (mode === "quiz") {
    const requestedCount = count ? parseInt(count, 10) : allQuestions.length;
    const clampedCount = Math.min(
      Math.max(1, isNaN(requestedCount) ? allQuestions.length : requestedCount),
      allQuestions.length,
    );

    // Shuffle and slice
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, clampedCount);

    return (
      <div className="flex min-h-[100dvh] flex-col">
        <AppHeader />
        <QuizModeClient
          questions={questions}
          courseName={course.name}
          bankName={bank.name}
          courseId={course.id}
          bankId={bank.id}
          timeConfig={time ?? "none"}
        />
      </div>
    );
  }

  redirect(`/courses/${courseId}/${bankId}/setup`);
}
