"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "../libs/toc";

interface TocProps {
  items: TocItem[];
  label: string;
}

export function Toc({ items, label }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-96px 0px -66% 0px", threshold: 0 }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav className="no-print toc" aria-label={label}>
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-faint">
        {label}
      </p>
      <ul className="space-y-2 text-[13px] leading-snug">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? "pl-3.5" : ""}>
            <a
              href={`#${item.id}`}
              className={`block transition-colors duration-300 ${
                activeId === item.id
                  ? "text-bright"
                  : "text-faint hover:text-muted"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
