"use client";

import { Users, Calendar } from "lucide-react";
import { useSiteContent } from "@/lib/use-content";

export function Volunteering() {
  const { content } = useSiteContent();
  const roles = content.volunteering;

  if (roles.length === 0) return null;

  return (
    <section id="volunteering" className="section px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="section-label">Community</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
            Volunteering
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            Community leadership and knowledge sharing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bento-card p-7 hover:border-zinc-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-zinc-50 font-bold text-base leading-tight">
                      {role.title}
                    </h3>
                    <p className="text-zinc-400 text-xs mt-1 leading-snug">
                      {role.org}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-zinc-700/50 shrink-0 self-start">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
                    {role.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-2">
                {role.bullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-zinc-400 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500/50 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
