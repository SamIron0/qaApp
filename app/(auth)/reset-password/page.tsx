"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { FormSpinner } from "@/components/auth/FormSpinner";
import { mapAuthError } from "@/lib/auth-errors";
import { createClient } from "@/utils/supabase/client";

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#1A1A2E] shadow-sm transition-[border-color,box-shadow] placeholder:text-[#8A8A9A] focus:outline-none focus:ring-2";

function passwordError(v: string) {
  if (!v) return "Password is required.";
  if (v.length < 8) return "Use at least 8 characters.";
  return undefined;
}

function confirmError(pw: string, cf: string) {
  if (!cf) return "Confirm your password.";
  if (cf !== pw) return "Passwords do not match.";
  return undefined;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    void supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setReady(!!session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthShell
      title="Choose a new password"
      description="Use a strong password you haven’t used elsewhere."
    >
      <div className="auth-stagger space-y-6">
        {!ready ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            Checking your reset link… If this page doesn’t update, open the link from your email again
            or request a new reset from{" "}
            <Link href="/forgot-password" className="font-medium underline">
              forgot password
            </Link>
            .
          </p>
        ) : null}

        {ready ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const errs = {
                password: passwordError(password),
                confirm: confirmError(password, confirm),
              };
              setFieldErrors(errs);
              if (errs.password || errs.confirm) return;

              setLoading(true);
              setFormError(null);
              const supabase = createClient();
              const { error } = await supabase.auth.updateUser({ password });
              setLoading(false);

              if (error) {
                setFormError(mapAuthError(error));
                return;
              }

              await supabase.auth.signOut();
              router.replace("/login?notice=password-reset");
              router.refresh();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-[#1A1A2E]">
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPassword(v);
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: passwordError(v),
                      confirm: confirm.length ? confirmError(v, confirm) : prev.confirm,
                    }));
                    setFormError(null);
                  }}
                  className={`${inputBase} border-[#E2DDD5] pr-11 focus:border-[#C9A84C] focus:ring-[#C9A84C]/25 ${
                    fieldErrors.password ? "border-red-400/90 focus:border-red-400 focus:ring-red-200" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-[#6B6B7A] hover:text-[#1A1A2E]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {fieldErrors.password ? (
                <p className="mt-1.5 text-xs text-red-700/90">{fieldErrors.password}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-xs font-medium text-[#1A1A2E]">
                Confirm password
              </label>
              <input
                id="confirm"
                name="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => {
                  const v = e.target.value;
                  setConfirm(v);
                  setFieldErrors((prev) => ({ ...prev, confirm: confirmError(password, v) }));
                  setFormError(null);
                }}
                className={`${inputBase} border-[#E2DDD5] focus:border-[#C9A84C] focus:ring-[#C9A84C]/25 ${
                  fieldErrors.confirm ? "border-red-400/90 focus:border-red-400 focus:ring-red-200" : ""
                }`}
              />
              {fieldErrors.confirm ? (
                <p className="mt-1.5 text-xs text-red-700/90">{fieldErrors.confirm}</p>
              ) : null}
            </div>

            {formError ? (
              <p className="rounded-lg border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-900">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="btn-auth-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <FormSpinner /> : null}
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        ) : null}

        <p className="text-center text-sm text-[#4A4A5C]">
          <Link href="/login" className="font-semibold text-[#1A1A2E] underline-offset-2 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
