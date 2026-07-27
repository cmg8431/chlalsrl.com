"use client";

import { useEffect, useState } from "react";

/**
 * 아래쪽 표시등. 지금 읽고 있는 섹션만 비춘다.
 * 여닫는 버튼은 뺐다 — 접어둘 내용이 없으면 누를 이유도 없다.
 */
export function ResumeControls() {
  const [section, setSection] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // 화면 위쪽 띠를 지나는 섹션을 현재 섹션으로 삼는다
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-label]"),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) {
          setSection((hit.target as HTMLElement).dataset.sectionLabel ?? null);
        }
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 },
    );
    for (const node of sections) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`no-print resume-guide ${visible ? "is-shown" : ""}`}
    >
      <span className="resume-guide-dot" />
      <span className="resume-guide-label">{section}</span>
    </div>
  );
}
