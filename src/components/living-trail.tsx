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
    TrendingUp,
    TrendingDown,
    MoveRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import trail from "@/data/trail.json";
import { computeGrowth, type TrailEntry } from "@/lib/growth";

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
                Growing the tree…
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

const config = trail.config;
const entries = (trail.entries as TrailEntry[])
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

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

const TYPE_BADGE: Record<TrailEntry["type"], string> = {
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
    if (!w.isDay) return "linear-gradient(to bottom, #020617, #0f172a 55%, #1e293b)";
    switch (w.kind) {
        case "clear":
            return "linear-gradient(to bottom, #0c4a6e, #0369a1 50%, #7dd3fc)";
        case "clouds":
            return "linear-gradient(to bottom, #1e293b, #334155 55%, #64748b)";
        case "rain":
        case "thunder":
            return "linear-gradient(to bottom, #0f172a, #1e293b 55%, #475569)";
    }
}

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(entry: TrailEntry): string {
    const [y, m, d] = entry.date.split("-").map(Number);
    if (entry.precision === "year") return `${y}`;
    if (entry.precision === "month") return `${MONTHS[m - 1]} ${y}`;
    return `${MONTHS[m - 1]} ${d}, ${y}`;
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
    const clouds = useMemo(() => {
        const rand = seeded("clouds");
        return Array.from({ length: dense ? 5 : 3 }, (_, i) => ({
            id: i,
            top: 4 + rand() * 22,
            scale: 0.8 + rand() * 1.4,
            duration: 60 + rand() * 50,
            delay: -rand() * 60,
            opacity: dense ? 0.5 : 0.3,
        }));
    }, [dense]);
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            {clouds.map((c) => (
                <Cloud
                    key={c.id}
                    className="trail-cloud text-slate-300"
                    style={{
                        top: `${c.top}%`,
                        width: 70 * c.scale,
                        height: 44 * c.scale,
                        opacity: c.opacity,
                        animationDuration: `${c.duration}s`,
                        animationDelay: `${c.delay}s`,
                    }}
                    fill="currentColor"
                    strokeWidth={0}
                />
            ))}
        </div>
    );
}

/* ── Main component ── */

