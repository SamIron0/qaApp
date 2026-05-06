"use server";

import { createClient } from "@/utils/supabase/server";

export async function recordVisit(courseId: string, bankId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("bank_recent").upsert(
    {
      user_id: user.id,
      course_id: courseId,
      bank_id: bankId,
      visited_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_id,bank_id" },
  );
}
