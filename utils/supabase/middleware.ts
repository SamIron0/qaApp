import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/dashboard");
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  if (isProtectedPath(pathname)) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = "";
      loginUrl.searchParams.set(
        "next",
        `${pathname}${search === "?" ? "" : search}`,
      );
      return NextResponse.redirect(loginUrl);
    }
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const dest = request.nextUrl.clone();
    dest.pathname = "/dashboard";
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  if (user && pathname === "/") {
    const dest = request.nextUrl.clone();
    dest.pathname = "/dashboard";
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  return supabaseResponse;
}
