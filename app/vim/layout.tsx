import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vim Mode - HDU Wiki",
};

export default function VimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geistMono.variable} fixed inset-0 z-50 bg-[#1a1b26] text-[#c0caf5]`} style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "13px", lineHeight: "1.6" }}>
      {children}
    </div>
  );
}
