"use client";

import { ExternalLink, Calendar } from "lucide-react";

const experiences = [
  {
    title: "Senior Software Engineer",
    company: "LII Lab",
    companyUrl: "https://www.liilab.com/",
    period: "Jan 2025 — Present",
    current: true,
    description:
      "Leading backend engineering and product development across two AI-powered English test preparation platforms, from system design and architecture reviews to mentoring engineers and shipping production features.",
    achievements: [
      "Architected a multi-tenant SaaS platform supporting complete data isolation per organization, domain-based tenant routing, and per-tenant scoring configuration and feature flags",
      "Designed a QTI 3.0-compliant exam engine for IELTS Academic and General modules, supporting 100+ question types with automated IELTS band-score normalization per section using a strategy-pattern scorer",
      "Built a real-time speech evaluation pipeline that processes spoken submissions end-to-end in under 15 seconds, integrating Speech Recognition, Pronunciation Assessment, and NLP Processing to deliver automated scores",
      "Engineered a multi-gateway payment infrastructure supporting 5 providers with subscription lifecycle management, webhook idempotency, product entitlement enforcement, and campaign-based promotional pricing",
      "Designed and built the internal Studio API layer for the moderator platform, covering content authoring (question bank, exam templates), expert evaluation queue, exam rejudge pipelines, and KPI analytics endpoints for subscription metrics, user practice activity, and engagement data",
      "Set up a production observability stack with infrastructure health monitoring, per-API latency instrumentation, and external service tracking with alerting",
      "Mentored junior engineers through code reviews, PR feedback, and technical walkthroughs; collaborated with product stakeholders on requirement definition, feature scoping, and architectural trade-offs",
    ],
    technologies: [
      "Django",
      "DRF",
      "FastAPI",
      "Python",
      "PostgreSQL",
      "Redis",
      "Celery",
      "QTI 3.0",
      "Multi-tenancy",
      "Speech Recognition",
      "NLP Processing",
      "Docker",
      "GCP",
      "CI/CD",
      "Next.js",
      "TypeScript",
    ],
  },
  {
    title: "Software Engineer",
    company: "LII Lab",
    companyUrl: "https://www.liilab.com/",
    period: "Nov 2022 — Dec 2024",
    current: false,
    description:
      "Full-stack ownership of OnePTE, designing and shipping the Flutter app from day one to a multi-brand cross-platform product, and building the Django backend powering AI scoring, exam management, and billing.",
    achievements: [
      "Designed and built the Flutter application from scratch, covering all four modules (Speaking, Writing, Reading, and Listening) with 20+ task types, interactive answer widgets, timer management, and audio recording",
      "Built a task-group-based mock test engine with modular exam templates, configurable time allocations per task, automated question progression, and multi-dimensional score breakdowns per submission",
      "Engineered the AI scoring backend for spoken and written PTE tasks using Speech Recognition, Pronunciation Assessment, and NLP Processing for automated multi-trait evaluation across all modules",
      "Integrated subscription billing across 4 platforms (Stripe, SSLCommerz, Google Play Billing, Apple App Store) with real-time webhook handling, transaction deduplication, in-app purchase verification, and campaign-based promotional offers",
      "Built the Django admin and private API layer for content moderation, question bank and exam management, subscription analytics with regional reporting, exam rejudge system, and user acquisition dashboards integrating Google Analytics Data API",
      "Wrote test suites covering auth, question bank, mock test, and billing domain layers; maintained CI/CD pipelines across Android, iOS, and Web release channels",
    ],
    technologies: [
      "Flutter",
      "Dart",
      "Riverpod",
      "GoRouter",
      "Freezed",
      "Django",
      "DRF",
      "Python",
      "PostgreSQL",
      "Redis",
      "Celery",
      "Speech Recognition",
      "NLP Processing",
      "Firebase",
      "FCM",
      "pytest",
      "TypeScript",
      "Next.js",
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className="section px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="section-label">Professional Journey</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
            Work Experience
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            3+ years building production EdTech software at LII Lab
          </p>
        </div>

        {/* Experience cards */}
        <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={index} className="relative">
                <div className="bento-card p-7 hover:border-zinc-600 transition-colors relative overflow-hidden">
                  <div className={`absolute left-0 top-6 bottom-6 w-0.5 bg-gradient-to-b ${exp.current ? "from-emerald-500 to-teal-500" : "from-zinc-600 to-zinc-500"} rounded-full`} />
                  <div className="pl-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                        <h3 className="text-xl font-bold text-zinc-50">
                          {exp.title}
                        </h3>
                        {exp.current && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                            Current
                          </span>
                        )}
                      </div>
                      <a
                        href={exp.companyUrl}
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
                        {exp.period}
                      </span>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  <ul className="space-y-2 mb-5">
                    {exp.achievements.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-zinc-400 text-sm"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500/70 rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Tech */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
