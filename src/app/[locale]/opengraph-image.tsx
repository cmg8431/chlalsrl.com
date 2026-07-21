import { ImageResponse } from "next/og";

import {
  loadOgFonts,
  OG_ACCENT_DEFAULT,
  OG_SIZE,
  OgBadge,
  OgFrame,
  OgMeta,
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

  return new ImageResponse(
    <OgFrame accent={accent}>
      <div style={{ display: "flex" }}>
        <OgBadge label="PRODUCT ENGINEER" />
      </div>
      <div style={{ display: "flex", marginTop: 40 }}>
        <OgTitle size={96} maxWidth={950}>
          {primary}
        </OgTitle>
      </div>
      <div style={{ display: "flex", flex: 1 }} />
      <OgMeta items={[TAGLINE[locale] ?? TAGLINE_EN, "chlalsrl.com"]} />
    </OgFrame>,
    { ...size, fonts },
  );
}
