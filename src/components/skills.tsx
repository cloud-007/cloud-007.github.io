"use client";

import {
  Server,
  Cloud,
  Smartphone,
  Wrench,
  Brain,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import { useSiteContent } from "@/lib/use-content";

/* Presentation only. The database stores a key; a React component cannot be
   stored in Postgres, and an unknown key falls back rather than crashing. */
const ICONS: Record<string, LucideIcon> = {
  server: Server,
  cloud: Cloud,
  smartphone: Smartphone,
  wrench: Wrench,
  brain: Brain,
  flask: FlaskConical,
};

const ACCENTS: Record<string, { color: string; bg: string; border: string }> = {
  emerald: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  sky: {
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  violet: {
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  amber: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  zinc: {
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
  },
};

export function Skills() {
  const { content } = useSiteContent();
  const categories = content.skills.filter((s) => s.context === "site");

  if (categories.length === 0) return null;

  return (
    <section id="skills" className="section px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="section-label">Tech Stack</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
            Technical Skills
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            Tools and technologies I use to build scalable systems
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = ICONS[cat.icon ?? ""] ?? Wrench;
            const accent = ACCENTS[cat.accent] ?? ACCENTS.zinc;
            return (
              <div
                key={cat.id}
                className="bento-card p-6 hover:border-zinc-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-9 h-9 ${accent.bg} border ${accent.border} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${accent.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest">
                    {cat.group}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-zinc-900 text-zinc-400 text-xs font-medium rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
