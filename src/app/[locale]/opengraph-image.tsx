import { ImageResponse } from "next/og";

import {
  loadOgFonts,
  OG_ACCENT_DEFAULT,
  OG_ACCENTS,
  OG_COLORS,
  OG_SIZE,
  OgFrame,
  OgTitle,
} from "@/app/_og/card";

import type { LocaleType } from "@/shared";

export const size = OG_SIZE;
export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ locale: LocaleType }>;
}

const TAGLINE_EN = "Notes on building and living";
const TAGLINE: Record<string, string> = {
  ko: "만들고 살아가며 남기는 기록",
  en: TAGLINE_EN,
  ja: "作ること、暮らすことの記録",
};

export default async function Image({ params }: ImageProps) {
  const { locale } = await params;
  const fonts = await loadOgFonts();
  const accent = OG_ACCENT_DEFAULT;
  const primary = locale === "ko" ? "최민기" : "Mingi Choe";
  const secondary = locale === "ko" ? "Mingi Choe" : "최민기";

  return new ImageResponse(
    <OgFrame accent={accent}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 30,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: accent.main,
          }}
        >
          PRODUCT ENGINEER
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
          <OgTitle size={112} maxWidth={1000}>
            {primary}
          </OgTitle>
          <span style={{ fontSize: 40, color: OG_COLORS.faint }}>
            {secondary}
          </span>
        </div>
        <span style={{ fontSize: 32, color: OG_COLORS.muted }}>
          {TAGLINE[locale] ?? TAGLINE_EN}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 22, color: OG_COLORS.faint }}>
          chlalsrl.com
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {Object.values(OG_ACCENTS).map((a, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                display: "flex",
                borderRadius: 14,
                backgroundColor: a.main,
              }}
            />
          ))}
        </div>
      </div>
    </OgFrame>,
    { ...size, fonts },
  );
}
