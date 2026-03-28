import { DM_Sans, Playfair_Display } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${dmSans.className} ${dmSans.variable} ${playfair.variable} min-h-[100dvh] antialiased`}
    >
      {children}
    </div>
  );
}
