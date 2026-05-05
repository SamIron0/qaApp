"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RatingsResponse } from "@/app/api/ratings/route";

type UseRatingOptions = {
    courseId: string;
    bankId: string;
    isAuthenticated: boolean;
    initialUserRating?: number | null;
    initialAverage?: number | null;
    initialCount?: number;
};

type UseRatingReturn = {
    userRating: number | null;
    average: number | null;
    count: number;
    loading: boolean;
    submitting: boolean;
    submitRating: (rating: number) => Promise<void>;
};

export function useRating({
    courseId,
    bankId,
    isAuthenticated,
    initialUserRating,
    initialAverage,
    initialCount,
}: UseRatingOptions): UseRatingReturn {
    const hasInitial =
        typeof initialUserRating !== "undefined" ||
        typeof initialAverage !== "undefined" ||
        typeof initialCount !== "undefined";

    const [state, setState] = useState<RatingsResponse>(() => ({
        userRating: initialUserRating ?? null,
        average: initialAverage ?? null,
        count: initialCount ?? 0,
    }));
    const [loading, setLoading] = useState(() => !hasInitial);
    const [submitting, setSubmitting] = useState(false);

    const abortRef = useRef<AbortController | null>(null);

    const fetchRatings = useCallback(async () => {
        abortRef.current?.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;

        try {
            const res = await fetch(
                `/api/ratings?courseId=${courseId}&bankId=${bankId}`,
                { signal: ctrl.signal },
            );
            if (!res.ok) return;
            const data: RatingsResponse = await res.json();
            setState(data);
        } catch {
            // aborted or network error — silently ignore
        } finally {
            setLoading(false);
        }
    }, [courseId, bankId]);

    useEffect(() => {
        if (hasInitial) return;
        fetchRatings();
        return () => abortRef.current?.abort();
    }, [fetchRatings, hasInitial]);

    const submitRating = useCallback(
        async (rating: number) => {
            if (!isAuthenticated || submitting) return;

            const previous = state;
            setState((prev) => {
                const wasRated = prev.userRating !== null;
                const prevTotal = (prev.average ?? 0) * prev.count;
                const newCount = wasRated ? prev.count : prev.count + 1;
                const newTotal = wasRated
                    ? prevTotal - (prev.userRating ?? 0) + rating
                    : prevTotal + rating;
                const newAverage =
                    newCount > 0
                        ? Math.round((newTotal / newCount) * 10) / 10
                        : null;

                return { userRating: rating, average: newAverage, count: newCount };
            });

            setSubmitting(true);
            try {
                const res = await fetch("/api/ratings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseId, bankId, rating }),
                });

                if (!res.ok) {
                    // Rollback on failure
                    setState(previous);
                    return;
                }

                // Sync with server truth
                const data: RatingsResponse = await res.json();
                setState(data);
            } catch {
                setState(previous);
            } finally {
                setSubmitting(false);
            }
        },
        [isAuthenticated, submitting, state, courseId, bankId],
    );

    return {
        ...state,
        loading,
        submitting,
        submitRating,
    };
}