"use client";

import { useEffect } from "react";

import { recordResumeView } from "../libs";

/**
 * 이 링크가 언제, 얼마나, 어디까지 읽혔는지를 떠날 때 한 번 남긴다.
 *
 * 들어올 때 보내면 열자마자 닫은 사람과 끝까지 읽은 사람이 같은 한 줄이 된다.
 * 머문 시간과 가장 깊이 내려간 섹션은 떠나는 순간에만 알 수 있어서,
 * 탭이 숨겨지거나 닫히는 시점에 keepalive 요청으로 보낸다.
 *
 * 화면에는 아무것도 그리지 않는다 — 읽는 사람이 눈치챌 일이 없어야 한다.
 */
export function ResumeView({
  company,
  locale,
}: {
  company?: string;
  locale: string;
}) {
  useEffect(() => {
    const startedAt = performance.now();
    let deepest: string | null = null;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-label]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          deepest =
            (entry.target as HTMLElement).dataset.sectionLabel ?? deepest;
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    for (const section of sections) observer.observe(section);

    // 숨김과 닫힘이 둘 다 걸릴 수 있다 — 방문 하나에 기록도 하나여야 한다
    let sent = false;
    const send = () => {
      if (sent) return;
      sent = true;
      recordResumeView({
        company: company ?? null,
        locale,
        referrer: document.referrer || null,
        seconds: Math.round((performance.now() - startedAt) / 1000),
        deepestSection: deepest,
      });
    };

    const onHide = () => {
      if (document.visibilityState === "hidden") send();
    };

    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", send);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", send);
    };
  }, [company, locale]);

  return null;
}
