"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { FormSpinner } from "@/components/auth/FormSpinner";
import { mapAuthError } from "@/lib/auth-errors";
import { createClient } from "@/utils/supabase/client";

function readPendingEmail(): string {
  try {
    return sessionStorage.getItem("pendingVerificationEmail") ?? "";
  } catch {
    return "";
  }
}

function subscribePendingEmail(): () => void {
  return () => {};
}

export default function VerifyEmailPage() {
  const email = useSyncExternalStore(subscribePendingEmail, readPendingEmail, () => "");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      title="Verify your email"
      description="You’re one step away from full access."
    >
      <div className="auth-stagger space-y-6">
        <p className="text-sm leading-relaxed text-[#4A4A5C]">
          We sent a confirmation link to{" "}
          <span className="font-medium text-[#1A1A2E]">{email || "your inbox"}</span>. Open it to
          activate your account — the link will bring you straight to your dashboard.
        </p>

        {sent ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            Another email is on its way. Check your spam folder if you don’t see it.
          </p>
        ) : null}

        {formError ? (
          <p className="rounded-lg border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-900">
            {formError}
          </p>
        ) : null}

        <button
          type="button"
          disabled={loading || !email}
          onClick={async () => {
            if (!email) {
              setFormError("We couldn’t find your email. Return to sign up and try again.");
              return;
            }
            setLoading(true);
            setFormError(null);
            const supabase = createClient();
            const { error } = await supabase.auth.resend({
              type: "signup",
              email: email.trim(),
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`,
              },
            });
            setLoading(false);
            if (error) {
              setFormError(mapAuthError(error));
              return;
            }
            setSent(true);
          }}
          className="btn-auth-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <FormSpinner /> : null}
          {loading ? "Sending…" : "Resend verification email"}
        </button>

        <p className="text-center text-sm text-[#4A4A5C]">
          Wrong address?{" "}
          <Link href="/signup" className="font-semibold text-[#1A1A2E] underline-offset-2 hover:underline">
            Sign up again
          </Link>{" "}
          or{" "}
          <Link href="/login" className="font-semibold text-[#1A1A2E] underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
