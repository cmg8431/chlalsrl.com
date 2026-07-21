import fs from "node:fs/promises";
import path from "node:path";

/**
 * OG 이미지 디자인 시스템 v2 — "웜 다크 오로라".
 * 웜 블랙 캔버스 + 카테고리 액센트 글로우 + 1px 인너 프레임 + 그라디언트 타이포.
 * satori 제약: 다자녀 요소는 display:flex 필수, 배경은 그라디언트만 사용(외부 리소스 금지),
 * 멀티 배경 미지원이라 텍스처는 레이어(div)로 쌓는다.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  bright: "#FAF6EF",
  muted: "#B7AE9F",
  faint: "#7A7264",
  frame: "rgba(250, 246, 239, 0.12)",
};

/** 밝은 상아색 → 웜 그레이로 떨어지는 제목용 그라디언트 */
export const OG_TITLE_GRADIENT =
  "linear-gradient(180deg, #FBF8F2 10%, #AEA491 115%)";

export interface OgAccent {
  main: string;
  glow: string;
  glowSub: string;
}

export const OG_ACCENT_DEFAULT: OgAccent = {
  main: "#E38B63",
  glow: "rgba(227, 139, 99, 0.38)",
  glowSub: "rgba(224, 163, 116, 0.20)",
};

export const OG_ACCENTS: Record<string, OgAccent> = {
  dev: OG_ACCENT_DEFAULT,
  life: {
    main: "#9BBCA4",
    glow: "rgba(155, 188, 164, 0.34)",
    glowSub: "rgba(190, 211, 187, 0.18)",
  },
  stock: {
    main: "#D9B266",
    glow: "rgba(217, 178, 102, 0.32)",
    glowSub: "rgba(226, 197, 141, 0.18)",
  },
};

export function ogAccent(key: string): OgAccent {
  return OG_ACCENTS[key] ?? OG_ACCENT_DEFAULT;
}

const FONT_DIR = "node_modules/pretendard/dist/public/static";

export async function loadOgFonts() {
  const load = (file: string) =>
    fs.readFile(path.join(process.cwd(), FONT_DIR, file));
  const [regular, semibold, extrabold] = await Promise.all([
    load("Pretendard-Regular.otf"),
    load("Pretendard-SemiBold.otf"),
    load("Pretendard-ExtraBold.otf"),
  ]);
  return [
    { name: "Pretendard", data: regular, weight: 400 as const },
    { name: "Pretendard", data: semibold, weight: 600 as const },
    { name: "Pretendard", data: extrabold, weight: 800 as const },
  ];
}

/** 제목 길이에 따라 폰트 크기를 줄여 2~3줄 안에 안착시킨다 */
export function titleSize(title: string): number {
  if (title.length <= 14) return 88;
  if (title.length <= 24) return 74;
  if (title.length <= 38) return 62;
  return 52;
}

const GRID = "rgba(250, 246, 239, 0.05)";

export function OgFrame({
  accent,
  children,
}: {
  accent: OgAccent;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(160deg, #1A1613 0%, #0E0C0A 100%)",
        fontFamily: "Pretendard",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 그리드 텍스처 — 세로/가로 헤어라인 레이어 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage: `repeating-linear-gradient(90deg, ${GRID} 0px, ${GRID} 1px, transparent 1px, transparent 84px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage: `repeating-linear-gradient(0deg, ${GRID} 0px, ${GRID} 1px, transparent 1px, transparent 84px)`,
        }}
      />
      {/* 오로라 글로우 — 좌하단 액센트 */}
      <div
        style={{
          position: "absolute",
          bottom: -300,
          left: -200,
          width: 880,
          height: 880,
          display: "flex",
          borderRadius: 880,
          background: `radial-gradient(circle, ${accent.glow} 0%, rgba(14, 12, 10, 0) 60%)`,
        }}
      />
      {/* 오로라 글로우 — 우상단 보조 */}
      <div
        style={{
          position: "absolute",
          top: -320,
          right: -220,
          width: 820,
          height: 820,
          display: "flex",
          borderRadius: 820,
          background: `radial-gradient(circle, ${accent.glowSub} 0%, rgba(14, 12, 10, 0) 58%)`,
        }}
      />
      {/* 하단 엣지 라이트 — 액센트가 프레임 아래에서 배어 나오는 느낌 */}
      <div
        style={{
          position: "absolute",
          bottom: -140,
          left: 200,
          right: 200,
          height: 240,
          display: "flex",
          borderRadius: 240,
          background: `radial-gradient(circle, ${accent.glowSub} 0%, rgba(14, 12, 10, 0) 70%)`,
        }}
      />
      {/* 1px 인너 프레임 */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          right: 30,
          bottom: 30,
          display: "flex",
          border: `1px solid ${OG_COLORS.frame}`,
          borderRadius: 26,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "84px 96px",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** 상단 아이덴티티 로우 — 이름(좌) + 도메인(우) */
export function OgTopRow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        <span
          style={{ fontSize: 27, fontWeight: 600, color: OG_COLORS.bright }}
        >
          최민기
        </span>
        <span style={{ fontSize: 21, color: OG_COLORS.faint }}>Mingi Choe</span>
      </div>
      <span style={{ fontSize: 22, color: OG_COLORS.faint }}>chlalsrl.com</span>
    </div>
  );
}

/** 아웃라인 카테고리 필 */
export function OgPill({ accent, label }: { accent: OgAccent; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        border: `1.5px solid ${accent.main}66`,
        color: accent.main,
        borderRadius: 999,
        padding: "8px 22px",
        fontSize: 24,
        fontWeight: 600,
      }}
    >
      <div
        style={{
          width: 9,
          height: 9,
          display: "flex",
          borderRadius: 9,
          backgroundColor: accent.main,
        }}
      />
      {label}
    </div>
  );
}

/** 그라디언트 타이포 제목 */
export function OgTitle({
  children,
  size,
  maxWidth = 940,
}: {
  children: string;
  size: number;
  maxWidth?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.18,
        letterSpacing: "-0.035em",
        wordBreak: "keep-all",
        maxWidth,
        backgroundImage: OG_TITLE_GRADIENT,
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </div>
  );
}

/** 액센트 시그니처 바 */
export function OgAccentBar({ accent }: { accent: OgAccent }) {
  return (
    <div
      style={{
        width: 56,
        height: 5,
        display: "flex",
        borderRadius: 5,
        background: `linear-gradient(90deg, ${accent.main} 0%, ${accent.main}55 100%)`,
      }}
    />
  );
}
