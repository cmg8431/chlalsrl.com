import { ImageResponse } from "next/og";

import {
  loadOgFonts,
  ogAccent,
  OG_COLORS,
  OG_SIZE,
  OgFrame,
  OgPill,
  OgTitle,
  OgTopRow,
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
    { year: "numeric", month: "long", day: "numeric" }
  );
}

export default async function Image({ params }: ImageProps) {
  const { locale, slug } = await params;
  const content = findContentBySlug(slug, locale);
  const fonts = await loadOgFonts();

  const title = content?.frontmatter.title ?? "chlalsrl.com";
  const description =
    content && !content.frontmatter.draft ? content.frontmatter.description : "";
  const date = content?.frontmatter.date;
  const minutes = content ? readingMinutes(content.content) : null;
  const category = content?.category ?? "dev";
  const accent = ogAccent(category);
  const categoryLabel =
    CATEGORY_LABEL[locale]?.[category] ??
    CATEGORY_LABEL.en?.[category] ??
    "Blog";

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
            gap: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <OgPill accent={accent} label={categoryLabel} />
            {minutes && (
              <span style={{ fontSize: 23, color: OG_COLORS.faint }}>
                {locale === "ko"
                  ? `${minutes}분 읽기`
                  : locale === "ja"
                    ? `${minutes}分で読める`
                    : `${minutes} min read`}
              </span>
            )}
          </div>
          <OgTitle size={titleSize(title)}>{title}</OgTitle>
          {description && (
            <span
              style={{
                fontSize: 28,
                lineHeight: 1.55,
                color: OG_COLORS.muted,
                maxWidth: 880,
                wordBreak: "keep-all",
              }}
            >
              {description.length > 64
                ? `${description.slice(0, 64)}…`
                : description}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 22, color: OG_COLORS.faint }}>
            {date ? formatDate(date, locale) : ""}
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
