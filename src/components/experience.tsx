"use client";

import { ExternalLink, Calendar } from "lucide-react";
import { useSiteContent } from "@/lib/use-content";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "Jan 2025 - Apr 2026", or "Jan 2025 - Present" while the role is open. */
function periodOf(start: string, end: string | null): string {
  const fmt = (d: string) => {
    const [y, m] = d.split("-").map(Number);
    return `${MONTHS[m - 1]} ${y}`;
  };
  return `${fmt(start)} - ${end ? fmt(end) : "Present"}`;
}

export function Experience() {
  const { content } = useSiteContent();
  const experiences = content.experience;

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="section px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="section-label">Experience</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
            Work Experience
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            3+ years building production EdTech software at LII Lab
          </p>
        </div>

        {/* Experience cards */}
        <div className="space-y-4">
            {experiences.map((exp) => {
              const current = exp.end_date === null;
              return (
              <div key={exp.id} className="relative">
                <div className="bento-card p-7 hover:border-zinc-600 transition-colors relative overflow-hidden">
                  <div className={`absolute left-0 top-6 bottom-6 w-0.5 bg-gradient-to-b ${current ? "from-emerald-500 to-teal-500" : "from-zinc-600 to-zinc-500"} rounded-full`} />
                  <div className="pl-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                        <h3 className="text-xl font-bold text-zinc-50">
                          {exp.role}
                        </h3>
                        {current && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                            Current
                          </span>
                        )}
                      </div>
                      <a
                        href={exp.company_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors group"
                      >
                        {exp.company}
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-zinc-700/50 shrink-0 self-start">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold tracking-wide">
                        {periodOf(exp.start_date, exp.end_date)}
                      </span>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
                    {exp.summary}
                  </p>

                  {/* Achievements */}
                  <ul className="space-y-2 mb-5">
                    {exp.bullets.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-zinc-400 text-sm"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500/70 rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Where the work lives */}
                  {exp.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {exp.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900/70 text-zinc-400 text-[11px] font-semibold hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
                        >
                          {l.label}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Tech */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800">
                    {exp.stack.map((tech) => (
                      <span key={tech} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                  </div>
                </div>
              </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
