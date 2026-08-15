import type { Metadata } from "next";

// Unlisted academic CV route. Not linked from anywhere in the site and explicitly
// excluded from search-engine indexing; reachable only by typing the URL directly.
export const metadata: Metadata = {
  title: "Md Mazharul Islam Emon | Curriculum Vitae",
  description: "Academic curriculum vitae.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function ResumeProfessionalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
