import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Mazharul Islam — Senior Software Engineer",
  description:
    "Senior Software Engineer with 3+ years building scalable EdTech platforms. Expert in Django, Flutter, and AI-driven backend systems.",
  keywords: [
    "Software Engineer",
    "Django",
    "Flutter",
    "Python",
    "Backend Developer",
    "EdTech",
    "AI",
    "Competitive Programming",
  ],
  authors: [{ name: "Md Mazharul Islam Emon" }],
  openGraph: {
    title: "Mazharul Islam — Senior Software Engineer",
    description:
      "Senior Software Engineer with 3+ years building scalable EdTech platforms",
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
