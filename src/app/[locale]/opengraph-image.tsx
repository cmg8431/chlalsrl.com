import { ImageResponse } from "next/og";

import { loadOgFonts, OG_SIZE, OgSiteCard } from "@/app/_og/card";

import type { LocaleType } from "@/shared";

export const size = OG_SIZE;
export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ locale: LocaleType }>;
}

const SENTENCE_EN = "Notes on building and living.";
const SENTENCE: Record<string, string> = {
  ko: "만들고 살아가며 남기는 기록.",
  en: SENTENCE_EN,
  ja: "作ること、暮らすことの記録。",
};

export default async function Image({ params }: ImageProps) {
  const { locale } = await params;
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgSiteCard sentence={SENTENCE[locale] ?? SENTENCE_EN} />,
    { ...size, fonts },
  );
}
