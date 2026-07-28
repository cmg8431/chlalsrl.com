"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Resume } from "../libs";

/** 한 세션에 한 번만 스스로 올라온다. 두 번째부터는 눌러서 부른다 */
const SEEN_KEY = "resume-summary-seen";

/** 처음 올라왔을 때 잠깐 머무는 시간 */
const HOLD_FIRST = 7000;
/** 손을 뗀 뒤 닫히기까지 */
const HOLD_AFTER_HOVER = 5000;
/** 내려가는 동작이 끝날 때까지 (CSS와 맞춘다) */
const LEAVE_MS = 380;
/** 이만큼 스크롤하면 읽기 시작한 것으로 보고 비켜준다 */
const SCROLL_AWAY = 140;

/**
 * 30초 요약.
 *
 * 문서 안에 카드로 박아두면 읽는 사람은 그냥 지나친다. 아래에서 한 번 올라와
 * 눈에 걸리고, 손을 얹으면 머물고, 떼면 5초 뒤에 스스로 사라진다 —
 * 이력서를 가리지 않으면서 훑는 6초를 가져가는 방법이다.
 *
 * 글자는 생성되듯 어절 단위로 올라온다. 실제로 모델이 쓰는 건 아니고 미리 쓴
 * 문장이지만, 결론을 먼저 건네는 물건이라 그 결에 맞춰 등장시킨다.
 *
 * 각 항목의 근거는 본문의 성과로 데려간다. 요약이 요약으로 끝나면 자랑이고,
 * 눌러서 원문에 닿아야 주장이 된다.
 */
export function ResumeSummary({
  data,
  openLabel,
  closeLabel,
}: {
  data: Resume["summary"];
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  /**
   * 스스로 올라올지 말지 정해지기 전에는 아무것도 그리지 않는다.
   * 먼저 알약부터 그리면 처음 온 사람이 "요약 다시 보기"를 읽게 된다 —
   * 아직 한 번도 안 봤는데.
   */
  const [decided, setDecided] = useState(false);
  /** 사라지는 중 — 뚝 끊기면 없었던 일처럼 보인다 */
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(0);
  const exit = useRef(0);

  const disarm = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = 0;
    }
  }, []);

  const close = useCallback(() => {
    disarm();
    setLeaving(true);
    exit.current = window.setTimeout(() => {
      setOpen(false);
      setLeaving(false);
    }, LEAVE_MS);
  }, [disarm]);

  const arm = useCallback(
    (ms: number) => {
      disarm();
      timer.current = window.setTimeout(close, ms);
    },
    [disarm, close],
  );

  useEffect(() => () => window.clearTimeout(exit.current), []);

  // 문서가 자리를 잡은 다음에 올라온다 — 같이 들어오면 둘 다 안 읽힌다
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") {
        setDecided(true);
        return;
      }
    } catch {
      // 저장소가 막힌 브라우저 — 그냥 띄운다
    }
    const entrance = window.setTimeout(() => {
      setOpen(true);
      setDecided(true);
    }, 1200);
    return () => window.clearTimeout(entrance);
  }, []);

  useEffect(() => {
    if (!open) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // 이번 방문에만 적용되는 건 문제가 아니다
    }
    arm(HOLD_FIRST);
    return disarm;
  }, [open, arm, disarm]);

  // 읽기 시작하면 비켜준다 — 스크롤을 내리는 사람에게 요약은 이미 지난 이야기다.
  // 올라온 직후의 관성 스크롤까지 잡으면 뜨자마자 사라지므로 잠깐 뒤에 켠다
  useEffect(() => {
    if (!open || leaving) return;
    const from = window.scrollY;
    let live = false;
    const settle = window.setTimeout(() => {
      live = true;
    }, 700);
    const onScroll = () => {
      if (live && Math.abs(window.scrollY - from) > SCROLL_AWAY) close();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, leaving, close]);

  if (!open) {
    if (!decided) return null;
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="resume-brief-pill no-print"
      >
        <Sparkle />
        {openLabel}
      </button>
    );
  }

  let word = 0;

  return (
    // 하단 띠만 덮는 그라데이션. 클릭은 통과시킨다 — 문서를 가리되 막지는 않는다
    <section
      className={`resume-brief no-print${leaving ? " is-leaving" : ""}`}
      aria-label={data.label}
    >
      <div
        className="resume-brief-inner"
        onPointerEnter={disarm}
        onPointerLeave={() => arm(HOLD_AFTER_HOVER)}
        // 근거를 키보드로 훑는 동안 사라지면 안 된다
        onFocusCapture={disarm}
        onBlurCapture={() => arm(HOLD_AFTER_HOVER)}
      >
        <div className="resume-brief-head">
          <span className="resume-brief-badge">
            <Sparkle />
            {data.label}
          </span>
          <button
            type="button"
            onClick={close}
            aria-label={closeLabel}
            className="resume-brief-close"
          >
            <svg viewBox="0 0 14 14" width="10" height="10" aria-hidden>
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>

        {/* 어절 하나씩 — 한 덩어리로 나타나면 써 내려가는 느낌이 나지 않는다 */}
        <h2 className="resume-brief-headline">
          {data.headline.split(" ").map((chunk, index) => (
            <span
              key={`${chunk}-${index}`}
              className="resume-brief-word"
              style={{ "--w": word++ } as React.CSSProperties}
            >
              {chunk}
            </span>
          ))}
        </h2>

        {/* 본문은 다시 쓰는 중 — 지금은 여닫는 동작만 보이게 둔다 */}
        <p className="resume-brief-wip">작업 중</p>
      </div>
    </section>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 14 14" width="11" height="11" aria-hidden>
      <path
        d="M7 0.8l1.5 3.7L12.2 7l-3.7 1.5L7 12.2 5.5 8.5 1.8 7l3.7-1.5z"
        fill="currentColor"
      />
    </svg>
  );
}
