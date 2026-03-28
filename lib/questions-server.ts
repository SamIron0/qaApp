import fs from "fs";
import path from "path";

import type { QuizQuestion } from "@/lib/quiz-types";

export function loadQuestionsFromJsonFile(relativePathFromRoot: string): QuizQuestion[] {
  const fullPath = path.join(process.cwd(), relativePathFromRoot);
  const raw = fs.readFileSync(fullPath, "utf8");
  const data = JSON.parse(raw) as { questions: QuizQuestion[] };
  return data.questions;
}

export function countQuestionsInJsonFile(relativePathFromRoot: string): number {
  return loadQuestionsFromJsonFile(relativePathFromRoot).length;
}
