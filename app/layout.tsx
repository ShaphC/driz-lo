import type { Metadata } from "next";

import AnalyticsConsent from "@/components/AnalyticsConsent";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://drizlo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Drizlo — Focus Feels Different Here",
    template: "%s | Drizlo",
  },

  description:
    "Make focus time feel different. Drizlo is a cozy, animated focus timer with relaxing coffee and tea scenes, customizable sessions, and gentle breaks.",

  applicationName: "Drizlo",

  keywords: [
    "Drizlo",
    "focus timer",
    "cozy focus timer",
    "Pomodoro timer",
    "animated timer",
    "study timer",
    "productivity timer",
    "coffee timer",
    "tea timer",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Drizlo",
    title: "Drizlo — Focus Feels Different Here",
    description:
      "A cozy, animated focus timer. Watch coffee brew, tea steep, and your progress unfold.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Drizlo — Focus Feels Different Here",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Drizlo — Focus Feels Different Here",
    description: "A cozy, animated focus timer with coffee and tea scenes.",
    images: ["/opengraph-image.png"],
  },
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
