import { type NextRequest } from "next/server";

import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on non-static requests so Supabase can refresh the auth cookie on navigation.
     * Only quiz URLs matching /courses/[courseId]/[bankId] are redirected when unauthenticated
     * (see utils/supabase/middleware.ts).
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
