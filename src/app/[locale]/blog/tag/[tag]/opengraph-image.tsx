import { ImageResponse } from "next/og";

import {
  loadOgFonts,
  OG_ACCENT_DEFAULT,
  OG_COLORS,
  OG_SIZE,
  OgFrame,
  OgTitle,
  OgTopRow,
} from "@/app/_og/card";
import { getAllContentsForLocale } from "@/features/blog";

import type { LocaleType } from "@/shared";

export const size = OG_SIZE;
export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ locale: LocaleType; tag: string }>;
}

const COUNT_LABEL: Record<string, (n: number) => string> = {
  ko: (n) => `${n}개의 글`,
  en: (n) => `${n} posts`,
  ja: (n) => `${n}件の記事`,
};

export default async function Image({ params }: ImageProps) {
  const { locale, tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const fonts = await loadOgFonts();
  const accent = OG_ACCENT_DEFAULT;

  const count = getAllContentsForLocale(locale).filter(
    (content) =>
      !content.frontmatter.draft && content.frontmatter.tags?.includes(tag)
  ).length;
  const countLabel = (COUNT_LABEL[locale] ?? COUNT_LABEL.en!)(count);

  return new ImageResponse(
    (
      <OgFrame accent={accent}>
        <OgTopRow />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 22,
          }}
        >
          <OgTitle size={88}>{`#${tag}`}</OgTitle>
          <span style={{ fontSize: 32, color: OG_COLORS.muted }}>
            {countLabel}
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
            chlalsrl.com/blog
          </span>
          <div
            style={{
              width: 56,
              height: 5,
              display: "flex",
              borderRadius: 5,
              background: `linear-gradient(90deg, ${accent.main} 0%, ${accent.main}55 100%)`,
            }}
          />
        </div>
      </OgFrame>
    ),
    { ...size, fonts }
  );
}
