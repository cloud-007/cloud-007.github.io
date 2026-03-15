"use client";

import { Github, ArrowUpRight, ExternalLink } from "lucide-react";

const professionalProjects = [
  {
    name: "OneIELTS",
    tagline: "Multi-Tenant IELTS Academic & General Preparation Platform",
    period: "2024 — Present",
    label: "Professional · LiiLab",
    liveUrl: "https://oneielts.com",
    description:
      "Enterprise-grade multi-tenant IELTS platform supporting Academic and General curricula. Architected the backend from zero, including a QTI 3.0 question engine, automated scoring across all four IELTS skill areas, multi-gateway payment infrastructure, and a production observability stack.",
    highlights: [
      "Architected a multi-tenant backend using django-multitenant with full data isolation per organization, custom domain routing, and per-tenant scoring configuration and feature flags",
      "Built a QTI 3.0-compliant question engine supporting 100+ question types across Academic and General curricula, with XML parsing, interaction routing, and automated band-score normalization via a strategy-pattern converter",
      "Built an automated speech evaluation pipeline for IELTS Speaking using Speech Recognition, Pronunciation Assessment, and NLP Processing, completing within seconds of submission",
      "Designed and built the Studio API layer for the moderator platform, covering question bank and curriculum authoring, exam template configuration, user submission review, expert evaluation queue with AI-vs-human score comparison, exam rejudge pipelines, and KPI analytics for subscriptions, user practice activity, and engagement",
      "Integrated 5 payment gateways (Stripe, Razorpay, SSLCommerz, Google Play, Apple) with subscription lifecycle management, idempotent webhook processing, and campaign-based promotional pricing",
      "Set up production observability with health monitoring, API latency tracking, and service instrumentation; implemented device-restricted JWT auth and GDPR-compliant account deletion",
    ],
    technologies: [
      "Django", "DRF", "django-multitenant", "QTI 3.0", "Python", "FastAPI",
      "PostgreSQL", "Redis", "Celery", "Speech Recognition", "NLP Processing",
      "Stripe", "Razorpay", "Prometheus", "Grafana", "Next.js", "TypeScript", "Docker",
    ],
    accentFrom: "from-emerald-500",
    accentTo: "to-teal-500",
  },
  {
    name: "OnePTE",
    tagline: "PTE Academic & Core Exam Preparation Platform",
    period: "2022 — Present",
    label: "Professional · LiiLab",
    liveUrl: "https://onepte.com",
    description:
      "Full-stack EdTech platform for PTE Academic and PTE Core exam prep. Designed and shipped the Flutter cross-platform app from the ground up, built the Django AI scoring backend, and delivered a GPU-backed speech processing microservice as a production system with 93+ app releases.",
    highlights: [
      "Designed the question practice and mock test system covering all four modules (Speaking, Writing, Reading, and Listening) with 20+ task types, configurable time windows, and automated question progression",
      "Built a real-time AI scoring engine evaluating spoken and written submissions using Speech Recognition, Pronunciation Assessment, and NLP Processing, delivering results within 10-15 seconds",
      "Engineered multi-platform billing across Stripe, SSLCommerz, Google Play, and Apple App Store with subscription checkout, real-time payment webhooks, transaction deduplication, and in-app purchase verification",
      "Built the Django admin and private API layer for content moderation, question bank and exam management, subscription analytics with regional reporting, exam rejudge system, and user acquisition dashboards with Google Analytics Data API integration",
      "Extended the app to Flutter Web with full responsive desktop implementations and built multi-brand support for OnePTE and PearsonPTE from a single codebase",
      "Led 93+ production mobile releases (Android, iOS, Web), managing release pipelines, Firebase configurations, and CI/CD across multiple brands",
    ],
    technologies: [
      "Flutter", "Dart", "Riverpod", "GoRouter", "Django", "DRF", "FastAPI",
      "PostgreSQL", "Redis", "Celery", "Speech Recognition", "NLP Processing",
      "Stripe", "Firebase", "AWS S3", "Next.js", "TypeScript", "CI/CD",
    ],
    accentFrom: "from-emerald-500",
    accentTo: "to-teal-500",
  },
];

const clientProjects = [
  {
    name: "Petty Bros",
    tagline: "Restaurant Website · South East London",
    period: "2025",
    label: "Client",
    liveUrl: "https://www.patty-bros.co.uk/",
    description:
      "Marketing and booking website for a South East London burger restaurant. Built a Google Sheets-driven live menu with zero CMS overhead, a serverless booking backend via Google Apps Script, and Telegram Bot notifications for instant booking alerts — from design to deployment.",
    highlights: [
      "Used Google Sheets as a zero-cost live CMS for the full menu, with ISR-based fetching at 5-minute revalidation, per-item availability toggling, allergen and calorie data, featured item promotion, and a static fallback for resilience",
      "Built the booking backend entirely serverless using Google Apps Script — form submissions are logged to a Google Sheet and trigger real-time Telegram Bot notifications to the team with full booking details and formatted party info",
      "Delivered a responsive, animated marketing site across Home, Menu, About, Locations, and Book pages using Framer Motion, Radix UI, and React Hook Form with Zod validation for the booking form",
    ],
    technologies: [
      "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Radix UI",
      "Google Sheets API", "Google Apps Script", "Telegram Bot API", "React Hook Form", "Zod",
    ],
    accentFrom: "from-sky-500",
    accentTo: "to-blue-500",
    githubUrl: null,
  },
];

