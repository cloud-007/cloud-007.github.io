"use client";

import { Github, ArrowUpRight, ExternalLink, Clock } from "lucide-react";
import { useSiteContent } from "@/lib/use-content";
import { TEASER_LINE, safeHref, type Project } from "@/lib/content";

/* Accent stripe per category, so the three groups read as three groups
   without needing a colour column in the database. */
const ACCENT: Record<Project["category"], string> = {
  professional: "from-emerald-500 to-teal-500",
  client: "from-sky-500 to-blue-500",
  personal: "from-violet-500 to-fuchsia-500",
};

const GROUPS: { key: Project["category"]; label: string }[] = [
  { key: "professional", label: "Professional" },
  { key: "client", label: "Client" },
  { key: "personal", label: "Personal" },
];

function FullWidthCard({ project }: { project: Project }) {
  return (
    <div className="bento-card p-7 hover:border-zinc-600 transition-colors relative overflow-hidden">
      <div
        className={`absolute left-0 top-6 bottom-6 w-0.5 bg-gradient-to-b ${ACCENT[project.category]} rounded-full`}
      />
      <div className="pl-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h3 className="text-xl font-bold text-zinc-50">{project.name}</h3>

              {project.teaser && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  Soon
                </span>
              )}

              {safeHref(project.live_url) && (
                <a
                  href={safeHref(project.live_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                >
                  Live
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {safeHref(project.repo_url) && (
                <a
                  href={safeHref(project.repo_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 text-xs font-medium hover:bg-zinc-700 transition-colors"
                >
                  GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            {project.tagline && (
              <p className="text-emerald-400 text-xs font-medium">
                {project.tagline}
              </p>
            )}
          </div>

          {project.period && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-zinc-500 text-xs bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-zinc-700/50">
                {project.period}
              </span>
            </div>
          )}
        </div>

        {project.teaser ? (
          <p className="flex items-center gap-2 text-zinc-500 text-sm italic">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {TEASER_LINE}
          </p>
        ) : (
          <>
            {project.description && (
              <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                {project.description}
              </p>
            )}

            {project.highlights.length > 0 && (
              <ul className="space-y-2 mb-5">
                {project.highlights.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-zinc-400 text-sm"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500/70 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function Projects() {
  const { content } = useSiteContent();
  const { projects, profile } = content;

  if (projects.length === 0) return null;

  const github =
    profile?.socials.find((s) => s.label === "GitHub")?.href ??
    "https://github.com/cloud-007";
  const githubHandle = github.replace(/^https?:\/\//, "");

  return (
    <section id="projects" className="section px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="section-label">Work and Projects</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
            Projects
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            Production platforms, client work, and personal side projects
          </p>
        </div>

        {GROUPS.map(({ key, label }) => {
          const group = projects.filter((p) => p.category === key);
          if (group.length === 0) return null;
          return (
            <div key={key} className="mb-8">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4">
                {label}
              </p>
              <div className="space-y-4">
                {group.map((project) => (
                  <FullWidthCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          );
        })}

        {/* GitHub CTA */}
        <div className="mt-4 bento-card p-5 flex items-center justify-between hover:border-zinc-600 transition-colors">
          <div>
            <p className="text-zinc-300 text-sm font-medium">More on GitHub</p>
            <p className="text-zinc-500 text-xs mt-0.5">
              Explore all repositories and open-source contributions
            </p>
          </div>
          <a
            href={safeHref(github)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl border border-zinc-700 transition-all group"
          >
            <Github className="w-4 h-4" />
            {githubHandle}
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
}
