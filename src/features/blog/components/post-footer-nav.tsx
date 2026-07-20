"use client";

import { Link } from "next-view-transitions";

/** 댓글까지 읽고 내려온 사람을 위한 최하단 내비게이션 */
export function PostFooterNav({
  locale,
  backLabel,
  topLabel,
}: {
  locale: string;
  backLabel: string;
  topLabel: string;
}) {
  return (
    <div className="no-print mt-16 flex items-center justify-between">
      <Link
        href={`/${locale}/blog`}
        className="arrow-link text-sm text-faint transition-colors hover:text-bright"
      >
        <span className="arrow inline-block rotate-180">→</span> {backLabel}
      </Link>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-center gap-1.5 text-sm text-faint transition-colors hover:text-bright"
      >
        {topLabel}
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
