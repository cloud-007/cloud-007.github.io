"use client";

import { Trophy, ExternalLink } from "lucide-react";
import { useSiteContent } from "@/lib/use-content";
import { formatEntryRange } from "@/lib/content";

/* Rotating accents so a growing list of wins never looks monotonous, and so
   adding a win in Supabase needs no colour decision from you. */
const ACCENTS = [
  "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "text-sky-400 bg-sky-500/10 border-sky-500/20",
  "text-violet-400 bg-violet-500/10 border-violet-500/20",
];

export function Achievements() {
  const { content } = useSiteContent();

  /* The wins are not a second copy of the trail: they ARE the trail, filtered
     to the entries that demonstrate `won`. Add a win to the timeline and it
     shows up here without touching this file. */
  const wins = content.entries
    .filter((e) => !e.teaser && e.traits.includes("won"))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const cpStats = content.stats.filter((s) => s.context === "competitive");
  const judges = content.judges;

  if (wins.length === 0 && cpStats.length === 0) return null;

  return (
    <section id="achievements" className="section px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="section-label">Track Record</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
            Achievements
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            {wins.length} wins across contests, hackathons and community work
          </p>
        </div>

        {/* CP stats */}
        {cpStats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {cpStats.map((stat) => (
              <div key={stat.id} className="bento-card p-5 text-center">
                <div className="text-2xl font-extrabold gradient-text">
                  {stat.value}
                </div>
                <div className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wins, straight from the trail */}
        <div className="grid md:grid-cols-2 gap-3">
          {wins.map((win, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const [color, bg, border] = accent.split(" ");
            return (
              <div
                key={win.id || win.slug}
                className="bento-card p-6 hover:border-zinc-600 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 ${bg} border ${border} rounded-xl flex items-center justify-center shrink-0`}
                  >
                    <Trophy className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-zinc-50 font-bold text-base leading-snug">
                      {win.title}
                    </h3>
                    {win.outcome && (
                      <p className={`text-sm font-semibold mt-1 ${color}`}>
                        {win.outcome}
                      </p>
                    )}
                    <p className="text-zinc-500 text-xs mt-1.5">
                      {win.org && `${win.org} · `}
                      {formatEntryRange(win)}
                    </p>
                    {win.teammates.length > 0 && (
                      <p className="text-zinc-600 text-xs mt-1">
                        {win.teammates.join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Online judges */}
        {judges.length > 0 && (
          <div className="bento-card p-6 mt-3">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-4">
              Online judges
            </h3>
            <div className="flex flex-wrap gap-2">
              {judges.map((j) => (
                <a
                  key={j.id}
                  href={j.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-colors"
                >
                  <span className="font-semibold text-zinc-300">{j.name}</span>
                  <span className="text-zinc-600">{j.handle}</span>
                  {j.rating && (
                    <span className="text-emerald-400 font-semibold">
                      {j.rating}
                    </span>
                  )}
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
