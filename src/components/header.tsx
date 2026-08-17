"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, X } from "lucide-react";
import { useSiteContent } from "@/lib/use-content";

/* Trail lives on the landing page; every other section lives under /about.
   Hash links work from either page. */
const navigation = [
  { name: "Trail", href: "/", section: "trail" },
  { name: "About", href: "/about#about", section: "about" },
  { name: "Experience", href: "/about#experience", section: "experience" },
  { name: "Skills", href: "/about#skills", section: "skills" },
  { name: "Projects", href: "/about#projects", section: "projects" },
  { name: "Achievements", href: "/about#achievements", section: "achievements" },
  { name: "Education", href: "/about#education", section: "education" },
];

export function Header() {
  const { content } = useSiteContent();
  const handle = content.profile?.handle ?? "";

  const pathname = usePathname();
  const onTrailPage = pathname === "/";
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    navigation.forEach(({ section }) => {
      const el = document.getElementById(section);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const isActive = (item: (typeof navigation)[number]) =>
    onTrailPage ? item.section === "trail" : activeSection === item.section;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="max-w-4xl mx-auto">
        {/* Main nav bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl">
          <Link
            href="/"
            className="text-sm font-bold text-zinc-100 hover:text-emerald-400 transition-colors tracking-tight"
          >
            <span className="text-emerald-400">{"<"}</span>
            {handle}
            <span className="text-emerald-400">{"/>"}</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-0.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-2.5 py-1.5 text-sm rounded-xl transition-all font-medium ${
                  isActive(item)
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="mailto:mie.mazharul@gmail.com"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact
            </a>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 rounded-xl hover:bg-zinc-800 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="mt-2 p-3 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm rounded-xl transition-all ${
                  isActive(item)
                    ? "bg-emerald-500/15 text-emerald-300 font-medium"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="mailto:mie.mazharul@gmail.com"
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl mt-1 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Mail className="w-3.5 h-3.5" />
              Contact Me
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
