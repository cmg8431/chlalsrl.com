"use client";

import { useEffect, useRef, useState } from "react";

import { useT } from "@/shared";

type Size = "sm" | "md" | "lg";
const SIZES: Size[] = ["sm", "md", "lg"];

function stored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return (localStorage.getItem(key) as T | null) ?? fallback;
  } catch {
    return fallback;
  }
}

/** 글 상세 우하단의 읽기 도구 — 글자 크기와 집중 모드를 조절한다. */
export function ReadingControls() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<Size>("md");
  const [focus, setFocus] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 마운트 시 저장값 반영
  useEffect(() => {
    setSize(stored<Size>("reading-size", "md"));
    setFocus(stored<string>("reading-focus", "off") === "on");
  }, []);

  // 전역 설정 — <html> 데이터 속성으로 적용하고 저장, 페이지를 떠나도 유지
  // (첫 페인트 전 적용은 layout의 인라인 스크립트가 담당)
  useEffect(() => {
    const root = document.documentElement;
    if (size === "md") delete root.dataset.readingSize;
    else root.dataset.readingSize = size;
    if (focus) root.dataset.readingFocus = "on";
    else delete root.dataset.readingFocus;
    try {
      localStorage.setItem("reading-size", size);
      localStorage.setItem("reading-focus", focus ? "on" : "off");
    } catch {
      /* private mode */
    }
  }, [size, focus]);

  // 집중 모드: 뷰포트 중앙 밴드에 걸치는 본문 블록들을 밝힌다
  useEffect(() => {
    if (!focus) return;
    const prose = document.querySelector<HTMLElement>(".prose-blog");
    if (!prose) return;
    const blocks = Array.from(prose.children) as HTMLElement[];
    let raf = 0;
    const update = () => {
      const mid = window.innerHeight / 2;
      const half = window.innerHeight * 0.3;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      for (const b of blocks) {
        const r = b.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = b;
        }
        b.classList.toggle(
          "focus-active",
          r.bottom > mid - half && r.top < mid + half,
        );
      }
      // 큰 블록이 밴드를 다 덮는 경계 상황 대비 — 가장 가까운 블록은 항상 밝힌다
      best?.classList.add("focus-active");
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      for (const b of blocks) b.classList.remove("focus-active");
    };
  }, [focus]);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={rootRef} className="reading-fab no-print">
      {open && (
        <div className="reading-pop">
          <p className="reading-pop-label">{t("reading.size")}</p>
          <div className="reading-seg">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={size === s ? "is-active" : ""}
                style={{ fontSize: s === "sm" ? 12 : s === "lg" ? 17 : 14 }}
              >
                A
              </button>
            ))}
          </div>
          <button
            onClick={() => setFocus((v) => !v)}
            aria-pressed={focus}
            className="reading-focus-toggle"
          >
            <span>{t("reading.focus")}</span>
            <span
              className={`reading-switch ${focus ? "is-on" : ""}`}
              aria-hidden
            >
              <span />
            </span>
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("reading.title")}
        aria-expanded={open}
        className={`reading-trigger ${open ? "is-open" : ""}`}
      >
        Aa
      </button>
    </div>
  );
}
