"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { FormSpinner } from "@/components/auth/FormSpinner";
import { mapAuthError } from "@/lib/auth-errors";
import { scorePassword } from "@/lib/password-strength";
import { createClient } from "@/utils/supabase/client";

const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#1A1A2E] shadow-sm transition-[border-color,box-shadow] placeholder:text-[#8A8A9A] focus:outline-none focus:ring-2";

function fullNameError(v: string) {
  if (!v.trim()) return "Full name is required.";
  return undefined;
}

function emailError(v: string) {
  if (!v.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
  return undefined;
}

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

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const strength = useMemo(() => scorePassword(password), [password]);

  return (
    <AuthShell
      title="Create your account"
      description="Join thousands of students sharpening their edge."
    >
      <div className="auth-stagger space-y-5">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const errs: Record<string, string | undefined> = {
              fullName: fullNameError(fullName),
              email: emailError(email),
              password: passwordError(password),
              confirm: confirmError(password, confirm),
            };
            setFieldErrors(errs);
            if (errs.fullName || errs.email || errs.password || errs.confirm) return;

            setLoading(true);
            setFormError(null);
            const supabase = createClient();
            const { data, error } = await supabase.auth.signUp({
              email: email.trim(),
              password,
              options: {
                data: { full_name: fullName.trim() },
                emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/")}`,
              },
            });

            if (error) {
              setLoading(false);
              setFormError(mapAuthError(error));
              return;
            }

            if (data.session) {
              await supabase.auth.signOut();
            }

            try {
              sessionStorage.setItem("pendingVerificationEmail", email.trim());
            } catch {
              // ignore
            }

            setLoading(false);
            router.push("/verify-email");
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-[#1A1A2E]">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              value={fullName}
              onChange={(e) => {
                const v = e.target.value;
                setFullName(v);
                setFieldErrors((prev) => ({ ...prev, fullName: fullNameError(v) }));
                setFormError(null);
              }}
              className={`${inputBase} border-[#E2DDD5] focus:border-[#C9A84C] focus:ring-[#C9A84C]/25 ${
                fieldErrors.fullName ? "border-red-400/90 focus:border-red-400 focus:ring-red-200" : ""
              }`}
            />
            {fieldErrors.fullName ? (
              <p className="mt-1.5 text-xs text-red-700/90">{fieldErrors.fullName}</p>
            ) : null}
          </div>

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
                setFieldErrors((prev) => ({ ...prev, email: emailError(v) }));
                setFormError(null);
              }}
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
                    confirm: confirm ? confirmError(v, confirm) : undefined,
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
            <div className="mt-2 flex items-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    strength.score > i ? "bg-[#C9A84C]" : "bg-[#E2DDD5]"
                  }`}
                />
              ))}
              <span className="text-xs text-[#6B6B7A]">{strength.label}</span>
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
            disabled={loading || oauthLoading}
            className="btn-auth-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <FormSpinner /> : null}
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="relative py-1 text-center text-xs text-[#6B6B7A]">
          <span className="relative z-10 bg-[#FAFAF8] px-2">or</span>
          <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#E2DDD5]" />
        </div>

        <button
          type="button"
          onClick={async () => {
            setOauthLoading(true);
            setFormError(null);
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/")}`,
              },
            });
            setOauthLoading(false);
            if (error) setFormError(mapAuthError(error));
          }}
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
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#1A1A2E] underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
