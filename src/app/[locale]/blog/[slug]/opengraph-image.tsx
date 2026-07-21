import { ImageResponse } from "next/og";

import {
  loadOgFonts,
  OG_SIZE,
  OgBlock,
  OgBrand,
  OgFrame,
  ogAccent,
  titleSize,
} from "@/app/_og/card";
import { findContentBySlug } from "@/features/blog";

import type { LocaleType } from "@/shared";

export const size = OG_SIZE;
export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ locale: LocaleType; slug: string }>;
}

const CATEGORY_LABEL: Record<string, Record<string, string>> = {
  ko: { dev: "개발", life: "일상", stock: "투자" },
  en: { dev: "Dev", life: "Life", stock: "Invest" },
  ja: { dev: "開発", life: "日常", stock: "投資" },
};

export default async function Image({ params }: ImageProps) {
  const { locale, slug } = await params;
  const content = findContentBySlug(slug, locale);
  const fonts = await loadOgFonts();

  const title = content?.frontmatter.title ?? "chlalsrl.com";
  const description =
    content && !content.frontmatter.draft
      ? content.frontmatter.description
      : "";
  const category = content?.category ?? "dev";
  const accent = ogAccent(category);
  const categoryLabel =
    CATEGORY_LABEL[locale]?.[category] ??
    CATEGORY_LABEL.en?.[category] ??
    "Blog";

  return new ImageResponse(
    <OgFrame>
      <OgBrand />
      <OgBlock
        accent={accent}
        eyebrow={categoryLabel}
        title={title}
        size={titleSize(title)}
        description={description}
      />
    </OgFrame>,
    { ...size, fonts },
  );
}
