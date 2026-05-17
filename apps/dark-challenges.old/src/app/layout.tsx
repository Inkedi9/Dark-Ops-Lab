import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DarkChallenges: Exploit ur Code",
  description: "Exploit and Solve Missions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="relative min-h-full bg-[#05070A] text-slate-100 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}