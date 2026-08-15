/**
 * Growth algorithm for the Living Trail.
 *
 * The tree should reflect *momentum* as well as history. The algorithm
 * compares recency-weighted activity in the last 90 days against the 90
 * days before that and decides whether the trail is growing, steady, or
 * declining. It is a pure function of (entries, now), so every new entry
 * pushed to trail.json automatically moves the score.
 *
 * Scoring model:
 * - Each entry has a base weight by type:
 *     milestone 5 · win 3 · learning 2 · obstacle 2
 *   An obstacle that also records a learning earns +1 (an obstacle faced
 *   AND processed is growth, not damage).
 * - Recent window  = last 90 days, decayed with a 45-day half-life
 *   (an entry from yesterday counts ~2x one from six weeks ago).
 * - Previous window = 90–180 days ago, decayed the same way from day 90.
 * - Trend: recent > previous × 1.15 → "growing"
 *          recent < previous × 0.85 → "declining"
 *          no entry for 60+ days     → "declining"
 *          otherwise                 → "steady"
 * - Growth index (0–100) = lifetime component (log-scaled, max 60,
 *   so history builds a floor that one quiet month cannot erase)
 *   + momentum component (recent activity, max 40).
 * - Vitality (0.3–1) drives how lush the tree is drawn. It never reaches
 *   zero: the tree can wilt, but it does not die.
 */

export type EntryType = "milestone" | "win" | "obstacle" | "learning";

export interface TrailEntry {
    date: string;
    type: EntryType;
    chapter: string;
    title: string;
    note?: string;
    obstacle?: string;
    learning?: string;
    /** How exact the date is; approximate dates render as "2021" or "Nov 2022". */
    precision?: "day" | "month" | "year";
}

export interface GrowthReport {
    /** 0–100 composite growth index. */
    score: number;
    trend: "growing" | "steady" | "declining";
    /** 0.3–1, drives foliage density and color in the tree. */
    vitality: number;
    recentWeight: number;
    previousWeight: number;
    lifetimeWeight: number;
    daysSinceLastEntry: number;
}

const TYPE_WEIGHT: Record<EntryType, number> = {
    milestone: 5,
    win: 3,
    learning: 2,
    obstacle: 2,
};

const WINDOW_DAYS = 90;
const HALF_LIFE_DAYS = 45;
const MS_PER_DAY = 86_400_000;

export function entryWeight(entry: Pick<TrailEntry, "type" | "obstacle" | "learning">): number {
    let weight = TYPE_WEIGHT[entry.type] ?? 1;
    if (entry.obstacle && entry.learning) weight += 1;
    return weight;
}

export function computeGrowth(entries: TrailEntry[], now: Date): GrowthReport {
    let recentWeight = 0;
    let previousWeight = 0;
    let lifetimeWeight = 0;
    let daysSinceLastEntry = Number.POSITIVE_INFINITY;

    for (const entry of entries) {
        const ageDays =
            (now.getTime() - new Date(entry.date + "T00:00:00").getTime()) /
            MS_PER_DAY;
        if (ageDays < 0) continue; // future-dated entries don't count yet

        const weight = entryWeight(entry);
        lifetimeWeight += weight;
        daysSinceLastEntry = Math.min(daysSinceLastEntry, ageDays);

        if (ageDays <= WINDOW_DAYS) {
            recentWeight += weight * Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
        } else if (ageDays <= WINDOW_DAYS * 2) {
            previousWeight +=
                weight * Math.pow(0.5, (ageDays - WINDOW_DAYS) / HALF_LIFE_DAYS);
        }
    }

    let trend: GrowthReport["trend"] = "steady";
    if (daysSinceLastEntry > 60) {
        trend = "declining";
    } else if (recentWeight > previousWeight * 1.15 && recentWeight > 0) {
        trend = "growing";
    } else if (recentWeight < previousWeight * 0.85) {
        trend = "declining";
    }

    const lifetimeScore = Math.min(60, Math.log2(lifetimeWeight + 1) * 10);
    const momentumScore = Math.min(40, recentWeight * 5);
    const score = Math.round(lifetimeScore + momentumScore);

    let vitality = 0.45 + 0.55 * Math.min(1, recentWeight / 10);
    if (trend === "declining") vitality *= 0.75;
    vitality = Math.max(0.3, Math.min(1, vitality));

    return {
        score,
        trend,
        vitality,
        recentWeight,
        previousWeight,
        lifetimeWeight,
        daysSinceLastEntry: Number.isFinite(daysSinceLastEntry)
            ? Math.floor(daysSinceLastEntry)
            : -1,
    };
}
