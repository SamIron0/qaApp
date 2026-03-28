"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { FormSpinner } from "@/components/auth/FormSpinner";
import { createClient } from "@/utils/supabase/client";

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#1A1A2E] shadow-sm transition-[border-color,box-shadow] placeholder:text-[#8A8A9A] focus:outline-none focus:ring-2";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const validate = (v: string) => {
    if (!v.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
    return undefined;
  };

  return (
    <AuthShell
      title="Reset your password"
      description="We’ll email you a secure link to choose a new password."
    >
      <div className="auth-stagger space-y-6">
        {done ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <p className="font-medium">Check your email</p>
            <p className="mt-1 text-emerald-800/90">
              If an account exists for that address, you’ll receive a reset link shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const err = validate(email);
              setFieldError(err);
              if (err) return;

              setLoading(true);
              const supabase = createClient();
              await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
              });
              setLoading(false);
              setDone(true);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-[#1A1A2E]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmail(v);
                  setFieldError(validate(v));
                }}
                className={`${inputBase} border-[#E2DDD5] focus:border-[#C9A84C] focus:ring-[#C9A84C]/25 ${
                  fieldError ? "border-red-400/90 focus:border-red-400 focus:ring-red-200" : ""
                }`}
              />
              {fieldError ? <p className="mt-1.5 text-xs text-red-700/90">{fieldError}</p> : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-auth-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <FormSpinner /> : null}
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-[#4A4A5C]">
          <Link href="/login" className="font-semibold text-[#1A1A2E] underline-offset-2 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
