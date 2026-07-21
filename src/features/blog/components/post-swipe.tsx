"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface NavPost {
  href: string;
  title: string;
}

const SPRING = "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * 모바일 인터랙티브 스와이프 — 손가락을 따라 현재 글이 밀리고
 * 목표 글의 프리뷰가 반대편에서 함께 따라 들어온다.
 * 화면 폭의 일정 비율 이상 당기면 이동, 아니면 제자리로 스냅백.
 *
 * older = 오른쪽으로 당김(이전 글), newer = 왼쪽으로 당김(다음 글)
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
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!older && !newer) return;

    // 다음 이동을 빠르게 — 대상 글 미리 프리페치
    if (older) router.prefetch(older.href);
    if (newer) router.prefetch(newer.href);

    const main = document.querySelector("main");
    const preview = previewRef.current;
    if (!main || !preview) return;

    let startX = 0;
    let startY = 0;
    let vw = window.innerWidth;
    let engaged = false;
    let rejected = false;
    let target: NavPost | null = null;
    let dirSign = 0; // newer(왼쪽으로 밀기) = -1, older = +1

    const setTransition = (on: boolean) => {
      const t = on ? SPRING : "none";
      main.style.transition = t;
      preview.style.transition = on ? `${SPRING}, opacity 0.42s ease` : "none";
    };

    const paint = (dx: number) => {
      main.style.transform = `translateX(${dx}px)`;
      // 프리뷰는 밀어낸 방향 반대편 화면 밖에서 대기하다 함께 들어온다
      const base = dirSign < 0 ? vw : -vw;
      preview.style.transform = `translateX(${base + dx}px)`;
      preview.style.opacity = String(Math.min(1, Math.abs(dx) / (vw * 0.5)));
    };

    const reset = () => {
      main.style.transition = "";
      main.style.transform = "";
      preview.style.transition = "";
      preview.style.transform = "";
      preview.style.opacity = "0";
    };

    const onStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      engaged = false;
      rejected = false;
      target = null;
      if (e.touches.length !== 1 || !touch) {
        rejected = true;
        return;
      }
      // 가로 스크롤 영역(코드블록·표) 위에서는 스와이프를 잡지 않는다
      const el = touch.target as HTMLElement | null;
      if (el?.closest("pre, table, [data-no-swipe]")) {
        rejected = true;
        return;
      }
      startX = touch.clientX;
      startY = touch.clientY;
      vw = window.innerWidth;
    };

    const onMove = (e: TouchEvent) => {
      if (rejected) return;
      const touch = e.touches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (!engaged) {
        if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.2) {
          if (Math.abs(dy) > 12) rejected = true; // 세로 스크롤로 확정
          return;
        }
        const wantNewer = dx < 0;
        target = wantNewer ? newer ?? null : older ?? null;
        if (!target) {
          rejected = true;
          return;
        }
        dirSign = wantNewer ? -1 : 1;
        // 프리뷰 내용 채우기
        if (labelRef.current)
          labelRef.current.textContent = wantNewer ? nextLabel : prevLabel;
        if (titleRef.current) titleRef.current.textContent = target.title;
        engaged = true;
        setTransition(false);
      }

      if (engaged) {
        e.preventDefault();
        // 방향이 맞을 때만 따라오고, 반대로 밀면 저항(제자리 근처)
        const follow = dirSign < 0 ? Math.min(dx, 0) : Math.max(dx, 0);
        paint(follow);
      }
    };

    const onEnd = () => {
      if (!engaged || !target) {
        rejected = false;
        engaged = false;
        return;
      }
      const current = new DOMMatrix(getComputedStyle(main).transform);
      const dx = current.m41; // 현재 translateX(px)
      const committed = Math.abs(dx) > vw * 0.3;
      const dest = target.href;

      setTransition(true);
      if (committed) {
        // 끝까지 밀어내고 프리뷰를 중앙으로 → 이동
        main.style.transform = `translateX(${dirSign * vw}px)`;
        preview.style.transform = "translateX(0px)";
        preview.style.opacity = "1";
        window.setTimeout(() => {
          router.push(dest);
          // 새 페이지가 프리뷰 뒤에서 렌더된 뒤 원위치 복구
          window.setTimeout(reset, 160);
        }, 360);
      } else {
        // 스냅백
        main.style.transform = "translateX(0px)";
        const base = dirSign < 0 ? vw : -vw;
        preview.style.transform = `translateX(${base}px)`;
        preview.style.opacity = "0";
        window.setTimeout(reset, 420);
      }
      engaged = false;
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
      reset();
    };
  }, [mounted, older, newer, prevLabel, nextLabel, router]);

  if (!mounted || (!older && !newer)) return null;

  // main에 걸리는 transform에 갇히지 않도록 프리뷰는 body로 포탈
  return createPortal(
    <div ref={previewRef} className="swipe-preview" aria-hidden>
      <div className="swipe-preview-inner">
        <span ref={labelRef} className="swipe-preview-label" />
        <h2 ref={titleRef} className="swipe-preview-title" />
      </div>
    </div>,
    document.body
  );
}
