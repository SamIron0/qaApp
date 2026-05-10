export default function CourseBanksLoading() {
  return (
    <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
          <div className="h-8 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-10 h-4 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mb-8 space-y-3">
          <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 max-w-md animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="mb-4 h-3 w-36 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <ul className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50"
            />
          ))}
        </ul>
      </main>
    </div>
  );
}
