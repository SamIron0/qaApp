import { Suspense } from "react";

import { AuthShell } from "@/components/auth/AuthShell";

import { LoginForm } from "./login-form";

function LoginFallback() {
  return (
    <AuthShell title="Welcome back" description="Sign in to continue your practice session.">
      <div className="flex min-h-[240px] items-center justify-center text-sm text-[#6B6B7A]">
        Loading…
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
