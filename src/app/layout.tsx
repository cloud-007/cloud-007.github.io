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
  title: "Mazharul Islam — Senior Software Engineer",
  description:
    "Senior Software Engineer — Django, Flutter, AI-powered systems. 3+ years building production EdTech platforms with 93+ mobile releases.",
  keywords: [
    "Software Engineer",
    "Django",
    "Flutter",
    "Python",
    "Backend Developer",
    "EdTech",
    "AI",
    "Competitive Programming",
    "FastAPI",
    "QTI",
    "multi-tenant",
    "speech recognition",
    "NLP",
    "Prometheus",
    "Open to Work",
    "AI scoring",
  ],
  authors: [{ name: "Md Mazharul Islam Emon" }],
  openGraph: {
    title: "Mazharul Islam — Senior Software Engineer",
    description:
      "Senior Software Engineer — Django, Flutter, AI-powered systems. 3+ years building production EdTech platforms with 93+ mobile releases.",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Mazharul Islam — Senior Software Engineer",
      },
    ],
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
