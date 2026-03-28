import { notFound } from "next/navigation";

import { AppHeader } from "@/components/layout/AppHeader";
import { QuizClient } from "@/components/QuizClient";
import { getCourseAndBank } from "@/lib/courses";
import { loadQuestionsFromJsonFile } from "@/lib/questions-server";

type PageProps = {
  params: Promise<{ courseId: string; bankId: string }>;
};

export default async function QuizSessionPage({ params }: PageProps) {
  const { courseId, bankId } = await params;
  const found = getCourseAndBank(courseId, bankId);
  if (!found) notFound();

  const { course, bank } = found;
  const questions = loadQuestionsFromJsonFile(bank.file);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <AppHeader />
      <QuizClient
        questions={questions}
        courseName={course.name}
        bankName={bank.name}
        courseId={course.id}
        bankId={bank.id}
      />
    </div>
  );
}
