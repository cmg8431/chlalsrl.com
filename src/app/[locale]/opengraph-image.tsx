import { ImageResponse } from "next/og";

import {
  loadOgFonts,
  OG_ACCENT_DEFAULT,
  OG_SIZE,
  OgBlock,
  OgBrand,
  OgFrame,
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
  const primary = locale === "ko" ? "최민기" : "Mingi Choe";

  return new ImageResponse(
    <OgFrame accent={OG_ACCENT_DEFAULT}>
      <OgBrand label="chlalsrl.com" />
      <OgBlock
        accent={OG_ACCENT_DEFAULT}
        eyebrow="PRODUCT ENGINEER"
        title={primary}
        size={92}
        description={TAGLINE[locale] ?? TAGLINE_EN}
      />
    </OgFrame>,
    { ...size, fonts },
  );
}
