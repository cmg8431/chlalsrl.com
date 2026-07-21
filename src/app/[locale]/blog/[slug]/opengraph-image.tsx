import { ImageResponse } from "next/og";

import {
  loadOgFonts,
  OG_SIZE,
  OgBadge,
  OgFrame,
  OgMeta,
  OgTitle,
  ogAccent,
  titleSize,
} from "@/app/_og/card";
import { findContentBySlug, readingMinutes } from "@/features/blog";

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

function formatDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(
    locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
}

export default async function Image({ params }: ImageProps) {
  const { locale, slug } = await params;
  const content = findContentBySlug(slug, locale);
  const fonts = await loadOgFonts();

  const title = content?.frontmatter.title ?? "chlalsrl.com";
  const date = content?.frontmatter.date;
  const minutes = content ? readingMinutes(content.content) : null;
  const category = content?.category ?? "dev";
  const accent = ogAccent(category);
  const categoryLabel =
    CATEGORY_LABEL[locale]?.[category] ??
    CATEGORY_LABEL.en?.[category] ??
    "Blog";

  const meta: string[] = [];
  if (date) meta.push(formatDate(date, locale));
  if (minutes) {
    meta.push(
      locale === "ko"
        ? `${minutes}분 읽기`
        : locale === "ja"
          ? `${minutes}分で読める`
          : `${minutes} min read`,
    );
  }

  return new ImageResponse(
    <OgFrame accent={accent}>
      <div style={{ display: "flex" }}>
        <OgBadge accent={accent} label={categoryLabel} />
      </div>
      <div style={{ display: "flex", marginTop: 40 }}>
        <OgTitle size={titleSize(title)} maxWidth={950}>
          {title}
        </OgTitle>
      </div>
      <div style={{ display: "flex", flex: 1 }} />
      <OgMeta items={meta} />
    </OgFrame>,
    { ...size, fonts },
  );
}
