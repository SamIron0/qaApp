"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dark = !mounted ? true : resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border/80 bg-muted/70 p-0.5 shadow-inner transition-colors",
        "outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute top-0.5 left-0.5 flex size-7 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border/50 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          dark ? "translate-x-0" : "translate-x-6",
        )}
      >
        {dark ? (
          <Moon className="size-3.5 text-foreground" strokeWidth={2} aria-hidden />
        ) : (
          <Sun className="size-3.5 text-amber-500" strokeWidth={2} aria-hidden />
        )}
      </span>
      <span className="flex w-full items-center justify-between px-1.5" aria-hidden>
        <Sun
          className={cn("size-3 transition-opacity", dark ? "opacity-40" : "opacity-0")}
          strokeWidth={2}
        />
        <Moon className="size-3 opacity-0" strokeWidth={2} />
      </span>
    </button>
  );
}
