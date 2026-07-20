"use client";

import { Link } from "next-view-transitions";

import { useLocale } from "@/shared";

const COPY: Record<string, { message: string; home: string }> = {
  ko: { message: "이런 페이지는 없어요.", home: "홈으로 돌아가기" },
  en: { message: "This page doesn't exist.", home: "Back home" },
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
      <Link
        href={`/${locale}`}
        className="arrow-link mt-8 text-sm text-bright"
      >
        {copy.home} <span className="arrow">→</span>
      </Link>
    </div>
  );
}
