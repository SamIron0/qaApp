import { AppHeader } from "./AppHeader";

export async function BrowseShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      <AppHeader />
      {children}
    </div>
  );
}
