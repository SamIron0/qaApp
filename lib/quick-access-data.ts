import { createClient } from "@/utils/supabase/server";
import { getCourseAndBank } from "@/lib/courses";

export type QuickAccessBank = {
  courseId: string;
  bankId: string;
  courseName: string;
  courseCode: string;
  bankName: string;
  questionCount: number;
  visitedAt?: string;
  bookmarkedAt?: string;
};

type QuickAccessData = {
  recents: QuickAccessBank[];
  bookmarks: QuickAccessBank[];
};

export async function getQuickAccessData(userId: string): Promise<QuickAccessData> {
  const supabase = await createClient();

  const [recentsResult, bookmarksResult] = await Promise.all([
    supabase
      .from("bank_recent")
      .select("course_id, bank_id, visited_at")
      .eq("user_id", userId)
      .order("visited_at", { ascending: false })
      .limit(5),

    supabase
      .from("bank_bookmarks")
      .select("course_id, bank_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const enrich = (
    rows: Array<{ course_id: string; bank_id: string }>,
    extra: (row: { course_id: string; bank_id: string; [k: string]: string }) => Partial<QuickAccessBank>,
  ): QuickAccessBank[] => {
    const out: QuickAccessBank[] = [];
    for (const row of rows ?? []) {
      const found = getCourseAndBank(row.course_id, row.bank_id);
      if (!found) continue;
      out.push({
        courseId: row.course_id,
        bankId: row.bank_id,
        courseName: found.course.name,
        courseCode: found.course.code,
        bankName: found.bank.name,
        questionCount: found.bank.questionCount,
        ...extra(row as { course_id: string; bank_id: string; [k: string]: string }),
      });
    }
    return out;
  };

  return {
    recents: enrich(recentsResult.data ?? [], (r) => ({ visitedAt: r.visited_at })),
    bookmarks: enrich(bookmarksResult.data ?? [], (r) => ({ bookmarkedAt: r.created_at })),
  };
}