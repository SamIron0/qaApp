const features = [
  {
    title: "250+ curated practice questions",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Instant answer feedback",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m9 12 2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Track your progress over time",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 3v18h18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M7 16l4-4 3 3 5-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function AuthBrandPanel() {
  return (
    <div className="relative hidden min-h-[100dvh] flex-1 overflow-hidden bg-[#0D0F1A] text-[#E8E4DC] lg:flex lg:min-h-0 lg:basis-[55%]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 50%),
            radial-gradient(circle at 1px 1px, rgba(201,168,76,0.12) 1px, transparent 0)
          `,
          backgroundSize: "100% 100%, 24px 24px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-12deg, transparent, transparent 11px, rgba(201,168,76,0.25) 11px, rgba(201,168,76,0.25) 12px)",
        }}
      />
      <span
        className="pointer-events-none absolute -right-8 top-1/2 select-none font-[family-name:var(--font-playfair)] text-[clamp(7rem,18vw,14rem)] font-semibold leading-none text-[#C9A84C]/[0.07]"
        aria-hidden
      >
        ?
      </span>

      <div className="relative z-10 flex w-full flex-col justify-between px-10 py-14 xl:px-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#C9A84C]/90">
            Practice Q&amp;A
          </p>
          <h2 className="mt-8 max-w-md font-[family-name:var(--font-playfair)] text-4xl font-semibold leading-[1.15] tracking-tight text-[#F5F0E6] xl:text-[2.75rem]">
            Prove what you know.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#B8B3A8]">
            A focused space for serious study — sharp questions, clear feedback, and the discipline
            of exam conditions.
          </p>
        </div>

        <ul className="mt-12 space-y-5">
          {features.map((f) => (
            <li
              key={f.title}
              className="flex items-center gap-4 text-sm text-[#D5D0C8]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C9A84C]/25 text-[#C9A84C]">
                {f.icon}
              </span>
              <span className="leading-snug">{f.title}</span>
            </li>
          ))}
        </ul>

        <p className="mt-12 font-[family-name:var(--font-playfair)] text-sm italic text-[#8A857A]">
          “Excellence is never an accident.”
        </p>
      </div>
    </div>
  );
}
