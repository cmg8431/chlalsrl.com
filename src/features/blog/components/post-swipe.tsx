"use client";

import { useRouter } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { slideNavigate } from "../libs/slide-nav";

interface NavPost {
  href: string;
  title: string;
}

const SPRING = "cubic-bezier(0.34, 1.3, 0.5, 1)";
const THRESHOLD = 88; // 이만큼 당기면 arm(놓으면 이동)

/**
 * 모바일 스와이프 — 당기면 가장자리에서 그라데이션 오버레이가 스며 나오며
 * 다음/이전 글 제목이 떠오른다. 임계점 이상 당겨서 놓으면 이동, 아니면 스냅백.
 *
 * older = 오른쪽으로 당김(이전 글, 왼쪽 가장자리), newer = 왼쪽으로 당김(다음 글, 오른쪽 가장자리)
 */
export function PostSwipe({
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
  const tRouter = useTransitionRouter();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!older && !newer) return;
    if (older) router.prefetch(older.href);
    if (newer) router.prefetch(newer.href);

    const main = document.querySelector("main");
    const overlay = overlayRef.current;
    const inner = innerRef.current;
    if (!main || !overlay || !inner) return;

    let startX = 0;
    let startY = 0;
    let engaged = false;
    let rejected = false;
    let armed = false;
    let target: NavPost | null = null;
    let dirSign = 0; // newer = -1, older = +1

    const damp = (p: number) =>
      0.32 * Math.min(p, THRESHOLD) + 0.14 * Math.max(0, p - THRESHOLD);

    const paint = (pull: number) => {
      // 본문은 고무줄처럼 살짝 밀린다
      main.style.transform = `translateX(${dirSign * damp(pull)}px)`;
      // 오버레이는 서서히 짙어지고, 텍스트는 가장자리에서 안쪽으로 떠오른다
      const reveal = Math.min(1, pull / THRESHOLD);
      overlay.style.opacity = String(reveal);
      inner.style.transform = `translateY(-50%) translateX(${dirSign * 28 * (1 - reveal)}px)`;

      const nextArmed = pull >= THRESHOLD;
      if (nextArmed !== armed) {
        armed = nextArmed;
        overlay.classList.toggle("is-armed", armed);
      }
    };

    const resetStyles = () => {
      main.style.transition = "";
      main.style.transform = "";
      overlay.style.transition = "";
      overlay.style.opacity = "0";
      inner.style.transition = "";
      inner.style.transform = "";
      overlay.classList.remove("is-armed");
    };

    const springBack = () => {
      main.style.transition = `transform 0.42s ${SPRING}`;
      overlay.style.transition = "opacity 0.3s ease";
      inner.style.transition = `transform 0.42s ${SPRING}`;
      main.style.transform = "translateX(0px)";
      overlay.style.opacity = "0";
      inner.style.transform = `translateY(-50%) translateX(${dirSign * 28}px)`;
      overlay.classList.remove("is-armed");
      window.setTimeout(resetStyles, 440);
    };

    const onStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      engaged = false;
      rejected = false;
      armed = false;
      target = null;
      if (e.touches.length !== 1 || !touch) {
        rejected = true;
        return;
      }
      const el = touch.target as HTMLElement | null;
      if (el?.closest("pre, table, [data-no-swipe]")) {
        rejected = true;
        return;
      }
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const onMove = (e: TouchEvent) => {
      if (rejected) return;
      const touch = e.touches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (!engaged) {
        if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.2) {
          if (Math.abs(dy) > 12) rejected = true;
          return;
        }
        const wantNewer = dx < 0;
        target = wantNewer ? (newer ?? null) : (older ?? null);
        if (!target) {
          rejected = true;
          return;
        }
        dirSign = wantNewer ? -1 : 1;
        if (labelRef.current)
          labelRef.current.textContent = wantNewer ? nextLabel : prevLabel;
        if (titleRef.current) titleRef.current.textContent = target.title;
        overlay.classList.toggle("swipe-overlay--left", !wantNewer);
        engaged = true;
        main.style.transition = "none";
        overlay.style.transition = "none";
        inner.style.transition = "none";
      }

      if (engaged) {
        e.preventDefault();
        const pull = dirSign < 0 ? Math.max(0, -dx) : Math.max(0, dx);
        paint(pull);
      }
    };

    const onEnd = () => {
      if (!engaged || !target) {
        engaged = false;
        rejected = false;
        return;
      }
      const dest = target.href;
      const dir = dirSign < 0 ? "forward" : "back";
      engaged = false;

      if (armed) {
        // 오버레이는 걷히고, 페이지 전체 슬라이드 전환이 이어받는다
        overlay.style.transition = "opacity 0.2s ease";
        overlay.style.opacity = "0";
        main.style.transition = "none";
        main.style.transform = "";
        window.setTimeout(resetStyles, 220);
        slideNavigate(tRouter, dest, dir);
      } else {
        springBack();
      }
      target = null;
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
      resetStyles();
    };
  }, [mounted, older, newer, prevLabel, nextLabel, router, tRouter]);

  if (!mounted || (!older && !newer)) return null;

  return createPortal(
    <div ref={overlayRef} className="swipe-overlay" aria-hidden>
      <div ref={innerRef} className="swipe-overlay-inner">
        <span ref={labelRef} className="swipe-overlay-label" />
        <h2 ref={titleRef} className="swipe-overlay-title" />
      </div>
    </div>,
    document.body,
  );
}
