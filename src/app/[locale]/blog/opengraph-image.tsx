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
  params: Promise<{ locale: LocaleType }>;
}

interface ListLabel {
  title: string;
  count: (n: number) => string;
}

const LABEL_EN: ListLabel = { title: "Writing", count: (n) => `${n} posts` };
const LABEL: Record<string, ListLabel> = {
  ko: { title: "글", count: (n) => `${n}개의 글` },
  en: LABEL_EN,
  ja: { title: "記事", count: (n) => `${n}件の記事` },
};

export default async function Image({ params }: ImageProps) {
  const { locale } = await params;
  const fonts = await loadOgFonts();
  const accent = OG_ACCENT_DEFAULT;
  const label = LABEL[locale] ?? LABEL_EN;
  const count = getAllContentsForLocale(locale).filter(
    (content) => !content.frontmatter.draft,
  ).length;

  return new ImageResponse(
    <OgFrame accent={accent}>
      <OgTopRow />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        <OgTitle size={104}>{label.title}</OgTitle>
        <span style={{ fontSize: 32, color: OG_COLORS.muted }}>
          {label.count(count)}
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
    </OgFrame>,
    { ...size, fonts },
  );
}
