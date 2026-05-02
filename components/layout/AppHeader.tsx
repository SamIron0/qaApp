import Link from "next/link";

import { createClient } from "@/utils/supabase/server";

import { SignOutButton } from "./SignOutButton";

export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    const name = profile?.full_name?.trim();
    if (name) displayName = name;
    else if (user.email) displayName = user.email;
  }

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Quro
        </Link>
        {displayName ? (
          <div className="flex items-center gap-3">
            <span className="max-w-[200px] truncate text-sm text-zinc-600 dark:text-zinc-400">
              {displayName}
            </span>
            <SignOutButton />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-zinc-300 bg-transparent px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800/80"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
