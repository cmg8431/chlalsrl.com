"use client";

import { useRef } from "react";

import type { TocItem } from "../libs/toc";

/** 데스크톱 aside가 숨는 폭(<80rem)에서 쓰는 접이식 목차 */
export function MobileToc({
  items,
  label,
}: {
  items: TocItem[];
  label: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  if (items.length < 2) return null;

  return (
    <details
      ref={ref}
      className="no-print mt-8 rounded-xl border border-line xl:hidden"
    >
      <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 text-sm font-medium text-bright [&::-webkit-details-marker]:hidden">
        {label}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="text-faint transition-transform [details[open]_&]:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <ul className="space-y-2.5 border-t border-line px-4 py-3.5 text-[13px] leading-snug">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? "pl-3.5" : ""}>
            <a
              href={`#${item.id}`}
              onClick={() => {
                if (ref.current) ref.current.open = false;
              }}
              className="block text-muted transition-colors hover:text-bright"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
