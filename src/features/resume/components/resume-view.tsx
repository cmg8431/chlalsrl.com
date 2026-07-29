"use client";

import { useEffect } from "react";

import { recordResumeView } from "../libs";

/** 탭을 열어둔 채 브라우저가 죽어도 읽은 만큼은 남게 하는 간격(ms) */
const HEARTBEAT = 30_000;

/**
 * 이 링크가 언제, 얼마나, 어디까지 읽혔는지를 방문 한 줄로 남긴다.
 *
 * 들어올 때 보내면 열자마자 닫은 사람과 끝까지 읽은 사람이 같은 한 줄이 된다.
 * 그렇다고 첫 이탈에 확정해버리면 탭을 오가며 읽는 사람이 실제보다 훨씬 짧게
 * 찍힌다 — 채용 담당자가 딱 그렇게 읽는다. 그래서 화면에 떠 있던 시간만 모으고,
 * 숨김·닫힘·주기적으로 같은 visit_id 로 계속 덮어쓴다(큰 값이 남는다).
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
    const visitId = crypto.randomUUID();
    let deepest: string | null = null;

    // 뒤 탭으로 열렸으면 앞으로 나오기 전까진 읽는 시간이 아니다
    let shownAt =
      document.visibilityState === "visible" ? performance.now() : null;
    let visibleMs = 0;

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

    // 몇 번을 보내든 visit_id 가 같으므로 서버에는 한 줄로 모인다
    const send = () => {
      if (shownAt !== null) {
        visibleMs += performance.now() - shownAt;
        shownAt = performance.now();
      }
      recordResumeView({
        visitId,
        company: company ?? null,
        locale,
        referrer: document.referrer || null,
        seconds: Math.round(visibleMs / 1000),
        deepestSection: deepest,
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        send();
        shownAt = null; // 뒤로 물러난 동안은 시간이 흐르지 않는다
      } else {
        shownAt = performance.now();
      }
    };

    const beat = setInterval(() => {
      if (shownAt !== null) send();
    }, HEARTBEAT);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", send);
    return () => {
      send(); // 사이트 안에서 다른 글로 넘어가는 것도 이 방문의 끝이다
      clearInterval(beat);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", send);
    };
  }, [company, locale]);

  return null;
}
