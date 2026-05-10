import fs from "fs";
import path from "path";

import { unstable_cache } from "next/cache";

import type { QuizQuestion } from "@/lib/quiz-types";

function readQuestionsFromDisk(relativePathFromRoot: string): QuizQuestion[] {
  const fullPath = path.join(process.cwd(), relativePathFromRoot);
  const raw = fs.readFileSync(fullPath, "utf8");
  const data = JSON.parse(raw) as { questions: QuizQuestion[] };
  return data.questions;
}

/** Use for interactive sessions; cached across requests (static JSON until deploy). */
export function loadQuestionsForBank(
  relativePathFromRoot: string,
): Promise<QuizQuestion[]> {
  return unstable_cache(
    async () => readQuestionsFromDisk(relativePathFromRoot),
    ["question-bank-json", relativePathFromRoot],
    { revalidate: false },
  )();
}

/** Prefer `QuestionBank.questionCount` from course metadata to avoid disk I/O. */
export function countQuestionsInJsonFile(relativePathFromRoot: string): number {
  return readQuestionsFromDisk(relativePathFromRoot).length;
}
