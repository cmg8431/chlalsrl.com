"use client";

import { islandStore, useT } from "@/shared";

const BUTTON_CLASS =
  "flex items-center gap-2 rounded-full px-3 py-2 text-sm text-faint transition-all hover:text-bright active:scale-95";

/** 글 하단 공유 액션 — X 공유 + 링크 복사 */
export function ShareRow({ title }: { title: string }) {
  const t = useT();

  const shareX = () => {
    const url = `https://twitter.com/intent/tweet?${new URLSearchParams({
      text: title,
      url: location.href,
      via: "cmg8431",
    })}`;
    window.open(url, "_blank", "noopener,noreferrer,width=560,height=640");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      islandStore.notify(t("island.copied-link"), {
        icon: "link",
        duration: 1100,
      });
    } catch {
      /* clipboard 미지원 */
    }
  };

  return (
    <>
      <button onClick={shareX} className={BUTTON_CLASS}>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.3l13.3 17.4Z" />
        </svg>
        {t("post.share-x")}
      </button>
      <button onClick={copyLink} className={BUTTON_CLASS}>
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
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        {t("post.copy-link")}
      </button>
    </>
  );
}
