"use client";

import { LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useMemo, useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";

function initialsFrom(name: string | null, email: string | null): string {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }
  const e = email?.trim();
  if (e && e.includes("@")) return e[0]!.toUpperCase();
  return "?";
}

type Props = {
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
};

export function UserMenu({ displayName, email, avatarUrl }: Props) {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const initials = useMemo(
    () => initialsFrom(displayName, email),
    [displayName, email],
  );

  const appearanceValue =
    theme === "light" || theme === "dark" ? theme : resolvedTheme ?? "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Open account menu"
        >
          <Avatar className="size-9 ring-2 ring-border/60">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="" className="object-cover" />
            ) : null}
            <AvatarFallback className="text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-semibold text-foreground">
            {displayName}
          </p>
          {email ? (
            <p className="truncate text-xs font-normal text-muted-foreground">
              {email}
            </p>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={appearanceValue}
          onValueChange={(v) => {
            if (v === "light" || v === "dark") setTheme(v);
          }}
        >
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={loading}
          onSelect={() => {
            void (async () => {
              setLoading(true);
              posthog.capture("user_logged_out");
              posthog.reset();
              const supabase = createClient();
              await supabase.auth.signOut();
              router.push("/");
              router.refresh();
            })();
          }}
        >
          <LogOut className="size-4" />
          {loading ? "Signing out…" : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
