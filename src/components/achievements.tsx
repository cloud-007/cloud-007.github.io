"use client";

import { Trophy, Award, Medal, Star, ExternalLink, Target } from "lucide-react";

const highlights = [
  {
    icon: Trophy,
    title: "ICPC Asia Dhaka Regional",
    detail: "51st place, Dhaka Regional 2020",
    sub: "87th / 1,700+ teams, Preliminary 2021",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Award,
    title: "National Hackathon 2023",
    detail: "Champion, LU CSE Carnival",
    sub: "Team: LU Ovream",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Medal,
    title: "LU TechStorm 4",
    detail: "Champion, Programming Contest 2021",
    sub: "Team Catapult",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  {
    icon: Star,
    title: "IEEEXtreme 16.0",
    detail: "Runner-up in Bangladesh (2022)",
    sub: "Global Rank 149 · Team: LazySquad",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

const cpStats = [
  { label: "Problems Solved", value: "2000+" },
  { label: "Contests", value: "300+" },
  { label: "CF Rating", value: "1603" },
  { label: "CC Rating", value: "1965" },
];

const onlineJudges = [
  { name: "Codeforces", handle: "cloud_007", url: "https://codeforces.com/profile/cloud_007" },
  { name: "CodeChef", handle: "cloud_007", url: "https://www.codechef.com/users/cloud_007" },
  { name: "LightOJ", handle: "cloud_007", url: "https://lightoj.com/user/cloud_007" },
  { name: "Toph", handle: "cloud_007", url: "https://toph.co/u/cloud_007" },
  { name: "StopStalk", handle: "cloud_007", url: "https://www.stopstalk.com/user/profile/cloud_007" },
  { name: "Vjudge", handle: "cloud_007", url: "https://vjudge.net/user/cloud_007" },
];

export function Achievements() {
  return (
    <section id="achievements" className="section px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="section-label">Competitive Programming</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
            Achievements
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            2000+ problems solved across online judges and 300+ contests
          </p>
        </div>

        {/* CP stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {cpStats.map((stat) => (
            <div
              key={stat.label}
              className="bento-card p-5 flex flex-col items-center justify-center text-center"
            >
              <div className="text-2xl font-extrabold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Achievement cards */}
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bento-card p-6 hover:border-zinc-600 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${item.bg} border ${item.border} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="text-zinc-100 font-semibold text-sm mb-1">
                      {item.title}
                    </h3>
                    <p className="text-zinc-300 text-sm font-medium">
                      {item.detail}
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Online judge profiles */}
        <div className="bento-card p-6 hover:border-zinc-600 transition-colors">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest">
                Online Judge Profiles
              </h3>
              <p className="text-zinc-500 text-xs mt-0.5">Handle: cloud_007</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {onlineJudges.map((judge) => (
              <a
                key={judge.name}
                href={judge.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group"
              >
                <div>
                  <div className="text-zinc-300 text-sm font-semibold">
                    {judge.name}
                  </div>
                  <div className="text-zinc-600 text-xs">{judge.handle}</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