export function LivingTrail() {
    const [weather, setWeather] = useState<Weather>({
        kind: "clear",
        isDay: true,
        temp: null,
    });
    const [weatherLive, setWeatherLive] = useState(false);
    const [open, setOpen] = useState(false);
    const [nearViewport, setNearViewport] = useState(false);
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
            { rootMargin: "600px" }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    /* Growth is computed client-side only, so the static export never bakes
       in a stale score from build time. */
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );
    const growth = useMemo(
        () => (mounted ? computeGrowth(entries, new Date()) : null),
        [mounted]
    );
    const years = mounted
        ? new Date().getFullYear() - config.growingSince
        : null;

    /* Deterministic seed — the same trail data always grows the same tree. */
    const seed = useMemo(() => {
        let h = 2166136261;
        const key = entries.map((e) => e.date).join();
        for (let i = 0; i < key.length; i++) {
            h ^= key.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return (h >>> 0) % 100000;
    }, []);

    useEffect(() => {
        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${config.latitude}` +
            `&longitude=${config.longitude}&current=temperature_2m,weather_code,is_day`;
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
    }, []);

    /* Journey clustered into chapters, newest chapter first, newest entry
       first inside each chapter. */
    const groupedTimeline = useMemo(() => {
        return config.chapters
            .map((chapter) => ({
                chapter,
                items: entries
                    .filter((e) => e.chapter === chapter.id)
                    .reverse(),
            }))
            .filter((g) => g.items.length > 0)
            .reverse();
    }, []);

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
    const [beliefLead, beliefEmphasis] = useMemo(() => {
        const match = config.creed.belief.match(/^(.*\s)(is time\.?)$/i);
        return match ? [match[1], match[2]] : [config.creed.belief, ""];
    }, []);

    const trend = growth?.trend ?? "steady";
    const TrendIcon =
        trend === "growing"
            ? TrendingUp
            : trend === "declining"
              ? TrendingDown
              : MoveRight;
    const trendStyle =
        trend === "growing"
            ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/25"
            : trend === "declining"
              ? "text-amber-300 bg-amber-500/10 border-amber-500/25"
              : "text-zinc-300 bg-zinc-500/10 border-zinc-500/25";

    return (
        <section id="trail" className="section px-4 pt-32">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <span className="section-label">
                        <Sprout className="w-3.5 h-3.5" />
                        The Living Trail
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-50 tracking-tight mt-2">
                        A tree that grows with me
                    </h2>
                    <p className="text-zinc-500 mt-2 text-sm max-w-2xl">
                        Each chapter of the journey is a limb, every entry a cluster
                        of leaves, and obstacles are knots in the wood. How lush the
                        canopy looks is computed from recent activity — and the sky
                        matches the real weather over {config.location} right now.
                    </p>
                </div>

                {/* Creed — his own words, above the tree */}
                <figure className="relative max-w-3xl mx-auto text-center mb-12 px-2">
                    <span
                        aria-hidden
                        className="absolute -top-8 left-1/2 -translate-x-1/2 text-[7rem] leading-none font-serif text-emerald-500/10 select-none pointer-events-none"
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
                        <p className="text-zinc-400 text-sm md:text-base mt-5 leading-relaxed max-w-xl mx-auto">
                            {config.creed.practice}
                        </p>
                    </blockquote>
                    <figcaption className="mt-5 flex items-center justify-center gap-3">
                        <span className="h-px w-10 bg-gradient-to-r from-transparent to-emerald-500/50" />
                        <Sprout className="w-4 h-4 text-emerald-400/80" />
                        <span className="h-px w-10 bg-gradient-to-l from-transparent to-emerald-500/50" />
                    </figcaption>
                </figure>

                {/* Sky + tree */}
                <div className="bento-card overflow-hidden relative">
                    <div
                        className="relative transition-[background] duration-1000"
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
                                {config.location.split(",")[0]}
                                {weather.temp !== null && ` · ${weather.temp}°C`}
                                {` · ${SKY_LABEL[weather.kind]}`}
                                {!weatherLive && " (offline)"}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen((o) => !o)}
                            aria-expanded={open}
                            aria-controls="trail-timeline"
                            className="block w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                            title="Open the trail"
                        >
                            <div
                                ref={sceneWrapRef}
                                className="relative w-full h-[440px] md:h-[580px]"
                            >
                                {nearViewport ? (
                                    <TreeScene
                                        seed={seed}
                                        entriesCount={entries.length}
                                        chaptersCount={config.chapters.length}
                                        rootsCount={config.roots.length}
                                        years={years ?? 27}
                                        vitality={growth?.vitality ?? 0.85}
                                        isDay={weather.isDay}
                                    />
                                ) : (
                                    <TreeLoading />
                                )}
                                {/* Named roots, anchored over the soil */}
                                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-x-6 gap-y-1 flex-wrap px-4 pointer-events-none">
                                    {config.roots.map((label) => (
                                        <span
                                            key={label}
                                            className="text-[13px] font-semibold tracking-wide"
                                            style={{ color: "rgba(190, 168, 140, 0.75)" }}
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </button>

                        {(weather.kind === "rain" || weather.kind === "thunder") && (
                            <RainLayer heavy={weather.kind === "thunder"} />
                        )}
                    </div>

                    {/* Stats bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-zinc-800 bg-zinc-900/60">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <p className="text-zinc-400 text-sm" suppressHydrationWarning>
                                <span className="text-emerald-300 font-semibold">
                                    Growing for {years ?? "27"} years
                                </span>
                                {" · "}
                                {entries.length} entries
                                {growth &&
                                    growth.daysSinceLastEntry >= 0 &&
                                    ` · last grew ${
                                        growth.daysSinceLastEntry === 0
                                            ? "today"
                                            : growth.daysSinceLastEntry === 1
                                              ? "yesterday"
                                              : `${growth.daysSinceLastEntry} days ago`
                                    }`}
                            </p>
                            {growth && (
                                <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-xs font-semibold ${trendStyle}`}
                                    title="Growth index compares recency-weighted activity in the last 90 days against the 90 days before"
                                >
                                    <TrendIcon className="w-3.5 h-3.5" />
                                    Growth index {growth.score}
                                    {" · "}
                                    {trend === "growing"
                                        ? "growing"
                                        : trend === "declining"
                                          ? "slowing down"
                                          : "steady"}
                                </span>
                            )}
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
                    className={`grid transition-all duration-500 ease-in-out ${
                        open
                            ? "grid-rows-[1fr] opacity-100 mt-4"
                            : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                >
                    <div className="overflow-hidden">
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
                                            <article
                                                key={e.date + e.title}
                                                className="bento-card p-5"
                                            >
                                                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 border rounded-full text-[11px] font-semibold uppercase tracking-wider ${TYPE_BADGE[e.type]}`}
                                                    >
                                                        {e.type}
                                                    </span>
                                                    <time
                                                        dateTime={e.date}
                                                        className="text-zinc-500 text-xs font-medium"
                                                    >
                                                        {formatDate(e)}
                                                    </time>
                                                </div>
                                                <h4 className="text-zinc-100 font-bold text-base">
                                                    {e.title}
                                                </h4>
                                                {e.note && (
                                                    <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
                                                        {e.note}
                                                    </p>
                                                )}
                                                {e.obstacle && (
                                                    <p className="flex items-start gap-2 text-amber-300/90 text-sm mt-2.5">
                                                        <Mountain className="w-3.5 h-3.5 mt-1 shrink-0" />
                                                        <span>
                                                            <span className="font-semibold">
                                                                Obstacle:{" "}
                                                            </span>
                                                            {e.obstacle}
                                                        </span>
                                                    </p>
                                                )}
                                                {e.learning && (
                                                    <p className="flex items-start gap-2 text-emerald-300/90 text-sm mt-2">
                                                        <Lightbulb className="w-3.5 h-3.5 mt-1 shrink-0" />
                                                        <span>
                                                            <span className="font-semibold">
                                                                Learning:{" "}
                                                            </span>
                                                            {e.learning}
                                                        </span>
                                                    </p>
                                                )}
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
