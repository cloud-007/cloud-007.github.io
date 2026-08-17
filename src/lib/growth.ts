/**
 * Growth algorithm for the Living Trail.
 *
 * The tree reflects momentum as well as history. The algorithm compares
 * recency-weighted activity in the last 90 days against the 90 days before
 * that and decides whether the trail is growing, steady, or declining. It is a
 * pure function of (entries, weights, now), so every new entry moves the score.
 *
 * Why this was rescaled
 * ---------------------
 * The previous version capped the lifetime component at 60 via
 * `min(60, log2(w + 1) * 10)`. At 29 entries the lifetime weight was already
 * ~119, so `log2(120) * 10 = 69` was clamped. Momentum was clamped too. The
 * score sat at a permanent 100 and the tree could no longer say anything about
 * how the last month had actually gone, which is the entire premise of the
 * page. Backfilling a decade of history would not have moved it by a point.
 *
 * The rescale keeps the same shape but leaves headroom in both components, so
 * a busy month visibly greens the canopy and a quiet one visibly thins it.
 *
 * Every constant lives in the `growth_weights` table, so the curve can be
 * tuned from the Supabase dashboard without a deploy.
 */

export type EntryType = "milestone" | "win" | "obstacle" | "learning";

export interface GrowthEntry {
    date: string;
    type: EntryType;
    obstacle?: string | null;
    learning?: string | null;
}

export interface GrowthReport {
    /** 0-100 composite growth index. */
    score: number;
    trend: "growing" | "steady" | "declining";
    /** 0.3-1, drives foliage density and colour in the tree. */
    vitality: number;
    recentWeight: number;
    previousWeight: number;
    lifetimeWeight: number;
    daysSinceLastEntry: number;
    /** Exposed so the UI can show what history versus momentum contributed. */
    lifetimeScore: number;
    momentumScore: number;
}

export type GrowthWeights = Record<string, number>;

/**
 * Defaults, used when the database is unreachable. These match the values
 * seeded in supabase/02-seed.sql; the table is the source of truth.
 */
export const DEFAULT_WEIGHTS: GrowthWeights = {
    weight_milestone: 5,
    weight_win: 4,
    weight_learning: 2,
    weight_obstacle: 2,
    bonus_processed: 1,
    window_days: 90,
    half_life_days: 45,
    lifetime_cap: 50,
    lifetime_scale: 5,
    momentum_cap: 50,
    momentum_scale: 1.0,
    stale_days: 60,
    vitality_floor: 0.3,
    vitality_base: 0.42,
    vitality_span: 0.58,
    vitality_target: 42,
};

const MS_PER_DAY = 86_400_000;

function weightFor(entry: GrowthEntry, w: GrowthWeights): number {
    const base =
        entry.type === "milestone" ? w.weight_milestone
        : entry.type === "win" ? w.weight_win
        : entry.type === "learning" ? w.weight_learning
        : w.weight_obstacle;

    // An obstacle faced AND processed is growth, not damage.
    return entry.obstacle && entry.learning ? base + w.bonus_processed : base;
}

export function entryWeight(entry: GrowthEntry, weights?: GrowthWeights): number {
    return weightFor(entry, { ...DEFAULT_WEIGHTS, ...weights });
}

export function computeGrowth(
    entries: GrowthEntry[],
    now: Date,
    weights?: GrowthWeights,
): GrowthReport {
    const w = { ...DEFAULT_WEIGHTS, ...weights };

    let recentWeight = 0;
    let previousWeight = 0;
    let lifetimeWeight = 0;
    let daysSinceLastEntry = Number.POSITIVE_INFINITY;

    for (const entry of entries) {
        const ageDays =
            (now.getTime() - new Date(entry.date + "T00:00:00").getTime()) /
            MS_PER_DAY;
        if (ageDays < 0) continue; // future-dated entries do not count yet

        const weight = weightFor(entry, w);
        lifetimeWeight += weight;
        daysSinceLastEntry = Math.min(daysSinceLastEntry, ageDays);

        if (ageDays <= w.window_days) {
            recentWeight += weight * Math.pow(0.5, ageDays / w.half_life_days);
        } else if (ageDays <= w.window_days * 2) {
            previousWeight +=
                weight *
                Math.pow(0.5, (ageDays - w.window_days) / w.half_life_days);
        }
    }

    let trend: GrowthReport["trend"] = "steady";
    if (daysSinceLastEntry > w.stale_days) {
        trend = "declining";
    } else if (recentWeight > previousWeight * 1.15 && recentWeight > 0) {
        trend = "growing";
    } else if (recentWeight < previousWeight * 0.85) {
        trend = "declining";
    }

    // History builds a floor that one quiet month cannot erase, but it no
    // longer saturates: reaching the cap would take roughly a thousand weight.
    const lifetimeScore = Math.min(
        w.lifetime_cap,
        Math.log2(lifetimeWeight + 1) * w.lifetime_scale,
    );

    // Momentum is the half that is supposed to move week to week.
    const momentumScore = Math.min(
        w.momentum_cap,
        recentWeight * w.momentum_scale,
    );

    const score = Math.round(lifetimeScore + momentumScore);

    let vitality =
        w.vitality_base +
        w.vitality_span * Math.min(1, recentWeight / w.vitality_target);
    if (trend === "declining") vitality *= 0.75;
    vitality = Math.max(w.vitality_floor, Math.min(1, vitality));

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
        lifetimeScore,
        momentumScore,
    };
}
