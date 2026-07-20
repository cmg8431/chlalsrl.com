"use client";

import { useT } from "../libs";

import { islandStore } from "./layouts/island-store";

type ThemeChoice = "light" | "dark" | "system";

function storedTheme(): ThemeChoice {
  try {
    const value = localStorage.getItem("theme");
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

/** 라이트 → 다크 → 시스템 순환 */
const NEXT: Record<ThemeChoice, ThemeChoice> = {
  system: "light",
  light: "dark",
  dark: "system",
};

export function ThemeToggle() {
  const t = useT();

  const cycle = () => {
    const root = document.documentElement;
    const next = NEXT[storedTheme()];

    try {
      if (next === "system") {
        delete root.dataset.theme;
        localStorage.removeItem("theme");
      } else {
        root.dataset.theme = next;
        localStorage.setItem("theme", next);
      }
    } catch {
      /* private mode */
    }

    const resolvedDark =
      next === "dark" ||
      (next === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    islandStore.notify(t(`island.theme-${next}`), {
      icon: resolvedDark ? "moon" : "sun",
      duration: 1000,
    });
  };

  return (
    <button
      onClick={cycle}
      aria-label="Toggle theme"
      className="flex h-7 w-7 items-center justify-center rounded-full text-sm text-faint transition-colors hover:bg-soft hover:text-bright"
    >
      ◐
    </button>
  );
}
