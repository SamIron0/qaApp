"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import posthog from "posthog-js";

import { createClient } from "@/utils/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        posthog.capture("user_logged_out");
        posthog.reset();
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
