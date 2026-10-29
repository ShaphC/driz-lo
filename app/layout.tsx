import type { Metadata } from "next";

import AnalyticsConsent from "@/components/AnalyticsConsent";

import "./globals.css";

export const metadata: Metadata = {
  title: "Drizlo — Focus Feels Different Here",
  description:
    "Drizlo is a visual focus timer with animated scenes that evolve as you work. Watch coffee brew, tea steep, and your progress unfold.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
