"use client";

import { useEffect, useState } from "react";

import { useT } from "@/shared";

import {
  fetchTopHighlight,
  type HighlightSummary as Top,
} from "../libs/guestbook";

export function TopHighlight({ slug }: { slug: string }) {
  const t = useT();
  const [top, setTop] = useState<Top | null>(null);

  useEffect(() => {
    fetchTopHighlight(slug)
      .then(setTop)
      .catch(() => setTop(null));
  }, [slug]);

  if (!top) return null;

  const href = `#:~:text=${encodeURIComponent(top.text)}`;

  return (
    <aside className="mt-16 rounded-xl border border-line bg-soft/40 p-5">
      <p className="text-[11px] font-medium uppercase tracking-widest text-faint">
        {t("post.top-highlight")}
      </p>
      <a
        href={href}
        className="mt-2 block text-[15px] leading-relaxed text-foreground transition-colors hover:text-bright"
      >
        <span className="mr-1 text-accent">“</span>
        {top.text}
        <span className="ml-0.5 text-accent">”</span>
      </a>
      <p className="mt-2 font-mono text-[11px] text-faint">
        {t("post.highlight-count", { count: top.count })}
      </p>
    </aside>
  );
}
