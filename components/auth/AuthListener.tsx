"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { createClient } from "@/utils/supabase/client";

export function AuthListener() {
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === "SIGNED_IN" && session?.user) {
                    posthog.identify(session.user.id, {
                        email: session.user.email,
                        name: session.user.user_metadata?.full_name,
                    });

                    const provider = session.user.app_metadata?.provider;
                    posthog.capture("user_logged_in", {
                        method: provider === "google" ? "google" : "email",
                    });
                }

                if (event === "SIGNED_OUT") {
                    posthog.reset();
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return null;
}