const personalProjects = [
  {
    name: "Projecto",
    tagline: "University Course & Proposal Management System",
    period: "Oct 2022 — Dec 2022",
    liveUrl: null,
    githubUrl: "https://github.com/cloud-007/projecto",
    description:
      "A Django web app for managing university courses and student proposals, with four distinct user roles: unregistered visitors, students, teachers, and super users — each with a tailored permission set and feature scope.",
    highlights: [
      "Built a multi-role access system where students submit course proposals, teachers supervise and mark assigned proposals with filtering and search by student ID, and super users manage the complete course and faculty lifecycle",
      "Implemented AJAX-driven interactions for live proposal filtering, dynamic form handling, and inline updates without full page reloads, using jQuery and Bootstrap for responsive layouts",
      "Wired automated email notifications for supervisor assignment events, keeping student team leaders informed in real time via Django's email backend",
      "Added PDF and CSV export for proposal lists and course results, giving teachers and admins structured downloadable reports for evaluation and record-keeping",
    ],
    technologies: ["Django", "Python", "AJAX", "jQuery", "Bootstrap", "PostgreSQL"],
    accentFrom: "from-zinc-600",
    accentTo: "to-zinc-500",
  },
  {
    name: "Reachout",
    tagline: "Flutter Consultation MVP",
    period: "Oct 2023",
    liveUrl: null,
    githubUrl: "https://github.com/cloud-007",
    description:
      "A Flutter MVP connecting users with professional consultants, featuring Google Sign-In authentication, real-time chat, and consultant profile browsing — structured with Clean Architecture from day one.",
    highlights: [
      "Built end-to-end authentication with Google Sign-In, Firebase session management, and user profile creation with Apple-style onboarding flow",
      "Implemented real-time chat between users and consultants using Firebase Firestore, with message threading and consultant online status indicators",
      "Structured the codebase using Clean Architecture with Riverpod state management, separating domain, data, and presentation layers into modular packages for a scalable, testable foundation",
      "Delivered a complete working MVP — consultant discovery, profile browsing, and in-app messaging — within a tight timeframe as a solo project",
    ],
    technologies: ["Flutter", "Dart", "Firebase", "Riverpod", "Clean Architecture"],
    accentFrom: "from-zinc-600",
    accentTo: "to-zinc-500",
  },
];

type ProjectCard = {
  name: string;
  tagline: string;
  period: string;
  label?: string;
  liveUrl: string | null;
  githubUrl?: string | null;
  description: string;
  highlights: string[];
  technologies: string[];
  accentFrom: string;
  accentTo: string;
};

function FullWidthCard({ project, showPrivateBadge = false }: { project: ProjectCard; showPrivateBadge?: boolean }) {
  return (
    <div className="bento-card p-7 hover:border-zinc-600 transition-colors relative overflow-hidden">
      <div className={`absolute left-0 top-6 bottom-6 w-0.5 bg-gradient-to-b ${project.accentFrom} ${project.accentTo} rounded-full`} />
      <div className="pl-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h3 className="text-xl font-bold text-zinc-50">{project.name}</h3>
              {showPrivateBadge && (
                <span className="px-2.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 text-xs font-medium">
                  Private
                </span>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                >
                  Live
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 text-xs font-medium hover:bg-zinc-700 transition-colors"
                >
                  GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-emerald-400 text-xs font-medium">{project.tagline}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-zinc-500 text-xs bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-zinc-700/50">
              {project.period}
            </span>
            {project.label && (
              <span className="text-zinc-600 text-xs hidden sm:inline">{project.label}</span>
            )}
          </div>
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed mb-5">{project.description}</p>

        <ul className="space-y-2 mb-5">
          {project.highlights.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
              <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500/70 rounded-full shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800">
          {project.technologies.map((tech) => (
            <span key={tech} className="tech-badge">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <span className="section-label">Work & Projects</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
            Projects
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            Production platforms, client work, and personal side projects
          </p>
        </div>

        {/* Professional */}
        <div className="mb-8">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4">
            Professional
          </p>
          <div className="space-y-4">
            {professionalProjects.map((project, i) => (
              <FullWidthCard key={i} project={project} showPrivateBadge />
            ))}
          </div>
        </div>

        {/* Client */}
        <div className="mb-8">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4">
            Client
          </p>
          <div className="space-y-4">
            {clientProjects.map((project, i) => (
              <FullWidthCard key={i} project={project} />
            ))}
          </div>
        </div>

        {/* Personal */}
        <div>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4">
            Personal
          </p>
          <div className="space-y-4">
            {personalProjects.map((project, i) => (
              <FullWidthCard key={i} project={project} />
            ))}
          </div>
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
