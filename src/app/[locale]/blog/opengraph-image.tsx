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
  const label = LABEL[locale] ?? LABEL_EN;
  const count = getAllContentsForLocale(locale).filter(
    (content) => !content.frontmatter.draft,
  ).length;

  return new ImageResponse(
    <OgFrame accent={OG_ACCENT_DEFAULT}>
      <OgBrand />
      <OgBlock
        accent={OG_ACCENT_DEFAULT}
        eyebrow="BLOG"
        title={label.title}
        size={92}
        description={label.count(count)}
      />
    </OgFrame>,
    { ...size, fonts },
  );
}
