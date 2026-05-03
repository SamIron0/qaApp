import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/utils/supabase/server";

import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let avatarUrl: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    const name = profile?.full_name?.trim();
    if (name) displayName = name;
    else if (user.email) displayName = user.email;
    avatarUrl = profile?.avatar_url?.trim() || null;
  }

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="relative flex h-8 shrink-0 items-center" aria-label="Quro home">
          <Image
            src="/logo-black.png"
            alt=""
            width={306}
            height={333}
            className="h-8 w-auto dark:hidden"
            priority
          />
          <Image
            src="/logo-white.png"
            alt=""
            width={306}
            height={333}
            className="hidden h-8 w-auto dark:block"
            priority
          />
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          {displayName ? (
            <UserMenu
              displayName={displayName}
              email={user?.email ?? null}
              avatarUrl={avatarUrl}
            />
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="rounded-full border border-zinc-300 bg-transparent px-3 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 sm:px-4 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800/80"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 sm:px-4 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
