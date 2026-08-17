"use client";

import { Github, Linkedin, Mail, ArrowUpRight, type LucideIcon } from "lucide-react";
import { useSiteContent } from "@/lib/use-content";
import { safeHref } from "@/lib/content";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};

export function Footer() {
  const { content } = useSiteContent();
  const profile = content.profile;

  return (
    <footer className="border-t border-zinc-800 py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} {profile?.name}
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            Built with Next.js · TypeScript · Tailwind CSS
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(profile?.socials ?? []).map((social) => {
            const Icon = SOCIAL_ICONS[social.label] ?? ArrowUpRight;
            return (
              <a
                key={social.label}
                href={safeHref(social.href) ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 hover:text-emerald-400 hover:border-zinc-600 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
