import fs from "node:fs/promises";
import path from "node:path";

/**
 * OG 이미지 디자인 시스템 v3 — "다크 컴팩트".
 * 웜 블랙 캔버스에 좌상단 배지 → 굵은 제목 → 좌하단 메타 한 줄,
 * 우하단 두 눈 마스코트 + 그 뒤 글로우 하나. 그 외 장식 없음.
 * satori 제약: 다자녀 요소는 display:flex 필수.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  bright: "#FAF6EF",
  muted: "#B7AE9F",
  faint: "#7A7264",
};

export interface OgAccent {
  main: string;
  glow: string;
}

export const OG_ACCENT_DEFAULT: OgAccent = {
  main: "#E38B63",
  glow: "rgba(227, 139, 99, 0.30)",
};

export const OG_ACCENTS: Record<string, OgAccent> = {
  dev: OG_ACCENT_DEFAULT,
  life: { main: "#9BBCA4", glow: "rgba(155, 188, 164, 0.28)" },
  stock: { main: "#D9B266", glow: "rgba(217, 178, 102, 0.26)" },
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

/** 제목 길이에 따라 폰트 크기를 줄여 2줄 안에 안착시킨다 */
export function titleSize(title: string): number {
  if (title.length <= 14) return 84;
  if (title.length <= 24) return 72;
  if (title.length <= 38) return 60;
  return 50;
}

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
        background: "linear-gradient(180deg, #131110 0%, #0E0C0A 100%)",
        fontFamily: "Pretendard",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 마스코트 뒤 글로우 — 유일한 장식 */}
      <div
        style={{
          position: "absolute",
          bottom: -260,
          right: -180,
          width: 700,
          height: 700,
          display: "flex",
          borderRadius: 700,
          background: `radial-gradient(circle, ${accent.glow} 0%, rgba(14, 12, 10, 0) 62%)`,
        }}
      />
      <OgEyes />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "72px 84px",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** 우하단 두 눈 마스코트 — 서비스 아이콘과 같은 비율 */
export function OgEyes() {
  const eye = 150;
  const pupil = eye * 0.477;
  const pupilOffset = eye * 0.403;
  return (
    <div
      style={{
        position: "absolute",
        right: 84,
        bottom: 76,
        width: eye * 2 + 26,
        height: eye,
        display: "flex",
        gap: 26,
      }}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            width: eye,
            height: eye,
            display: "flex",
            position: "relative",
            borderRadius: eye,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.82) 55%, rgba(223,223,223,0.76) 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: pupilOffset,
              top: pupilOffset,
              width: pupil,
              height: pupil,
              borderRadius: pupil,
              background: "linear-gradient(45deg, #000000 0%, #404040 100%)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/** 좌상단 배지 — 액센트 틴트 필 */
export function OgBadge({
  label,
  accent = OG_ACCENT_DEFAULT,
}: {
  label: string;
  accent?: OgAccent;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        backgroundColor: `${accent.main}24`,
        color: accent.main,
        borderRadius: 999,
        padding: "10px 24px",
        fontSize: 25,
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

/** 제목 — 밝은 단색, 2줄 이내 */
export function OgTitle({
  children,
  size,
  maxWidth = 950,
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
        lineHeight: 1.26,
        letterSpacing: "-0.03em",
        wordBreak: "keep-all",
        maxWidth,
        color: OG_COLORS.bright,
      }}
    >
      {children}
    </div>
  );
}

/** 좌하단 메타 한 줄 — "2026.7.22 | 5분 읽기" 꼴 */
export function OgMeta({ items }: { items: string[] }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontSize: 24,
        fontWeight: 600,
        color: OG_COLORS.muted,
      }}
    >
      {items.map((item, i) => (
        <div
          key={item}
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          {i > 0 && (
            <div
              style={{
                width: 2,
                height: 22,
                display: "flex",
                backgroundColor: OG_COLORS.faint,
              }}
            />
          )}
          {item}
        </div>
      ))}
    </div>
  );
}
