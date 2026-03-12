"use client";

import { Server, Cloud, Smartphone, Wrench } from "lucide-react";

const categories = [
  {
    label: "Backend",
    icon: Server,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    skills: [
      "Django",
      "Django REST Framework",
      "Python",
      "PostgreSQL",
      "Redis",
      "Celery",
      "REST APIs",
      "Query Optimization",
      "Caching",
    ],
  },
  {
    label: "Frontend & Mobile",
    icon: Smartphone,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    skills: ["Flutter", "Firebase", "Next.js", "React.js"],
  },
  {
    label: "Engineering",
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    skills: [
      "Technical Leadership",
      "System Design",
      "Code Review",
      "Requirement Analysis",
      "Product Development",
    ],
  },
  {
    label: "Infrastructure",
    icon: Cloud,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    skills: ["Docker", "Nginx", "GCP", "DigitalOcean", "CI/CD"],
  },
];

export function Skills() {
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
            const Icon = cat.icon;
            return (
              <div key={cat.label} className="bento-card p-6 hover:border-zinc-600 transition-colors">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-9 h-9 ${cat.bg} border ${cat.border} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${cat.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest">
                    {cat.label}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-zinc-900 text-zinc-400 text-xs font-medium rounded-lg border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200 transition-all cursor-default"
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
