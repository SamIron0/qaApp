"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/** Matches previous app default (`dark`) before `next-themes` hydrates. */
export function useResolvedDark(): boolean {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return true;
  return resolvedTheme === "dark";
}
