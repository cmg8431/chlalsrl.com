"use client";

import { useTransitionRouter } from "next-view-transitions";
import { useEffect } from "react";

/** ←/→ 로 이전·다음 글 이동 — 입력 중이거나 수정키가 눌린 경우는 무시 */
export function PostKeyboardNav({
  prevHref,
  nextHref,
}: {
  prevHref?: string;
  nextHref?: string;
}) {
  const router = useTransitionRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
        return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      if (event.key === "ArrowLeft" && prevHref) router.push(prevHref);
      if (event.key === "ArrowRight" && nextHref) router.push(nextHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevHref, nextHref, router]);

  return null;
}
