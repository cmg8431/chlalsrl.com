"use client";

import { useTransitionRouter } from "next-view-transitions";
import { useCallback, useEffect } from "react";

import { slideNavigate } from "../libs/slide-nav";

interface NavPost {
  href: string;
  title: string;
}

/**
 * 이전/다음 글 이동 — 좌우 슬라이드 전환.
 * 클릭·키보드(←/→)·모바일 좌우 스와이프를 모두 지원한다.
 * older = 이전 글(왼쪽/오른쪽 스와이프), newer = 다음 글(오른쪽/왼쪽 스와이프)
 */
export function PostNav({
  older,
  newer,
  prevLabel,
  nextLabel,
}: {
  older?: NavPost;
  newer?: NavPost;
  prevLabel: string;
  nextLabel: string;
}) {
  const router = useTransitionRouter();

  const goOlder = useCallback(() => {
    if (older) slideNavigate(router, older.href, "back");
  }, [older, router]);

  const goNewer = useCallback(() => {
    if (newer) slideNavigate(router, newer.href, "forward");
  }, [newer, router]);

  // 키보드 ←/→
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.key === "ArrowLeft" && older) {
        e.preventDefault();
        goOlder();
      }
      if (e.key === "ArrowRight" && newer) {
        e.preventDefault();
        goNewer();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [older, newer, goOlder, goNewer]);

  // 모바일 좌우 스와이프
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (e.touches.length !== 1 || !touch) {
        tracking = false;
        return;
      }
      startX = touch.clientX;
      startY = touch.clientY;
      tracking = true;
    };
    const onEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const touch = e.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      // 가로 이동이 충분히 크고 세로보다 확실히 우세할 때만
      if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
      if (dx < 0) goNewer();
      else goOlder();
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [goOlder, goNewer]);

  if (!older && !newer) return null;

  return (
    <nav className="mt-16 flex items-start justify-between gap-8">
      {older ? (
        <button
          type="button"
          onClick={goOlder}
          className="arrow-link group min-w-0 flex-1 text-left"
        >
          <span className="text-xs text-faint">
            <span className="arrow inline-block rotate-180">→</span> {prevLabel}
          </span>
          <span className="mt-1.5 block truncate text-sm text-foreground transition-colors group-hover:text-bright">
            {older.title}
          </span>
        </button>
      ) : (
        <span className="flex-1" />
      )}
      {newer && (
        <button
          type="button"
          onClick={goNewer}
          className="arrow-link group min-w-0 flex-1 text-right"
        >
          <span className="text-xs text-faint">
            {nextLabel} <span className="arrow">→</span>
          </span>
          <span className="mt-1.5 block truncate text-sm text-foreground transition-colors group-hover:text-bright">
            {newer.title}
          </span>
        </button>
      )}
    </nav>
  );
}
