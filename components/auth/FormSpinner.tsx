export function FormSpinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#1A1A2E]/30 border-t-[#C9A84C] ${className}`}
      aria-hidden
    />
  );
}
