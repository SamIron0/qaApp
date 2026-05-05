import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export type RatingsResponse = {
  userRating: number | null;
  average: number | null;
  count: number;
};

type RatingRow = {
  rating: number;
  user_id: string;
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

  const { data: rows, error } = await supabase
    .from("bank_ratings")
    .select("rating, user_id")
    .eq("course_id", courseId)
    .eq("bank_id", bankId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const typedRows = (rows ?? []) as RatingRow[];

  const count = typedRows.length;
  const average =
    count > 0
      ? Math.round(
        (typedRows.reduce((s, r) => s + r.rating, 0) / count) * 10
      ) / 10
      : null;

  const userRating = user
    ? (typedRows.find((r) => r.user_id === user.id)?.rating ?? null)
    : null;

  return NextResponse.json({ userRating, average, count } satisfies RatingsResponse);
}

// ─── POST /api/ratings ────────────────────────────────────────────────────────
// Upserts the authenticated user's rating. Returns the updated aggregate.

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { courseId, bankId, rating } = body ?? {};

  if (
    typeof courseId !== "string" ||
    typeof bankId !== "string" ||
    typeof rating !== "number" ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabase.from("bank_ratings").upsert(
    {
      user_id: user.id,
      course_id: courseId,
      bank_id: bankId,
      rating,
    },
    { onConflict: "user_id,course_id,bank_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return the fresh aggregate so the client can sync
  const { data: rows } = await supabase
    .from("bank_ratings")
    .select("rating, user_id")
    .eq("course_id", courseId)
    .eq("bank_id", bankId);

  const typedRows = (rows ?? []) as RatingRow[];
  const count = typedRows.length;
  const average =
    count > 0
      ? Math.round((typedRows.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
      : null;

  return NextResponse.json({
    userRating: rating,
    average,
    count,
  } satisfies RatingsResponse);
}
