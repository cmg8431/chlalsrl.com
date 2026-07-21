import type { MetadataRoute } from "next";
import {
  CONTENT_CATEGORIES,
  getContentBySlug,
  getContentSlugs,
} from "@/features/blog";
import { SUPPORTED_LOCALES } from "@/shared";

const SITE_URL = "https://chlalsrl.com";

// 같은 문서의 언어별 URL 묶음 — 사이트맵 hreflang으로 노출된다
function languageAlternates(
  path: string,
  locales: readonly string[] = SUPPORTED_LOCALES,
) {
  return {
    languages: Object.fromEntries(
      locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
    ),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // 태그는 언어마다 달라서 hreflang은 그 태그가 실제 존재하는 언어끼리만 묶는다
  const tagsByLocale = new Map<string, Set<string>>();
  for (const locale of SUPPORTED_LOCALES) {
    const tags = new Set<string>();
    for (const category of CONTENT_CATEGORIES) {
      for (const slug of getContentSlugs(category)) {
        const content = getContentBySlug(slug, locale, category);
        if (!content || content.frontmatter.draft) continue;
        content.frontmatter.tags?.forEach((tag) => {
          tags.add(tag);
        });
      }
    }
    tagsByLocale.set(locale, tags);
  }

  for (const locale of SUPPORTED_LOCALES) {
    entries.push(
      {
        url: `${SITE_URL}/${locale}`,
        changeFrequency: "monthly",
        priority: 1,
        alternates: languageAlternates(""),
      },
      {
        url: `${SITE_URL}/${locale}/blog`,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: languageAlternates("/blog"),
      },
      // 이력서는 작업 중이라 사이트맵에서 제외 — 오픈 시 복구
    );

    for (const category of CONTENT_CATEGORIES) {
      for (const slug of getContentSlugs(category)) {
        const content = getContentBySlug(slug, locale, category);
        if (!content || content.frontmatter.draft) continue;
        entries.push({
          url: `${SITE_URL}/${locale}/blog/${slug}`,
          lastModified: new Date(
            content.frontmatter.updated ?? content.frontmatter.date,
          ),
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: languageAlternates(`/blog/${slug}`),
        });
      }
    }

    for (const tag of tagsByLocale.get(locale) ?? []) {
      const tagPath = `/blog/tag/${encodeURIComponent(tag)}`;
      const localesWithTag = SUPPORTED_LOCALES.filter((loc) =>
        tagsByLocale.get(loc)?.has(tag),
      );
      entries.push({
        url: `${SITE_URL}/${locale}${tagPath}`,
        changeFrequency: "monthly",
        priority: 0.4,
        ...(localesWithTag.length > 1
          ? { alternates: languageAlternates(tagPath, localesWithTag) }
          : {}),
      });
    }
  }

  return entries;
}
