"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Menu, X } from "lucide-react";

const navigation = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Achievements", href: "#achievements" },
  { name: "Gallery", href: "#gallery" },
  { name: "Education", href: "#education" },
];

export function Header() {
  const [activeSection, setActiveSection] = useState("about");
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

    navigation.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
            cloud_007
            <span className="text-emerald-400">{"/>"}</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-0.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-2.5 py-1.5 text-sm rounded-xl transition-all font-medium ${
                  activeSection === item.href.slice(1)
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
                  activeSection === item.href.slice(1)
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
