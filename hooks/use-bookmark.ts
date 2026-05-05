"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BookmarkResponse } from "@/app/api/bookmarks/route";

type UseBookmarkOptions = {
  courseId: string;
  bankId: string;
  isAuthenticated: boolean;
  initialBookmarked?: boolean;
};

type UseBookmarkReturn = {
  bookmarked: boolean;
  loading: boolean;
  toggling: boolean;
  toggle: () => Promise<void>;
};

export function useBookmark({
  courseId,
  bankId,
  isAuthenticated,
  initialBookmarked,
}: UseBookmarkOptions): UseBookmarkReturn {
  const [bookmarked, setBookmarked] = useState(() => initialBookmarked ?? false);
  const [loading, setLoading] = useState(() => {
    if (!isAuthenticated) return false;
    if (typeof initialBookmarked === "boolean") return false;
    return true;
  });
  const [toggling, setToggling] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (typeof initialBookmarked === "boolean") {
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    fetch(`/api/bookmarks?courseId=${courseId}&bankId=${bankId}`, {
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: BookmarkResponse | null) => {
        if (data) setBookmarked(data.bookmarked);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => abortRef.current?.abort();
  }, [courseId, bankId, isAuthenticated, initialBookmarked]);

  const toggle = useCallback(async () => {
    if (!isAuthenticated || toggling) return;

    const previous = bookmarked;
    setBookmarked((b) => !b);
    setToggling(true);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, bankId }),
      });

      if (!res.ok) {
        setBookmarked(previous);
        return;
      }

      const data: BookmarkResponse = await res.json();
      setBookmarked(data.bookmarked);
    } catch {
      setBookmarked(previous);
    } finally {
      setToggling(false);
    }
  }, [isAuthenticated, toggling, bookmarked, courseId, bankId]);

  return { bookmarked, loading, toggling, toggle };
}