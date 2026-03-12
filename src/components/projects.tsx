"use client";

import { Github, ArrowUpRight } from "lucide-react";

const projects = [
  {
    name: "Projecto",
    tagline: "Django-based Project Management System",
    period: "Oct 2022 — Dec 2022",
    description:
      "A university project management system for handling and evaluating academic projects with real-time notifications.",
    bullets: [
      "Built with Django, AJAX, jQuery, and Bootstrap for a responsive, dynamic UI",
      "Integrated Gmail notifications for task-related updates",
      "Added a background job service to handle async processing",
    ],
    technologies: ["Django", "Python", "AJAX", "jQuery", "Bootstrap", "PostgreSQL"],
    githubUrl: "https://github.com/cloud-007",
  },
  {
    name: "Reachout",
    tagline: "Flutter-based Consultation MVP",
    period: "Oct 2023 — Oct 2023",
    description:
      "A Flutter MVP connecting users with consultants, featuring real-time chat and professional profiles.",
    bullets: [
      "Built Google Sign-In and chat-related features end-to-end",
      "Applied Clean Architecture and Riverpod for a scalable, testable codebase",
      "Delivered a fully working MVP within the target timeframe",
    ],
    technologies: ["Flutter", "Dart", "Firebase", "Riverpod", "Clean Architecture"],
    githubUrl: "https://github.com/cloud-007",
  },
];

export function Projects() {
  return (
    <section id="projects" className="section px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="section-label">Personal Work</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
            Projects
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            Side projects built to explore ideas and sharpen skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bento-card p-7 flex flex-col hover:border-zinc-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-zinc-50 font-bold text-lg">{project.name}</h3>
                  <p className="text-emerald-400 text-xs font-medium mt-0.5">
                    {project.tagline}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-zinc-600 text-xs">{project.period}</span>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center hover:bg-zinc-700 hover:border-zinc-600 transition-all group"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4 text-zinc-400 group-hover:text-zinc-100 transition-colors" />
                  </a>
                </div>
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                {project.description}
              </p>

              <ul className="space-y-2 mb-5 flex-1">
                {project.bullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-zinc-500 text-xs">
                    <span className="mt-1.5 w-1 h-1 bg-zinc-600 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Tech */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="mt-4 bento-card p-5 flex items-center justify-between hover:border-zinc-600 transition-colors">
          <div>
            <p className="text-zinc-300 text-sm font-medium">More on GitHub</p>
            <p className="text-zinc-500 text-xs mt-0.5">
              Explore all repositories and open-source contributions
            </p>
          </div>
          <a
            href="https://github.com/cloud-007"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl border border-zinc-700 transition-all group"
          >
            <Github className="w-4 h-4" />
            github.com/cloud-007
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
}
