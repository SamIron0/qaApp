export default function BankRouteLoading() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
          <div className="h-8 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg space-y-6">
          <div className="space-y-3">
            <div className="h-3 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-9 max-w-sm animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-32 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </main>
    </div>
  );
}
