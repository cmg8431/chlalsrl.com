import { ImageResponse } from "next/og";

import {
  loadOgFonts,
  OG_ACCENT_DEFAULT,
  OG_SIZE,
  OgBlock,
  OgBrand,
  OgFrame,
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

  const count = getAllContentsForLocale(locale).filter(
    (content) =>
      !content.frontmatter.draft && content.frontmatter.tags?.includes(tag),
  ).length;
  const countLabel = (COUNT_LABEL[locale] ?? COUNT_LABEL.en!)(count);

  return new ImageResponse(
    <OgFrame accent={OG_ACCENT_DEFAULT}>
      <OgBrand />
      <OgBlock
        accent={OG_ACCENT_DEFAULT}
        eyebrow="TAG"
        title={`#${tag}`}
        size={88}
        description={countLabel}
      />
    </OgFrame>,
    { ...size, fonts },
  );
}
