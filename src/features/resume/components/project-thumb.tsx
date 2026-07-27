/**
 * 프로젝트 썸네일. 스톡 사진을 끼우면 문서 톤이 먼저 깨지므로 이름에서 뽑은
 * 해시로 모노크롬 도형을 그린다. 같은 이름이면 늘 같은 그림이라 서버·클라이언트
 * 렌더가 어긋나지 않는다.
 *
 * 형태를 셋으로 나눈 이유: 배치만 흔들면 세 카드가 전부 비슷해 보인다.
 * 계열이 갈려야 목록에서 서로 구분된다.
 */
function hash(value: string): number {
  let acc = 0;
  for (let i = 0; i < value.length; i += 1) {
    acc = (acc * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(acc);
}

/** 동심원 — 한 점에서 퍼져 나가는 것 */
function Rings({ seed }: { seed: number }) {
  const cx = 52 + (seed % 60);
  const cy = 30 + ((seed >> 4) % 60);
  return (
    <g fill="none" stroke="currentColor">
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={7 + i * 11}
          opacity={0.5 - i * 0.08}
        />
      ))}
      <circle cx={cx} cy={cy} r="2.4" fill="currentColor" stroke="none" />
    </g>
  );
}

/** 사선 결 — 흐름과 이동 */
function Grain({ seed }: { seed: number }) {
  const gap = 8 + (seed % 4);
  const lines = Array.from({ length: 30 }, (_, i) => i * gap - 70);
  return (
    <g stroke="currentColor">
      {lines.map((x, i) => (
        <line
          key={x}
          x1={x}
          y1="-12"
          x2={x + 80}
          y2="132"
          opacity={i % 4 === 0 ? 0.45 : 0.16}
        />
      ))}
    </g>
  );
}

/** 눈금 위의 막대 — 쌓아 올린 것 */
function Bars({ seed }: { seed: number }) {
  return (
    <g fill="currentColor">
      {Array.from({ length: 9 }, (_, i) => {
        const height = 20 + ((seed >> (i % 7)) % 66);
        return (
          <rect
            key={i}
            x={10 + i * 16}
            y={110 - height}
            width="9"
            height={height}
            rx="2"
            opacity={0.2 + (i % 3) * 0.14}
          />
        );
      })}
    </g>
  );
}

const FAMILIES = [Rings, Grain, Bars] as const;

export function ProjectThumb({
  name,
  index = 0,
}: {
  name: string;
  /** 계열은 순번으로 고른다 — 해시에 맡기면 충돌해 같은 그림이 나란히 선다 */
  index?: number;
}) {
  const seed = hash(name);
  const Shape = FAMILIES[index % FAMILIES.length] ?? Rings;

  return (
    <svg
      viewBox="0 0 160 120"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="resume-thumb"
    >
      <title>{name}</title>
      <Shape seed={seed} />
    </svg>
  );
}
