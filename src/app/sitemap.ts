import type { MetadataRoute } from "next";
import {
  CONTENT_CATEGORIES,
  getContentBySlug,
  getContentSlugs,
} from "@/features/blog";
import { SUPPORTED_LOCALES } from "@/shared";

const SITE_URL = "https://chlalsrl.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    entries.push(
      { url: `${SITE_URL}/${locale}`, changeFrequency: "monthly", priority: 1 },
      {
        url: `${SITE_URL}/${locale}/blog`,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      // 이력서는 작업 중이라 사이트맵에서 제외 — 오픈 시 복구
    );

    const tags = new Set<string>();
    for (const category of CONTENT_CATEGORIES) {
      for (const slug of getContentSlugs(category)) {
        const content = getContentBySlug(slug, locale, category);
        if (!content || content.frontmatter.draft) continue;
        content.frontmatter.tags?.forEach((tag) => {
          tags.add(tag);
        });
        entries.push({
          url: `${SITE_URL}/${locale}/blog/${slug}`,
          lastModified: new Date(
            content.frontmatter.updated ?? content.frontmatter.date,
          ),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }

    for (const tag of tags) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/tag/${encodeURIComponent(tag)}`,
        changeFrequency: "monthly",
        priority: 0.4,
      });
    }
  }

  return entries;
}
