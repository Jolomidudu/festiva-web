import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Festyvibe — Celebrate beautifully",
  description: "Wedding and event management made beautiful.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}