"use client";

import { useT } from "../libs";

import { islandStore } from "./layouts/island-store";

export function ThemeToggle() {
  const t = useT();

  const toggle = () => {
    const root = document.documentElement;
    const resolved =
      root.dataset.theme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    const next = resolved === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode */
    }
    islandStore.notify(t(`island.theme-${next}`), {
      icon: next === "dark" ? "moon" : "sun",
      duration: 1000,
    });
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex h-7 w-7 items-center justify-center rounded-full text-sm text-faint transition-colors hover:bg-soft hover:text-bright"
    >
      ◐
    </button>
  );
}
