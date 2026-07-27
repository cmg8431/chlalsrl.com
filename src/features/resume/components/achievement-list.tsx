import type { ResumeAchievement, ResumeLink } from "../libs";

/** 항목에 걸린 href도 같은 근거 목록에 합류시킨다 — 근거는 한 곳에서만 센다 */
function evidenceOf(item: ResumeAchievement): ResumeLink[] {
  const links = [...(item.evidence ?? [])];
  if (item.href && !links.some((link) => link.href === item.href)) {
    links.push({
      label: item.href.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      href: item.href,
    });
  }
  return links;
}

/**
 * 성과를 상황 · 행동 · 결과 세 칸으로 나눠 세운다.
 *
 * 줄글이면 문제와 대응과 성과가 한 문단에 섞여 읽는 사람이 직접 분해해야 한다.
 * 라벨을 바깥 여백에 흘려 세로줄로 세우면, 훑는 사람은 결과만 주워 가고
 * 파고드는 사람은 상황부터 따라 읽는다. 선은 한 줄도 더 쓰지 않는다.
 */
function Block({
  label,
  items,
  strong,
  leadStrong,
}: {
  label: string;
  items: string[];
  /** 결과처럼 줄 전체를 진하게 둘 때 */
  strong?: boolean;
  /** 행동은 첫 줄이 가장 중요한 결정이다 — 그 줄만 진하게 */
  leadStrong?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <div className="resume-block">
      <span className="resume-block-label">{label}</span>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li
            key={item}
            className={`resume-bullet break-keep text-[13px] leading-[1.7] ${
              strong || (leadStrong && index === 0)
                ? "font-medium text-foreground"
                : "text-muted"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AchievementList({
  achievements,
  labels,
}: {
  achievements: ResumeAchievement[];
  labels: {
    situation: string;
    action: string;
    result: string;
    evidence: string;
  };
}) {
  return (
    <div className="resume-achievements mt-7 space-y-9">
      {achievements.map((item, index) => (
        <article
          key={item.title}
          className="resume-item"
          data-guide-label={item.title}
        >
          <span className="resume-index" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="flex items-baseline justify-between gap-5">
            <h4 className="text-[15px] font-semibold leading-snug tracking-tight text-bright">
              {item.title}
            </h4>
            <time className="shrink-0 font-mono text-[10.5px] tabular-nums text-faint">
              {item.period}
            </time>
          </div>

          <p className="mt-1.5 max-w-[41rem] break-keep text-[13.5px] leading-[1.7] text-muted">
            {item.summary}
          </p>

          <div className="mt-4 max-w-[43rem] space-y-3.5">
            <Block label={labels.situation} items={item.situation} />
            <Block label={labels.action} items={item.action} leadStrong />
            <Block label={labels.result} items={item.result} strong />
          </div>

          {/* 근거는 접어둔다. 링크를 늘어놓으면 성과보다 URL이 먼저 읽힌다 —
              의심이 든 사람만 펼치면 되고, 그때는 전부 여기 모여 있어야 한다 */}
          {(() => {
            const links = evidenceOf(item);
            if (links.length === 0) return null;
            return (
              <details className="resume-evidence">
                <summary className="resume-evidence-summary">
                  {labels.evidence}
                  <span className="tabular-nums">{links.length}</span>
                </summary>
                <ul className="resume-evidence-list">
                  {links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="link-quiet"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })()}
        </article>
      ))}
    </div>
  );
}
