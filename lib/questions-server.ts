import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { unstable_cache } from "next/cache";
import type { QuizQuestion } from "@/lib/quiz-types";

const fileVersionCache = new Map<string, string>();

function getFileVersion(relativePathFromRoot: string): string {
  if (fileVersionCache.has(relativePathFromRoot)) {
    return fileVersionCache.get(relativePathFromRoot)!;
  }
  const fullPath = path.join(process.cwd(), relativePathFromRoot);
  const raw = fs.readFileSync(fullPath, "utf8");
  const hash = createHash("sha256").update(raw).digest("hex");
  fileVersionCache.set(relativePathFromRoot, hash);
  return hash;
}

function readQuestionsFromDisk(relativePathFromRoot: string): QuizQuestion[] {
  const fullPath = path.join(process.cwd(), relativePathFromRoot);
  const raw = fs.readFileSync(fullPath, "utf8");
  const data = JSON.parse(raw) as { questions: QuizQuestion[] };
  return data.questions;
}

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