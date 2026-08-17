import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteIdentity } from "@/lib/content";

/* Metadata is resolved at build time, so it cannot read the live database the
   way the page body does. It reads the snapshot instead, which is generated
   from that same database right before the build. That keeps one copy of the
   name, the role and the bio: hand-typing them here meant a SQL edit updated
   the visible page while the search snippet and the share card kept serving
   whatever was true at the last deploy. */
const { name, role, bio } = siteIdentity;
const title = `${name} | ${role}`;

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cloud-007.github.io"),
  title,
  description: bio,
  /* The title says "Product Engineer" because that is the accurate name for
     the work. "Software Engineer" and "Full-Stack AI Engineer" stay here so
     the page still answers the queries recruiters actually type. Keywords are
     the right place for the search-shaped variants; the title is not. */
  keywords: [
    "Product Engineer",
    "Software Engineer",
    "Full-Stack AI Engineer",
    "Full-Stack Engineer",
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
  authors: [{ name }],
  openGraph: {
    title,
    description: bio,
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
