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

function getFileVersion(relativePathFromRoot: string): string {
  const fullPath = path.join(process.cwd(), relativePathFromRoot);
  const stats = fs.statSync(fullPath);
  return String(stats.mtimeMs);
}

/** Cached across requests; auto-busts when JSON file mtime changes. */
export function loadQuestionsForBank(
  relativePathFromRoot: string,
): Promise<QuizQuestion[]> {
  const fileVersion = getFileVersion(relativePathFromRoot);
  return unstable_cache(
    async () => readQuestionsFromDisk(relativePathFromRoot),
    ["question-bank-json", relativePathFromRoot, fileVersion],
    { revalidate: false },
  )();
}

export function countQuestionsInJsonFile(relativePathFromRoot: string): number {
  return readQuestionsFromDisk(relativePathFromRoot).length;
}
