"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { FormSpinner } from "@/components/auth/FormSpinner";
import { mapAuthError } from "@/lib/auth-errors";
import { createClient } from "@/utils/supabase/client";

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#1A1A2E] shadow-sm transition-[border-color,box-shadow] placeholder:text-[#8A8A9A] focus:outline-none focus:ring-2";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = useMemo(() => {
    const n = searchParams.get("next");
    if (n && n.startsWith("/")) return n;
    return "/";
  }, [searchParams]);

  const notice = searchParams.get("notice");
  const oauthError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const validateField = (name: "email" | "password", value: string) => {
    if (name === "email") {
      if (!value.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    }
    if (name === "password") {
      if (!value) return "Password is required.";
    }
    return undefined;
  };

  const handleEmailChange = (v: string) => {
    setEmail(v);
    setFieldErrors((prev) => ({ ...prev, email: validateField("email", v) }));
    setFormError(null);
  };

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    setFieldErrors((prev) => ({ ...prev, password: validateField("password", v) }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateField("email", email);
    const pErr = validateField("password", password);
    setFieldErrors({ email: eErr, password: pErr });
    if (eErr || pErr) return;

    setLoading(true);
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);

    if (error) {
      setFormError(mapAuthError(error));
      return;
    }

    router.replace(next);
    router.refresh();
  };

  const handleGoogle = async () => {
    setOauthLoading(true);
    setFormError(null);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setOauthLoading(false);
    if (error) setFormError(mapAuthError(error));
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue your practice session."
    >
      <div className="auth-stagger space-y-6">
        {notice === "password-reset" ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            Your password was updated. You can sign in with your new password.
          </p>
        ) : null}
        {oauthError === "auth_callback" ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
            We couldn&apos;t complete sign-in. Please try again or use email and password.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`${inputBase} border-[#E2DDD5] focus:border-[#C9A84C] focus:ring-[#C9A84C]/25 ${
                fieldErrors.email ? "border-red-400/90 focus:border-red-400 focus:ring-red-200" : ""
              }`}
            />
            {fieldErrors.email ? (
              <p className="mt-1.5 text-xs text-red-700/90">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-[#1A1A2E]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`${inputBase} border-[#E2DDD5] focus:border-[#C9A84C] focus:ring-[#C9A84C]/25 ${
                fieldErrors.password ? "border-red-400/90 focus:border-red-400 focus:ring-red-200" : ""
              }`}
            />
            {fieldErrors.password ? (
              <p className="mt-1.5 text-xs text-red-700/90">{fieldErrors.password}</p>
            ) : null}
          </div>

          {formError ? (
            <p className="rounded-lg border border-red-200 bg-red-50/80 px-3 py-2 text-sm text-red-900">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || oauthLoading}
            className="btn-auth-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <FormSpinner /> : null}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="relative py-1 text-center text-xs text-[#6B6B7A]">
          <span className="relative z-10 bg-[#FAFAF8] px-2">or</span>
          <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#E2DDD5]" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading || oauthLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E2DDD5] bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A2E] transition-colors hover:border-[#C9A84C]/60 hover:bg-[#FFFCF5] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {oauthLoading ? (
            <FormSpinner />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continue with Google
        </button>

        <p className="text-center text-sm text-[#4A4A5C]">
          <Link href="/forgot-password" className="font-medium text-[#8B7340] underline-offset-2 hover:underline">
            Forgot password?
          </Link>
        </p>

        <p className="text-center text-sm text-[#4A4A5C]">
          No account?{" "}
          <Link href="/signup" className="font-semibold text-[#1A1A2E] underline-offset-2 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
