"use client";

import Image from "next/image";
import {
    Github,
    Linkedin,
    Mail,
    FileDown,
    ArrowUpRight,
    MapPin,
    Briefcase,
} from "lucide-react";

const stats = [
    { label: "Years Exp.", value: "3+" },
    { label: "Contests", value: "300+" },
    { label: "Problems Solved", value: "2K+" },
    { label: "CF Peak", value: "1603" },
];

const socials = [
    {
        icon: Github,
        label: "GitHub",
        handle: "@cloud-007",
        href: "https://github.com/cloud-007",
    },
    {
        icon: Linkedin,
        label: "LinkedIn",
        handle: "in/-mazharulislam-",
        href: "https://www.linkedin.com/in/-mazharulislam-/",
    },
    {
        icon: Mail,
        label: "Email",
        handle: "mie.mazharul@gmail.com",
        href: "mailto:mie.mazharul@gmail.com",
    },
];

const coreStack = [
    "Python",
    "Django",
    "PostgreSQL",
    "Redis",
    "Celery",
    "Flutter",
    "Next.js",
    "TypeScript",
    "Docker",
    "GCP",
    "CI/CD",
    "Claude Code",
    "Cursor",
];

export function Hero() {
    return (
        <section id="about" className="min-h-screen pt-28 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* ── Intro card ── */}
                    <div className="bento-card md:col-span-8 p-8 flex flex-col justify-between min-h-[300px] relative">
                        {/* Mobile avatar, visible only below md */}
                        <div className="md:hidden absolute top-4 right-4 w-20 h-20 rounded-2xl overflow-hidden border-2 border-zinc-700 shrink-0">
                            <Image
                                src="/images/profile.jpg"
                                fill
                                className="object-cover"
                                alt="Mazharul Islam"
                                sizes="80px"
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                                <span className="text-zinc-400 text-xs font-medium">
                                    Open to new opportunities
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-50 leading-tight tracking-tight mb-5">
                                Mazharul{" "}
                                <span className="gradient-text">Islam</span>
                            </h1>
                            <p className="text-zinc-400 text-base leading-relaxed text-justify">
                                Full-Stack AI Engineer with 3+ years in software
                                engineering. Builds scalable backends,
                                cross-platform mobile apps, and AI-powered SaaS
                                platforms. Ships production systems with Django,
                                Flutter, and Next.js, and delivers faster using
                                AI-native tooling like Claude Code and Cursor.
                                Proven track record in multi-tenant architecture,
                                real-time speech evaluation pipelines, and
                                end-to-end product delivery across 93+
                                production releases.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-6">
                            <a
                                href="mailto:mie.mazharul@gmail.com"
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                Get in touch
                            </a>
                            <a
                                href="/resume"
                                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-xl transition-colors border border-zinc-700"
                            >
                                <FileDown className="w-4 h-4" />
                                Resume
                            </a>
                        </div>
                    </div>

                    {/* Profile image card, hidden on mobile */}
                    <div className="hidden md:block bento-card md:col-span-4 overflow-hidden relative min-h-[300px]">
                        <Image
                            src="/images/profile.jpg"
                            alt="Mazharul Islam"
                            fill
                            className="object-cover"
                            priority
                            sizes="350px"
                            fetchPriority="high"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-1.5 text-zinc-300 text-sm">
                                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                Sylhet, Bangladesh
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1">
                                <Briefcase className="w-3 h-3 text-zinc-500" />
                                Full-Stack AI Engineer · EdTech / AI
                            </div>
                        </div>
                    </div>

                    {/* Stats: 2x2 on mobile, 4-col on desktop */}
                    <div className="col-span-1 md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bento-card p-5 sm:p-6 flex flex-col items-center justify-center text-center"
                            >
                                <div className="text-3xl font-extrabold gradient-text leading-none mb-1.5">
                                    {stat.value}
                                </div>
                                <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Socials card ── */}
                    <div className="bento-card md:col-span-5 p-6">
                        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4">
                            Connect
                        </p>
                        <div className="flex flex-col gap-1">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/80 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-zinc-700 transition-colors border border-zinc-700">
                                            <social.icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                                        </div>
                                        <div>
                                            <div className="text-zinc-200 text-sm font-medium">
                                                {social.label}
                                            </div>
                                            <div className="text-zinc-500 text-xs">
                                                {social.handle}
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Core stack card ── */}
                    <div className="bento-card md:col-span-7 p-6">
                        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4">
                            Core Stack
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {coreStack.map((tech) => (
                                <span key={tech} className="tech-badge">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            <p className="text-zinc-500 text-xs">
                                Available for new opportunities: backend,
                                mobile & AI
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
