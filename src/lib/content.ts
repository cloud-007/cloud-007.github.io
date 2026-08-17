/**
 * Site content, sourced from Supabase.
 *
 * There is no hardcoded copy anywhere in the components any more. Everything
 * the site renders comes from the `public_*` views, which are the only surface
 * the anon key can reach. A row marked private, a redacted org name, a teaser
 * project: none of it is filtered here. It never arrives.
 *
 * Two paths feed the same shape:
 *
 *   snapshot.json   generated at build time from the public views, committed,
 *                   imported directly so the first paint is instant and the
 *                   page still works if Supabase is asleep or unreachable.
 *
 *   live fetch      runs on mount and replaces the snapshot when it answers.
 *
 * If the live fetch fails, the snapshot simply stays. The page never blanks.
 */

import snapshot from "@/data/snapshot.json";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* ── Types. These mirror the views in supabase/01-schema.sql. ─────────────── */

export type EntryType = "milestone" | "win" | "learning" | "obstacle";
export type DatePrecision = "day" | "month" | "year";

export interface Chapter {
    id: string;
    title: string;
    subtitle: string;
    sort_order: number;
}

export interface Facet {
    slug: string;
    label: string;
    description: string | null;
    sort_order: number;
}

export interface TrailEntry {
    id: string;
    slug: string;
    date: string;
    end_date: string | null;
    precision: DatePrecision;
    chapter: string;
    domain: string;
    type: EntryType;
    title: string;
    note: string | null;
    obstacle: string | null;
    learning: string | null;
    org: string | null;
    outcome: string | null;
    teammates: string[];
    link_url: string | null;
    link_label: string | null;
    teaser: boolean;
    traits: string[];
    primary_trait: string | null;
}

export interface Profile {
    name: string;
    handle: string | null;
    role: string;
    bio: string;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
    open_to_work: boolean;
    growing_since: number | null;
    roots: string[];
    creed_belief: string | null;
    creed_practice: string | null;
    socials: { label: string; handle: string; href: string }[];
    core_stack: string[];
}

export interface ExperienceRole {
    id: string;
    company: string;
    company_url: string | null;
    role: string;
    location: string | null;
    start_date: string;
    end_date: string | null;
    summary: string | null;
    bullets: string[];
    stack: string[];
    links: { label: string; href: string }[];
}

export interface Project {
    id: string;
    name: string;
    tagline: string | null;
    category: "professional" | "client" | "personal";
    period: string | null;
    description: string | null;
    highlights: string[];
    technologies: string[];
    live_url: string | null;
    repo_url: string | null;
    teaser: boolean;
    on_resume: boolean;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    location: string | null;
    period: string | null;
    detail: string | null;
    on_resume: boolean;
}

export interface Volunteering {
    id: string;
    title: string;
    org: string;
    period: string | null;
    bullets: string[];
}

export interface SkillGroup {
    id: string;
    group: string;
    items: string[];
    /** Key resolved to a lucide icon in the UI; not a component. */
    icon: string | null;
    accent: string;
    /** The site shows six detailed groups, the resume five condensed lines. */
    context: "site" | "resume";
}

export interface JudgeProfile {
    id: string;
    name: string;
    handle: string;
    url: string;
    rating: string | null;
}

export interface Stat {
    id: string;
    label: string;
    value: string;
    context: "hero" | "competitive";
}

export interface SiteContent {
    chapters: Chapter[];
    domains: Facet[];
    traits: Facet[];
    entries: TrailEntry[];
    profile: Profile | null;
    experience: ExperienceRole[];
    projects: Project[];
    education: Education[];
    volunteering: Volunteering[];
    skills: SkillGroup[];
    judges: JudgeProfile[];
    stats: Stat[];
    growthWeights: Record<string, number>;
    generatedAt: string | null;
}

/* ── The committed fallback ───────────────────────────────────────────────── */

export const snapshotContent = snapshot as unknown as SiteContent;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/* ── Fetching ─────────────────────────────────────────────────────────────── */

/**
 * One PostgREST read. `view` must be a `public_*` view: the anon key has no
 * grant on any base table, so a typo fails loudly rather than leaking.
 */
export async function readView<T>(
    view: string,
    params = "select=*",
    signal?: AbortSignal,
): Promise<T[]> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${view}?${params}`, {
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            Accept: "application/json",
        },
        signal,
    });

    if (!res.ok) {
        throw new Error(`${view}: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as T[];
}

/** The `skills` view exposes a `group` column; the word is reserved in SQL. */
type RawSkillGroup = SkillGroup;

/**
 * Pull everything in parallel. Used by both the build-time snapshot generator
 * and the client-side refresh, so the two can never drift apart.
 */
export async function fetchSiteContent(
    signal?: AbortSignal,
): Promise<SiteContent> {
    const [
        chapters,
        domains,
        traits,
        entries,
        profileRows,
        experience,
        projects,
        education,
        volunteering,
        skills,
        judges,
        stats,
        weights,
    ] = await Promise.all([
        readView<Chapter>("public_chapters", "select=*&order=sort_order", signal),
        readView<Facet>("public_domains", "select=*&order=sort_order", signal),
        readView<Facet>("public_traits", "select=*&order=sort_order", signal),
        readView<TrailEntry>("public_trail_entries", "select=*&order=date.desc", signal),
        readView<Profile>("public_profile", "select=*", signal),
        readView<ExperienceRole>("public_experience", "select=*&order=sort_order", signal),
        readView<Project>("public_projects", "select=*&order=sort_order", signal),
        readView<Education>("public_education", "select=*&order=sort_order", signal),
        readView<Volunteering>("public_volunteering", "select=*&order=sort_order", signal),
        readView<RawSkillGroup>("public_skills", "select=*&order=sort_order", signal),
        readView<JudgeProfile>("public_judge_profiles", "select=*&order=sort_order", signal),
        readView<Stat>("public_stats", "select=*&order=sort_order", signal),
        readView<{ key: string; value: number }>("public_growth_weights", "select=*", signal),
    ]);

    return {
        chapters,
        domains,
        traits,
        entries,
        profile: profileRows[0] ?? null,
        experience,
        projects,
        education,
        volunteering,
        skills,
        judges,
        stats,
        growthWeights: Object.fromEntries(weights.map((w) => [w.key, w.value])),
        generatedAt: new Date().toISOString(),
    };
}

/* ── Small helpers the components share ───────────────────────────────────── */

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Render a date at the precision it is actually known to. */
export function formatEntryDate(
    date: string,
    precision: DatePrecision,
): string {
    const [y, m, d] = date.split("-").map(Number);
    if (precision === "year") return String(y);
    if (precision === "month") return `${MONTHS[m - 1]} ${y}`;
    return `${d} ${MONTHS[m - 1]} ${y}`;
}

/**
 * A span reads as a span. A 13-month chairmanship and a one-day contest should
 * not look identical on a timeline.
 */
export function formatEntryRange(entry: {
    date: string;
    end_date: string | null;
    precision: DatePrecision;
}): string {
    const start = formatEntryDate(entry.date, entry.precision);
    if (!entry.end_date) return start;
    const end = formatEntryDate(entry.end_date, entry.precision);
    return start === end ? start : `${start} to ${end}`;
}

export const TEASER_LINE = "Building it now. Live soon.";
