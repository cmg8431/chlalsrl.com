import fs from "node:fs/promises";
import path from "node:path";

/**
 * OG 이미지 디자인 시스템 v6.
 * 상세: 상단 브랜드 로우, 하단에 아이브로우 → 큰 제목 → 회색 설명 2줄.
 * 공용(홈·목록·태그): 브랜드 로우 + 문장 하나. 이름 대신 문장이 말한다.
 * satori 제약: 다자녀 요소는 display:flex 필수.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export interface OgAccent {
  main: string;
}

export const OG_ACCENT_DEFAULT: OgAccent = { main: "#D9A075" };

export const OG_ACCENTS: Record<string, OgAccent> = {
  dev: OG_ACCENT_DEFAULT,
  life: { main: "#A8C2AF" },
  stock: { main: "#D9BA7E" },
};

export function ogAccent(key: string): OgAccent {
  return OG_ACCENTS[key] ?? OG_ACCENT_DEFAULT;
}

const FONT_DIR = "node_modules/pretendard/dist/public/static";

export async function loadOgFonts() {
  const load = (file: string) =>
    fs.readFile(path.join(process.cwd(), FONT_DIR, file));
  const [regular, semibold, extrabold, serif] = await Promise.all([
    load("Pretendard-Regular.otf"),
    load("Pretendard-SemiBold.otf"),
    load("Pretendard-ExtraBold.otf"),
    fs.readFile(
      path.join(process.cwd(), "src/app/_og/fonts/InstrumentSerif-Regular.ttf"),
    ),
  ]);
  return [
    { name: "Pretendard", data: regular, weight: 400 as const },
    { name: "Pretendard", data: semibold, weight: 600 as const },
    { name: "Pretendard", data: extrabold, weight: 800 as const },
    { name: "InstrumentSerif", data: serif, weight: 400 as const },
  ];
}

/** 제목 길이에 따라 폰트 크기를 줄여 2줄 안에 안착시킨다 */
export function titleSize(title: string): number {
  if (title.length <= 14) return 96;
  if (title.length <= 24) return 80;
  if (title.length <= 38) return 64;
  return 54;
}

export function OgFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(120deg, #1A1712 0%, #12100D 45%, #0C0B0A 100%)",
        fontFamily: "Pretendard",
        position: "relative",
        overflow: "hidden",
        padding: "88px 110px 84px",
      }}
    >
      {children}
    </div>
  );
}

/** 상단 브랜드 로우 — 액센트 성표 마크 + 세리프 워드마크 */
export function OgBrand() {
  const rays = Array.from({ length: 8 }, (_, i) => (i * 180) / 4);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <svg
        width="46"
        height="46"
        viewBox="0 0 46 46"
        fill="none"
        role="img"
        aria-label="mark"
      >
        {rays.map((deg) => (
          <line
            key={deg}
            x1="23"
            y1="8"
            x2="23"
            y2="17.5"
            stroke={OG_ACCENT_DEFAULT.main}
            strokeWidth="5.5"
            strokeLinecap="round"
            transform={`rotate(${deg} 23 23)`}
          />
        ))}
      </svg>
      <span
        style={{
          fontSize: 44,
          fontFamily: "InstrumentSerif",
          color: "#F5F1E9",
          letterSpacing: "0.01em",
        }}
      >
        chlalsrl.com
      </span>
    </div>
  );
}

/** 하단 블록 — 아이브로우(선택) → 제목 → 설명(선택) */
export function OgBlock({
  accent = OG_ACCENT_DEFAULT,
  eyebrow,
  title,
  size,
  description,
}: {
  accent?: OgAccent;
  eyebrow?: string;
  title: string;
  size: number;
  description?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: "auto",
      }}
    >
      {eyebrow && (
        <span
          style={{
            fontSize: 31,
            fontWeight: 400,
            color: accent.main,
            marginBottom: 18,
          }}
        >
          {eyebrow}
        </span>
      )}
      <div
        style={{
          display: "flex",
          fontSize: size,
          fontWeight: 800,
          lineHeight: 1.14,
          letterSpacing: "-0.025em",
          wordBreak: "keep-all",
          maxWidth: 980,
          color: "#F7F4EE",
        }}
      >
        {title}
      </div>
      {description && (
        <span
          style={{
            fontSize: 32,
            fontWeight: 400,
            lineHeight: 1.62,
            color: "#A39C90",
            maxWidth: 900,
            wordBreak: "keep-all",
            marginTop: 26,
          }}
        >
          {description.length > 68
            ? `${description.slice(0, 68)}…`
            : description}
        </span>
      )}
    </div>
  );
}

/** 공용 카드 — 홈·목록·태그처럼 짧은 텍스트 페이지가 함께 쓴다 */
export function OgSiteCard({ sentence }: { sentence: string }) {
  return (
    <OgFrame>
      <OgBrand />
      <OgBlock title={sentence} size={64} />
    </OgFrame>
  );
}
