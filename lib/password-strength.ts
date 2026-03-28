export function scorePassword(password: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!password) {
    return { score: 0, label: "Too weak" };
  }

  let points = 0;
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
  if (/\d/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;

  const capped = Math.min(4, Math.max(0, Math.ceil(points * 0.7))) as 0 | 1 | 2 | 3 | 4;
  const labels: [string, string, string, string, string] = [
    "Too weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ];
  return { score: capped, label: labels[capped] };
}
