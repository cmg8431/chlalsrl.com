"use client";

import { Link } from "next-view-transitions";

import { useLocale } from "@/shared";

const COPY: Record<
  string,
  { message: string; home: string; search: string }
> = {
  ko: {
    message: "이런 페이지는 없어요.",
    home: "홈으로 돌아가기",
    search: "글 검색하기",
  },
  en: {
    message: "This page doesn't exist.",
    home: "Back home",
    search: "Search posts",
  },
  ja: {
    message: "このページは存在しません。",
    home: "ホームに戻る",
    search: "記事を検索",
  },
};

export default function NotFound() {
  const locale = useLocale();
  const copy = COPY[locale] ?? COPY.en!;

  return (
    <div className="flex flex-col items-center py-28 text-center">
      <p className="select-none font-mono text-6xl font-semibold tracking-tight text-faint/60">
        404
      </p>
      <p className="mt-6 text-muted">{copy.message}</p>
      <div className="mt-8 flex items-center gap-5">
        <Link href={`/${locale}`} className="arrow-link text-sm text-bright">
          {copy.home} <span className="arrow">→</span>
        </Link>
        <button
          onClick={() => window.dispatchEvent(new Event("open-search"))}
          className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-bright"
        >
          {copy.search}
          <span className="rounded-full bg-soft px-2 py-0.5 font-mono text-[11px] text-faint">
            ⌘K
          </span>
        </button>
      </div>
    </div>
  );
}
