import type { ReactNode } from "react";

import { AuthBrandPanel } from "./AuthBrandPanel";

type AuthShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FAFAF8] lg:flex-row">
      <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:basis-[45%] lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A2E]">{title}</h1>
          {description ? (
            <p className="mt-2 text-sm text-[#4A4A5C]">{description}</p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <AuthBrandPanel />
    </div>
  );
}
