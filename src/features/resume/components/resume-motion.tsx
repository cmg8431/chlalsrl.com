"use client";

import { useEffect } from "react";

/** "61% → 78%" 처럼 앞뒤 수가 있는 값에서 숫자만 뽑는다 */
function parseNumber(text: string): { value: number; decimals: number } | null {
  const match = text.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const raw = match[0];
  const dot = raw.indexOf(".");
  return {
    value: Number.parseFloat(raw),
    decimals: dot === -1 ? 0 : raw.length - dot - 1,
  };
}

/**
 * 화면에 들어오면 뒷숫자가 앞숫자에서부터 굴러가고, 아래 얇은 선이
 * 변화폭만큼 차오른다. 숫자만 있으면 셋의 크기를 비교할 수 없는데
 * 선이 붙으면 어느 지표를 가장 크게 움직였는지가 한눈에 잡힌다.
 */
export function CountUp({ from, to }: { from: string; to: string }) {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-countup]");
    if (nodes.length === 0) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const run = (node: HTMLElement) => {
      const start = parseNumber(node.dataset.countFrom ?? "");
      const end = parseNumber(node.dataset.countTo ?? "");
      const template = node.dataset.countTo ?? "";
      if (!start || !end) return;

      // 변화폭을 0~1로 — 어느 지표를 가장 크게 움직였는지 선 길이로 보인다
      const ratio =
        start.value === 0
          ? 1
          : Math.min(1, Math.abs(end.value - start.value) / start.value);
      node
        .closest<HTMLElement>("[data-metric]")
        ?.style.setProperty("--fill", `${ratio}`);

      const started = performance.now();
      const DURATION = 900;

      const tick = (now: number) => {
        const t = Math.min(1, (now - started) / DURATION);
        // 빠르게 출발해 천천히 멎는다
        const eased = 1 - (1 - t) ** 3;
        const current = start.value + (end.value - start.value) * eased;
        node.textContent = template.replace(
          /-?\d+(?:\.\d+)?/,
          current.toFixed(end.decimals),
        );
        if (t < 1) window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    };

    // 애니메이션 도중에 인쇄가 걸리면 굴러가던 중간값이 종이에 박힌다
    const settle = () => {
      for (const node of nodes) {
        node.textContent = node.dataset.countTo ?? node.textContent;
      }
    };
    window.addEventListener("beforeprint", settle);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target as HTMLElement;
          observer.unobserve(node);
          if (reduced) {
            node.textContent = node.dataset.countTo ?? "";
            node
              .closest<HTMLElement>("[data-metric]")
              ?.style.setProperty("--fill", "1");
            continue;
          }
          run(node);
        }
      },
      { threshold: 0.6 },
    );
    for (const node of nodes) observer.observe(node);

    return () => {
      window.removeEventListener("beforeprint", settle);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <span className="text-faint">{from}</span>
      <span className="mx-1.5 font-normal text-line">→</span>
      <span data-countup data-count-from={from} data-count-to={to}>
        {to}
      </span>
    </>
  );
}
