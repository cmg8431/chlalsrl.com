"use client";

import { useLocale } from "@/shared";

const COPY: Record<string, { message: string; retry: string; home: string }> = {
  ko: {
    message: "문제가 생겼어요. 잠시 후 다시 시도해주세요.",
    retry: "다시 시도",
    home: "홈으로 돌아가기",
  },
  en: {
    message: "Something went wrong. Please try again.",
    retry: "Try again",
    home: "Back home",
  },
  ja: {
    message: "問題が発生しました。しばらくしてからもう一度お試しください。",
    retry: "再試行",
    home: "ホームに戻る",
  },
};

export default function ErrorPage({ reset }: { reset: () => void }) {
  const locale = useLocale();
  const copy = COPY[locale] ?? COPY.en!;

  return (
    <div className="flex flex-col items-center py-28 text-center">
      <p className="select-none font-mono text-6xl font-semibold tracking-tight text-faint/60">
        500
      </p>
      <p className="mt-6 text-muted">{copy.message}</p>
      <div className="mt-8 flex items-center gap-5">
        <button
          onClick={reset}
          className="rounded-full border border-line px-4 py-2 text-sm text-bright transition-colors hover:border-faint"
        >
          {copy.retry}
        </button>
        <a
          href={`/${locale}`}
          className="arrow-link text-sm text-muted transition-colors hover:text-bright"
        >
          {copy.home} <span className="arrow">→</span>
        </a>
      </div>
    </div>
  );
}
