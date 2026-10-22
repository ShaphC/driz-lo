import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drizzlo — Make Time Feel Beautiful",
  description:
    "A cozy, animated focus timer where coffee brews, tea steeps, and every minute becomes something beautiful.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
