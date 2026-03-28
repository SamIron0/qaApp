import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#FAFAF8] text-[#1A1A2E]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(26,26,46,0.08) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-sm font-semibold tracking-tight">Practice Q&amp;A</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-[#1A1A2E] transition-colors hover:bg-black/[0.04]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#1A1A2E] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2a2a44]"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col gap-12 px-6 pb-20 pt-10 sm:pt-16">
        <div className="max-w-2xl space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#8B7340]">
            Academic practice
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Master the material. Own the exam.
          </h1>
          <p className="text-lg leading-relaxed text-[#4A4A5C]">
            Curated multiple-choice questions with instant feedback — built for focused study sessions
            and the pace of real assessments.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/signup"
              className="btn-auth-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
            >
              Create free account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-[#E2DDD5] bg-white px-6 py-3 text-sm font-semibold text-[#1A1A2E] shadow-sm transition-colors hover:border-[#C9A84C]/50"
            >
              I already have an account
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { t: "250+ questions", d: "Organized for systematic review." },
            { t: "Instant feedback", d: "See correctness as you learn." },
            { t: "Session-ready UI", d: "Minimal noise, maximum focus." },
          ].map((item) => (
            <div
              key={item.t}
              className="rounded-2xl border border-[#E8E4DD] bg-white/80 p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-[#1A1A2E]">{item.t}</p>
              <p className="mt-2 text-sm text-[#6B6B7A]">{item.d}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
