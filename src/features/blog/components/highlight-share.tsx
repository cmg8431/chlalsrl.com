"use client";

import { useEffect, useRef, useState } from "react";

import { islandStore, useT } from "@/shared";

import { addHighlight } from "../libs/guestbook";

interface Anchor {
  x: number;
  y: number;
  text: string;
}

/**
 * 본문 선택 시 뜨는 문장 공유 버튼.
 * 링크는 브라우저 네이티브 Text Fragment(#:~:text=)라 열면 자동으로
 * 스크롤·하이라이트된다. 공유한 문장은 Supabase에 집계용으로 기록한다.
 */
export function HighlightShare({ slug }: { slug: string }) {
  const t = useT();
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? "";
      if (!sel || sel.isCollapsed || text.length < 8 || text.length > 300) {
        setAnchor(null);
        return;
      }
      const range = sel.getRangeAt(0);
      // 본문 안의 선택만 대상으로
      const container = range.commonAncestorContainer;
      const el =
        container.nodeType === Node.ELEMENT_NODE
          ? (container as Element)
          : container.parentElement;
      if (!el?.closest(".prose-blog")) {
        setAnchor(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      setAnchor({
        x: rect.left + rect.width / 2,
        y: rect.top,
        text,
      });
    };

    document.addEventListener("selectionchange", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      document.removeEventListener("selectionchange", update);
      window.removeEventListener("scroll", update);
    };
  }, []);

  if (!anchor) return null;

  const share = async () => {
    const clean = anchor.text.replace(/\s+/g, " ").trim();
    const url = `${location.origin}${location.pathname}#:~:text=${encodeURIComponent(clean)}`;
    try {
      await navigator.clipboard.writeText(url);
      islandStore.notify(t("post.highlight-copied"), {
        icon: "link",
        duration: 1400,
      });
    } catch {
      /* clipboard unavailable */
    }
    addHighlight(slug, clean);
    window.getSelection()?.removeAllRanges();
    setAnchor(null);
  };

  return (
    <div
      ref={barRef}
      className="hl-bar"
      style={{ left: anchor.x, top: anchor.y }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <button onClick={share} className="hl-btn">
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
          <path d="M4 7a3 3 0 0 1 3-3h4M20 17a3 3 0 0 1-3 3h-4" />
          <path d="M9 15 15 9" />
          <path d="M14 4h6v6M10 20H4v-6" />
        </svg>
        {t("post.highlight-share")}
      </button>
    </div>
  );
}
