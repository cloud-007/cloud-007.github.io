"use client";

import { useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";

type Theme = "system" | "light" | "dark";
const KEY = "portfolio-theme-v1";
const EVENT = "portfolio-theme-change";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}
function getTheme(): Theme {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch { return "system"; }
}
function setTheme(theme: Theme) {
  try { localStorage.setItem(KEY, theme); } catch { /* Session choice still works. */ }
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(EVENT));
}

export function ThemeSelect() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "system" as Theme);
  return (
    <label className="theme-control">
      <span className="sr-only">Color theme</span>
      <select aria-label="Color theme" value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <ChevronDown className="theme-chevron" size={13} aria-hidden="true" />
    </label>
  );
}
