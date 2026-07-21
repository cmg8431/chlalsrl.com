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
      <div style={{ display: "flex" }}>
        <OgBadge label="BLOG" />
      </div>
      <div style={{ display: "flex", marginTop: 40 }}>
        <OgTitle size={96}>{label.title}</OgTitle>
      </div>
      <div style={{ display: "flex", flex: 1 }} />
      <OgMeta items={[label.count(count), "chlalsrl.com/blog"]} />
    </OgFrame>,
    { ...size, fonts },
  );
}
