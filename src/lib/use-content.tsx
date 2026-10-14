"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchSiteContent, isSupabaseConfigured, snapshotContent, type SiteContent } from "@/lib/content";

type ContentState = { content: SiteContent; source: "snapshot" | "live" };
const ContentContext = createContext<ContentState>({ content: snapshotContent, source: "snapshot" });

/** One public-data refresh per visit, shared across every section and route. */
export function SiteContentProvider({children}: {children: ReactNode}) {
  const [state, setState] = useState<ContentState>({ content: snapshotContent, source: "snapshot" });
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const controller = new AbortController();
    fetchSiteContent(controller.signal).then((content) => {
      if (controller.signal.aborted || (!content.entries.length && snapshotContent.entries.length)) return;
      setState({ content, source: "live" });
    }).catch(() => { /* The reviewed snapshot remains available offline. */ });
    return () => controller.abort();
  }, []);
  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

export function useSiteContent(): ContentState { return useContext(ContentContext); }
