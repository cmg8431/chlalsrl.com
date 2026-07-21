import fs from "node:fs/promises";
import path from "node:path";

/**
 * OG 이미지 디자인 시스템 v5.
 * 상단 좌측 브랜드 로우, 하단 좌측에 아이브로우(카테고리) → 큰 제목 → 회색 설명.
 * 배지·메타 없이 플레인 텍스트만. 배경은 웜 블랙 + 아주 옅은 글로우.
 * satori 제약: 다자녀 요소는 display:flex 필수.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  bright: "#FAF6EF",
  muted: "#9C948A",
  faint: "#7A7264",
};

export interface OgAccent {
  main: string;
  glow: string;
}

export const OG_ACCENT_DEFAULT: OgAccent = {
  main: "#DE9A72",
  glow: "rgba(227, 139, 99, 0.14)",
};

export const OG_ACCENTS: Record<string, OgAccent> = {
  dev: OG_ACCENT_DEFAULT,
  life: { main: "#A4C2AC", glow: "rgba(155, 188, 164, 0.13)" },
  stock: { main: "#DDBA75", glow: "rgba(217, 178, 102, 0.12)" },
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
  if (title.length <= 14) return 92;
  if (title.length <= 24) return 76;
  if (title.length <= 38) return 62;
  return 52;
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
        background: "linear-gradient(135deg, #16130F 0%, #0D0C0A 60%)",
        fontFamily: "Pretendard",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 우하단으로 아주 옅게 스미는 웜 글로우 */}
      <div
        style={{
          position: "absolute",
          bottom: -320,
          right: -240,
          width: 900,
          height: 900,
          display: "flex",
          borderRadius: 900,
          background: `radial-gradient(circle, ${accent.glow} 0%, rgba(13, 12, 10, 0) 72%)`,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "64px 84px 68px",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** 상단 브랜드 로우 — 두 눈 마크 + 이름 */
export function OgBrand({ label = "최민기" }: { label?: string }) {
  const eye = 30;
  const pupil = eye * 0.477;
  const pupilOffset = eye * 0.403;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              width: eye,
              height: eye,
              display: "flex",
              position: "relative",
              borderRadius: eye,
              background: "rgba(250, 246, 239, 0.92)",
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
                backgroundColor: "#171310",
              }}
            />
          </div>
        ))}
      </div>
      <span
        style={{
          fontSize: 30,
          fontWeight: 600,
          color: OG_COLORS.bright,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/** 하단 블록 — 아이브로우 → 제목 → 설명 */
export function OgBlock({
  accent,
  eyebrow,
  title,
  size,
  description,
}: {
  accent: OgAccent;
  eyebrow: string;
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
        gap: 22,
        marginTop: "auto",
      }}
    >
      <span
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: accent.main,
        }}
      >
        {eyebrow}
      </span>
      <div
        style={{
          display: "flex",
          fontSize: size,
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: "-0.03em",
          wordBreak: "keep-all",
          maxWidth: 1000,
          color: "#F5F2EC",
        }}
      >
        {title}
      </div>
      {description && (
        <span
          style={{
            fontSize: 30,
            lineHeight: 1.5,
            color: OG_COLORS.muted,
            maxWidth: 940,
            wordBreak: "keep-all",
          }}
        >
          {description.length > 70
            ? `${description.slice(0, 70)}…`
            : description}
        </span>
      )}
    </div>
  );
}
