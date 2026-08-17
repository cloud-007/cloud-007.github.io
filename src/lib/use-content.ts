"use client";

import { useEffect, useState } from "react";
import {
    fetchSiteContent,
    isSupabaseConfigured,
    snapshotContent,
    type SiteContent,
} from "@/lib/content";

/**
 * The site's content, snapshot first and live second.
 *
 * Render begins from the committed snapshot, so there is no loading state, no
 * layout shift, and no blank page if Supabase is asleep. The live read then
 * replaces it in place when it lands. A failed read is not an error worth
 * showing anyone: the snapshot is still correct, just possibly a build old.
 *
 * `source` is exposed mostly for the dev console. Nothing user-facing should
 * depend on which path won.
 */
export function useSiteContent(): {
    content: SiteContent;
    source: "snapshot" | "live";
} {
    const [content, setContent] = useState<SiteContent>(snapshotContent);
    const [source, setSource] = useState<"snapshot" | "live">("snapshot");

    useEffect(() => {
        if (!isSupabaseConfigured) return;

        const controller = new AbortController();
        let cancelled = false;

        fetchSiteContent(controller.signal)
            .then((live) => {
                if (cancelled) return;
                // An empty live result almost always means a misconfigured key
                // or a paused project, not a genuinely empty site. Keep what we
                // have rather than blanking the page.
                if (!live.entries.length && snapshotContent.entries.length) return;
                setContent(live);
                setSource("live");
            })
            .catch(() => {
                /* snapshot stands */
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, []);

    return { content, source };
}
