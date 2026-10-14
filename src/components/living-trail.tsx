"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
    Cloud,
    CloudRain,
    CloudLightning,
    Moon,
    Sun,
    Sprout,
    ChevronDown,
    Mountain,
    Lightbulb,
    Users,
    ExternalLink,
    Clock,
    X,
    Github,
    Youtube,
    Instagram,
    Facebook,
    Award,
    Link2,
    type LucideIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useSiteContent } from "@/lib/use-content";
import {
    describePerson,
    safeHref,
    formatEntryRange,
    TEASER_LINE,
    type TrailEntry,
    type EntryType,
    type LinkRef,
} from "@/lib/content";
import { computeGrowth } from "@/lib/growth";

/* The 3D scene (three.js + EZ-Tree with PBR textures) is a heavy chunk, so
   it loads only on the client, and only once the section is near the
   viewport. */
const TreeScene = dynamic(() => import("@/components/tree-scene"), {
    ssr: false,
    loading: () => <TreeLoading />,
});

function TreeLoading() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Sprout className="w-4 h-4 text-emerald-400 animate-pulse" />
                Growing the tree...
            </div>
        </div>
    );
}

type SkyKind = "clear" | "clouds" | "rain" | "thunder";

interface Weather {
    kind: SkyKind;
    isDay: boolean;
    temp: number | null;
}

function seeded(str: string): () => number {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return () => {
        h = Math.imul(h ^ (h >>> 15), h | 1);
        h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
        return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
    };
}

function mapWeatherCode(code: number): SkyKind {
    if (code === 0 || code === 1) return "clear";
    if (code >= 95) return "thunder";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
    return "clouds";
}

const TYPE_BADGE: Record<EntryType, string> = {
    milestone: "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
    win: "bg-teal-500/10 border-teal-500/25 text-teal-300",
    learning: "bg-cyan-500/10 border-cyan-500/25 text-cyan-300",
    obstacle: "bg-amber-500/10 border-amber-500/25 text-amber-300",
};

const SKY_LABEL: Record<SkyKind, string> = {
    clear: "Clear",
    clouds: "Cloudy",
    rain: "Rain",
    thunder: "Storm",
};

function skyGradient(w: Weather): string {
    if (!w.isDay) return "radial-gradient(ellipse at 50% 18%, #315446, #172e23 65%, #112319)";
    return w.kind === "clear"
        ? "radial-gradient(ellipse at 45% 10%, #617d65, #324e3c 60%, #1f3828)"
        : "radial-gradient(ellipse at 50% 5%, #4c6657, #2d4435 65%, #1c3022)";
}

/* ── Weather overlays ── */

