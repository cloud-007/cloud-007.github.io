import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cloud-007.github.io"),
  title: "Mazharul Islam | Full-Stack AI Engineer",
  description:
    "Full-Stack AI Engineer with 3+ years in software engineering. Builds scalable backends, cross-platform mobile apps, and AI-powered SaaS platforms with Django, Flutter, and Next.js.",
  keywords: [
    "Full-Stack AI Engineer",
    "Software Engineer",
    "Django",
    "Flutter",
    "Python",
    "Backend Developer",
    "EdTech",
    "AI",
    "Competitive Programming",
    "Claude Code",
    "Cursor",
    "AI-Assisted Development",
    "QTI",
    "multi-tenant",
    "speech recognition",
    "NLP",
    "Open to Work",
    "AI scoring",
  ],
  authors: [{ name: "Md Mazharul Islam Emon" }],
  openGraph: {
    title: "Mazharul Islam | Full-Stack AI Engineer",
    description:
      "Full-Stack AI Engineer with 3+ years in software engineering. Builds scalable backends, cross-platform mobile apps, and AI-powered SaaS platforms with Django, Flutter, and Next.js.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
