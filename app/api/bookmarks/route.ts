import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export type BookmarkResponse = {
  bookmarked: boolean;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const bankId = searchParams.get("bankId");

  if (!courseId || !bankId) {
    return NextResponse.json({ error: "courseId and bankId are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bank_bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .eq("bank_id", bankId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookmarked: data !== null } satisfies BookmarkResponse);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { courseId, bankId } = body ?? {};

  if (typeof courseId !== "string" || typeof bankId !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("bank_bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .eq("bank_id", bankId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("bank_bookmarks")
      .delete()
      .eq("id", existing.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ bookmarked: false } satisfies BookmarkResponse);
  } else {
    const { error } = await supabase
      .from("bank_bookmarks")
      .insert({ user_id: user.id, course_id: courseId, bank_id: bankId });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ bookmarked: true } satisfies BookmarkResponse);
  }
}