function RainLayer({ heavy }: { heavy: boolean }) {
    const drops = useMemo(() => {
        const rand = seeded("rain");
        return Array.from({ length: heavy ? 60 : 36 }, (_, i) => ({
            id: i,
            left: rand() * 100,
            delay: rand() * 1.2,
            duration: 0.7 + rand() * 0.6,
        }));
    }, [heavy]);
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            {drops.map((d) => (
                <span
                    key={d.id}
                    className="trail-raindrop"
                    style={{
                        left: `${d.left}%`,
                        animationDelay: `${d.delay}s`,
                        animationDuration: `${d.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}

function StarsLayer() {
    const stars = useMemo(() => {
        const rand = seeded("stars");
        return Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: rand() * 100,
            top: rand() * 55,
            size: 1 + rand() * 1.5,
            delay: rand() * 3,
        }));
    }, []);
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            {stars.map((s) => (
                <span
                    key={s.id}
                    className="trail-star"
                    style={{
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        width: s.size,
                        height: s.size,
                        animationDelay: `${s.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}

function CloudsLayer({ dense }: { dense: boolean }) {
    return <div className={`tree-haze ${dense ? "tree-haze-dense" : ""}`} aria-hidden="true" />;
}

/* ── Filter chip ── */

function Chip({
    label,
    count,
    active,
    onClick,
}: {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                active
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
                    : "bg-zinc-900/60 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
            }`}
        >
            {label}
            <span className={active ? "text-emerald-300/80" : "text-zinc-500"}>
                {count}
            </span>
        </button>
    );
}

/* ── Links ── */

/* An entry can point at several places at once: a channel lives on three
   platforms, a shipped project has both a site and a repo. The icon is picked
   from the label so adding a link in Supabase needs no code change. */
function linkIcon(label: string): LucideIcon {
    const l = label.toLowerCase();
    if (l.includes("github")) return Github;
    if (l.includes("youtube")) return Youtube;
    if (l.includes("instagram")) return Instagram;
    if (l.includes("facebook")) return Facebook;
    if (l.includes("certificate")) return Award;
    if (l.includes("standings") || l.includes("ranking")) return Award;
    if (l.includes(".com") || l.includes(".io")) return Link2;
    return ExternalLink;
}

function LinkChips({ links }: { links: LinkRef[] }) {
    if (links.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-1.5 mt-3">
            {links.map((link) => {
                const Icon = linkIcon(link.label);
                const href = safeHref(link.url);
                if (!href) return null;
                return (
                    <a
                        key={link.url + link.label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900/70 text-zinc-400 text-[11px] font-semibold hover:border-emerald-500/40 hover:text-emerald-300 hover:bg-emerald-500/5 transition-colors"
                    >
                        <Icon className="w-3 h-3" />
                        {link.label}
                    </a>
                );
            })}
        </div>
    );
}

/* ── One entry ── */

function EntryCard({
    entry,
    traitLabels,
}: {
    entry: TrailEntry;
    traitLabels: Record<string, string>;
}) {
    /* People without consent arrive with no name and no link, only a role.
       Anyone with neither is dropped rather than rendered as an empty slot. */
    const people = entry.people
        .map((p) => ({ text: describePerson(p), url: safeHref(p.url) }))
        .flatMap((p) => (p.text ? [{ text: p.text, url: p.url }] : []));

    return (
        <article
            id={entry.slug}
            className="bento-card p-5 scroll-mt-28 transition-colors hover:border-zinc-600"
        >
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 border rounded-full text-[11px] font-semibold uppercase tracking-wider ${TYPE_BADGE[entry.type]}`}
                >
                    {entry.type}
                </span>
                {entry.traits.map((t) => (
                    <span
                        key={t}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                            t === entry.primary_trait
                                ? "bg-zinc-800 border-zinc-600 text-zinc-200"
                                : "bg-zinc-900/60 border-zinc-800 text-zinc-400"
                        }`}
                    >
                        {traitLabels[t] ?? t}
                    </span>
                ))}
                <time
                    dateTime={entry.date}
                    className="text-zinc-500 text-xs font-medium ml-auto"
                >
                    {formatEntryRange(entry)}
                </time>
            </div>

            <h4 className="text-zinc-100 font-bold text-base">{entry.title}</h4>

            {entry.teaser ? (
                <p className="flex items-center gap-2 text-zinc-500 text-sm mt-2 italic">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    {TEASER_LINE}
                </p>
            ) : (
                <>
                    {(entry.org || entry.outcome) && (
                        <p className="text-zinc-500 text-xs mt-1 font-medium">
                            {entry.org}
                            {entry.org && entry.outcome ? " · " : ""}
                            {entry.outcome}
                        </p>
                    )}
                    {entry.note && (
                        <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
                            {entry.note}
                        </p>
                    )}
                    {people.length > 0 && (
                        <p className="flex items-start gap-2 text-zinc-500 text-xs mt-2.5">
                            <Users className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <span>
                                {people.map((p, i) => (
                                    /* Key carries the position AND the text.
                                       The page renders the snapshot first and
                                       the live fetch second, so a person can go
                                       from "a instructor" (plain text, no link)
                                       to a named <a> in one update. Keying on
                                       position alone lets React patch that span
                                       in place, and it stranded the old text
                                       node beside the new link. A key that
                                       changes with the text replaces the span
                                       outright. The position prefix keeps keys
                                       unique when two people without consent
                                       collapse to the same string. */
                                    <span key={`${i}-${p.text}`}>
                                        {i > 0 ? " · " : null}
                                        {p.url ? (
                                            <a
                                                href={p.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-zinc-400 hover:text-emerald-300 underline decoration-zinc-700 underline-offset-2 transition-colors"
                                            >
                                                {p.text}
                                            </a>
                                        ) : (
                                            <span>{p.text}</span>
                                        )}
                                    </span>
                                ))}
                            </span>
                        </p>
                    )}
                    {entry.obstacle && (
                        <p className="flex items-start gap-2 text-amber-300/90 text-sm mt-2.5">
                            <Mountain className="w-3.5 h-3.5 mt-1 shrink-0" />
                            <span>
                                <span className="font-semibold">Obstacle: </span>
                                {entry.obstacle}
                            </span>
                        </p>
                    )}
                    {entry.learning && (
                        <p className="flex items-start gap-2 text-emerald-300/90 text-sm mt-2">
                            <Lightbulb className="w-3.5 h-3.5 mt-1 shrink-0" />
                            <span>
                                <span className="font-semibold">Learning: </span>
                                {entry.learning}
                            </span>
                        </p>
                    )}
                    <LinkChips links={entry.links} />
                </>
            )}
        </article>
    );
}

/* ── Main component ── */

export function LivingTrail() {
    const { content } = useSiteContent();
    const { profile, chapters, domains, traits, entries, growthWeights } = content;

    const [weather, setWeather] = useState<Weather>({
        kind: "clear",
        isDay: true,
        temp: null,
    });
    const [weatherLive, setWeatherLive] = useState(false);
    const [open, setOpen] = useState(false);
    const [nearViewport, setNearViewport] = useState(false);
    const [domain, setDomain] = useState<string | null>(null);
    const [trait, setTrait] = useState<string | null>(null);
    const sceneWrapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = sceneWrapRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setNearViewport(true);
                    io.disconnect();
                }
            },
            { rootMargin: "600px" },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    /* Growth is computed client-side only, so the static export never bakes
       in a stale score from build time. */
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );
    const growth = useMemo(
        () => (mounted ? computeGrowth(entries, new Date(), growthWeights) : null),
        [mounted, entries, growthWeights],
    );
    const growingSince = profile?.growing_since ?? 1999;
    const years = mounted ? new Date().getFullYear() - growingSince : null;

    /* A stable identity seed keeps the same tree as new milestones are added. */
    const seed = useMemo(() => {
        let h = 2166136261;
        const key = profile?.handle ?? profile?.name ?? "mazharul";
        for (let i = 0; i < key.length; i++) {
            h ^= key.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return (h >>> 0) % 100000;
    }, [profile?.handle, profile?.name]);

    const latitude = profile?.latitude ?? 51.71905;
    const longitude = profile?.longitude ?? 8.75439;

    useEffect(() => {
        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
            `&longitude=${longitude}&current=temperature_2m,weather_code,is_day`;
        fetch(url)
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
            .then((data) => {
                const c = data?.current;
                if (!c || typeof c.weather_code !== "number") return;
                setWeather({
                    kind: mapWeatherCode(c.weather_code),
                    isDay: c.is_day === 1,
                    temp:
                        typeof c.temperature_2m === "number"
                            ? Math.round(c.temperature_2m)
                            : null,
                });
                setWeatherLive(true);
            })
            .catch(() => {
                /* keep the calm default sky */
            });
    }, [latitude, longitude]);

    const traitLabels = useMemo(
        () => Object.fromEntries(traits.map((t) => [t.slug, t.label])),
        [traits],
    );

    const filtered = useMemo(
        () =>
            entries.filter(
                (e) =>
                    (!domain || e.domain === domain) &&
                    (!trait || e.traits.includes(trait)),
            ),
        [entries, domain, trait],
    );

    /* Counts are computed against the OTHER axis's current filter, so a chip
       never promises entries that clicking it would not actually show. */
    const domainCounts = useMemo(() => {
        const pool = trait ? entries.filter((e) => e.traits.includes(trait)) : entries;
        const counts: Record<string, number> = {};
        for (const e of pool) counts[e.domain] = (counts[e.domain] ?? 0) + 1;
        return counts;
    }, [entries, trait]);

    const traitCounts = useMemo(() => {
        const pool = domain ? entries.filter((e) => e.domain === domain) : entries;
        const counts: Record<string, number> = {};
        for (const e of pool) {
            for (const t of e.traits) counts[t] = (counts[t] ?? 0) + 1;
        }
        return counts;
    }, [entries, domain]);

    /* Entries clustered into chapters, newest chapter first, newest entry
       first inside each chapter. The arc survives filtering: it just gets
       shorter. */
    const groupedTimeline = useMemo(() => {
        return chapters
            .map((chapter) => ({
                chapter,
                items: filtered
                    .filter((e) => e.chapter === chapter.id)
                    .slice()
                    .sort((a, b) => b.date.localeCompare(a.date)),
            }))
            .filter((g) => g.items.length > 0)
            .reverse();
    }, [chapters, filtered]);

    const WeatherIcon = !weather.isDay
        ? Moon
        : weather.kind === "thunder"
          ? CloudLightning
          : weather.kind === "rain"
            ? CloudRain
            : weather.kind === "clouds"
              ? Cloud
              : Sun;

    /* The closing words of the belief line get the gradient emphasis. */
    const belief = profile?.creed_belief ?? "";
    const [beliefLead, beliefEmphasis] = useMemo(() => {
        const match = belief.match(/^(.*\s)(is time\.?)$/i);
        return match ? [match[1], match[2]] : [belief, ""];
    }, [belief]);

    const filtering = Boolean(domain || trait);

    return (
        // Not using .section here: its padding-top would override the larger
        // clearance needed below the fixed navbar.
        <section id="trail" className="px-4 pb-20 pt-36 md:pt-40">
            <div className="max-w-6xl mx-auto">
                {/* Creed, his own words, above the tree */}
                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-center mb-4">The growth trail</h1>
                <p className="text-center text-zinc-400 text-sm max-w-xl mx-auto mb-12">Work, learning and community, connected by the values underneath.</p>
                <figure className="relative max-w-3xl mx-auto text-center mb-12 px-2">
                    <span
                        aria-hidden
                        className="absolute -top-3 md:-top-8 left-1/2 -translate-x-1/2 text-[4.5rem] md:text-[7rem] leading-none font-serif text-emerald-500/10 select-none pointer-events-none"
                    >
                        &ldquo;
                    </span>
                    <blockquote className="relative">
                        <p className="text-2xl md:text-[1.75rem] font-light italic text-zinc-200 leading-snug tracking-tight">
                            {beliefLead}
                            {beliefEmphasis && (
                                <span className="gradient-text font-semibold not-italic">
                                    {beliefEmphasis}
                                </span>
                            )}
                        </p>
                        {profile?.creed_practice && (
                            <p className="text-zinc-400 text-sm md:text-base mt-5 leading-relaxed max-w-xl mx-auto">
                                {profile.creed_practice}
                            </p>
                        )}
                    </blockquote>
                    <figcaption className="mt-5 flex items-center justify-center gap-3">
                        <span className="h-px w-10 bg-gradient-to-r from-transparent to-emerald-500/50" />
                        <Sprout className="w-4 h-4 text-emerald-400/80" />
                        <span className="h-px w-10 bg-gradient-to-l from-transparent to-emerald-500/50" />
                    </figcaption>
                </figure>

                {/* Sky + tree */}
                <div className="tree-composition bento-card overflow-hidden relative">
                    <div className="tree-canvas-panel">
                    <div
                        className="scene-chrome relative transition-[background] duration-1000"
                        style={{ background: skyGradient(weather) }}
                    >
                        {!weather.isDay && <StarsLayer />}
                        {weather.isDay && weather.kind === "clear" && (
                            <div
                                className="absolute top-8 right-12 w-16 h-16 rounded-full pointer-events-none"
                                style={{
                                    background:
                                        "radial-gradient(circle, rgba(253,224,71,0.9), rgba(253,224,71,0) 70%)",
                                }}
                                aria-hidden
                            />
                        )}
                        {(weather.kind === "clouds" ||
                            weather.kind === "rain" ||
                            weather.kind === "thunder") && (
                            <CloudsLayer dense={weather.kind !== "clouds"} />
                        )}

                        {/* Weather chip */}
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/60 border border-zinc-700/60 backdrop-blur-sm">
                            <WeatherIcon className="w-3.5 h-3.5 text-emerald-300" />
                            <span className="text-zinc-200 text-xs font-medium">
                                {(profile?.location ?? "Paderborn").split(",")[0]}
                                {weather.temp !== null && ` · ${weather.temp}°C`}
                                {` · ${SKY_LABEL[weather.kind]}`}
                                {!weatherLive && " (offline)"}
                            </span>
                        </div>

                        <div
                            ref={sceneWrapRef}
                            className="tree-viewport relative w-full"
                        >
                            <div className="absolute inset-0">
                                {nearViewport ? (
                                    <TreeScene
                                        seed={seed}
                                        entriesCount={entries.length}
                                        chaptersCount={chapters.length}
                                        rootsCount={profile?.roots.length ?? 5}
                                        years={years ?? 27}
                                        vitality={0.78 + (growth?.vitality ?? 0.85) * 0.22}
                                        isDay={weather.isDay}
                                    />
                                ) : (
                                    <TreeLoading />
                                )}
                            </div>

                        </div>

                        {(weather.kind === "rain" || weather.kind === "thunder") && (
                            <RainLayer heavy={weather.kind === "thunder"} />
                        )}
                    </div>

                    </div>
                    <aside className="tree-story">
                        <p className="work-category">A life with several branches</p>
                        <h2>Built on more than code.</h2>
                        <p>Products, classrooms and communities have all shaped how I work. Explore a branch to see the milestones behind it.</p>
                        <div className="tree-branches">
                            {[
                                { slug: "built", label: "Products & tools" },
                                { slug: "work", label: "Engineering work" },
                                { slug: "education", label: "Learning" },
                                { slug: "community", label: "Community" },
                                { slug: "content", label: "Teaching & explaining" },
                            ].map((branch) => <button key={branch.slug} type="button" aria-pressed={domain === branch.slug} onClick={() => {
                                setDomain(branch.slug); setTrait(null); setOpen(true);
                                requestAnimationFrame(() => document.getElementById("trail-timeline")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }));
                            }}><span>{branch.label}</span><span>{entries.filter((entry) => entry.domain === branch.slug).length}<ChevronDown size={12} /></span></button>)}
                        </div>
                        <div className="tree-values"><h3>What keeps me grounded</h3><ul>{(profile?.roots ?? []).map((root) => <li key={root}>{root}</li>)}</ul></div>
                    </aside>
                    {/* Stats bar */}
                    <div className="tree-caption flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-zinc-800 bg-zinc-900/60">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <p className="text-zinc-400 text-sm" suppressHydrationWarning>
                                <span className="text-emerald-300 font-semibold">{entries.length} milestones documented</span>
                                {entries[0] && ` · Latest entry: ${formatEntryRange(entries[0])}`}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen((o) => !o)}
                            aria-expanded={open}
                            aria-controls="trail-timeline"
                            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-zinc-200 text-xs font-semibold transition-colors"
                        >
                            {open ? "Close the trail" : "Walk the trail"}
                            <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                            />
                        </button>
                    </div>
                </div>

                {/* Timeline, clustered by chapter */}
                <div
                    id="trail-timeline"
                    inert={!open}
                    className={`grid transition-all duration-500 ease-in-out ${
                        open
                            ? "grid-rows-[1fr] opacity-100 mt-4"
                            : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                >
                    <div className="overflow-hidden">
                        {/* Filters. Two axes: where in life, and what it proves. */}
                        <div className="bento-card p-4 mb-6 space-y-3">
                            <div>
                                <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-2">
                                    Part of life
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {domains
                                        .filter(
                                            (d) =>
                                                (domainCounts[d.slug] ?? 0) > 0 ||
                                                domain === d.slug,
                                        )
                                        .map((d) => (
                                            <Chip
                                                key={d.slug}
                                                label={d.label}
                                                count={domainCounts[d.slug] ?? 0}
                                                active={domain === d.slug}
                                                onClick={() =>
                                                    setDomain(
                                                        domain === d.slug ? null : d.slug,
                                                    )
                                                }
                                            />
                                        ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-2">
                                    What it demonstrates
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {traits
                                        .filter(
                                            (t) =>
                                                (traitCounts[t.slug] ?? 0) > 0 ||
                                                trait === t.slug,
                                        )
                                        .map((t) => (
                                            <Chip
                                                key={t.slug}
                                                label={t.label}
                                                count={traitCounts[t.slug] ?? 0}
                                                active={trait === t.slug}
                                                onClick={() =>
                                                    setTrait(
                                                        trait === t.slug ? null : t.slug,
                                                    )
                                                }
                                            />
                                        ))}
                                </div>
                            </div>

                            {filtering && (
                                <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                                    <p className="text-zinc-400 text-xs pt-2">
                                        Showing{" "}
                                        <span className="text-emerald-300 font-semibold">
                                            {filtered.length}
                                        </span>{" "}
                                        of {entries.length}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDomain(null);
                                            setTrait(null);
                                        }}
                                        className="mt-2 inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-100 text-xs font-semibold transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                        Clear
                                    </button>
                                </div>
                            )}
                        </div>

                        {groupedTimeline.length === 0 ? (
                            <p className="text-zinc-500 text-sm text-center py-10">
                                Nothing matches that combination yet.
                            </p>
                        ) : (
                            <div className="space-y-8">
                                {groupedTimeline.map(({ chapter, items }) => (
                                    <div key={chapter.id}>
                                        <div className="flex items-baseline gap-3 mb-3 px-1">
                                            <h3 className="text-zinc-100 font-extrabold text-lg tracking-tight">
                                                {chapter.title}
                                            </h3>
                                            <span className="text-zinc-500 text-xs">
                                                {chapter.subtitle} · {items.length}{" "}
                                                {items.length === 1 ? "entry" : "entries"}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {items.map((e) => (
                                                <EntryCard
                                                    key={e.id || e.slug}
                                                    entry={e}
                                                    traitLabels={traitLabels}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
