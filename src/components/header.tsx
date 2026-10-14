"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeSelect } from "./theme-select";
import { useSiteContent } from "@/lib/use-content";

const navigation = [
  { name: "Work", href: "/#projects" },
  { name: "Experience", href: "/about#experience" },
  { name: "About", href: "/about#about" },
  { name: "Trail", href: "/trail" },
];

export function Header() {
  const { content } = useSiteContent();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);
  const active = (href: string) => href === "/trail" ? pathname === "/trail" :
    href === "/#projects" ? pathname === "/" || pathname.startsWith("/work/") :
    href === "/about#about" ? pathname === "/about" : false;
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <nav className="nav-shell" aria-label="Main navigation">
        <Link href="/" className="wordmark" aria-label={`${content.profile?.name ?? "Mazharul Islam"} home`}>
          <span aria-hidden="true">m.</span><span className="wordmark-name">Mazharul Islam</span>
        </Link>
        <div className="desktop-nav">
          {navigation.map((item) => <Link key={item.name} href={item.href} className={active(item.href) ? "nav-link is-active" : "nav-link"}>{item.name}</Link>)}
        </div>
        <div className="nav-actions">
          <ThemeSelect />
          <a className="nav-contact" href={`mailto:${content.profile?.email ?? "mie.mazharul@gmail.com"}`}>Let’s talk</a>
          <button className="menu-toggle" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileOpen && <div id="mobile-navigation" className="mobile-nav">
          {navigation.map((item) => <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)}>{item.name}</Link>)}
          <a href={`mailto:${content.profile?.email ?? "mie.mazharul@gmail.com"}`}>Let’s talk</a>
        </div>}
      </nav>
    </header>
  );
}
