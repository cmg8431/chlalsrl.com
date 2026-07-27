"use client";

import { CountUp } from "./resume-motion";

/**
 * 첫 화면의 수치는 그냥 자랑이 아니라 근거로 가는 입구다.
 * 누르면 그 수치를 만든 성과로 데려간다.
 * 훑다가 "이건 진짜야?" 싶은 순간에 바로 확인할 수 있어야 한다.
 */
export function HighlightCard({
  value,
  label,
  source,
  stage,
}: {
  value: string;
  label: string;
  source?: string;
  stage: number;
}) {
  const [from, to] = value.split("→").map((part) => part.trim());
  const jump = () => {
    if (!source) return;
    const target = document.querySelector<HTMLElement>(
      `[data-guide-label="${CSS.escape(source)}"]`,
    );
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const top = Math.max(
      0,
      rect.top + window.scrollY - (window.innerHeight - rect.height) / 2,
    );
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    // 스무스 스크롤이 무시되는 환경이 있어 움직였는지 확인하고 보정한다
    window.setTimeout(() => {
      if (Math.abs(window.scrollY - top) > 4 && window.scrollY === 0) {
        document.documentElement.scrollTop = top;
      }
    }, 260);

    // 도착한 자리를 한 번 반짝여 어디로 왔는지 알려준다
    target.setAttribute("data-landed", "");
    window.setTimeout(() => target.removeAttribute("data-landed"), 1200);
  };

  const body = (
    <>
      <span className="block text-[22px] font-semibold tabular-nums tracking-tight text-bright">
        {from && to ? <CountUp from={from} to={to} /> : value}
      </span>
      <span className="mt-1.5 block text-[11.5px] text-faint">{label}</span>
      {/* 변화폭만큼 차오르는 선 — 앞뒤 값이 있는 지표에만 붙는다 */}
      {from && to && <span className="resume-gauge" />}
    </>
  );

  if (!source) {
    return (
      <div
        data-metric
        data-stage
        style={{ "--stage": stage } as React.CSSProperties}
      >
        {body}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={jump}
      data-metric
      data-stage
      style={{ "--stage": stage } as React.CSSProperties}
      className="resume-metric group text-left"
    >
      {body}
    </button>
  );
}
