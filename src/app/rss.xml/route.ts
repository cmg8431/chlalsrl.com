import { getAllContentsForLocale } from "@/features/blog";
import { DEFAULT_LOCALE } from "@/shared";

const SITE_URL = "https://chlalsrl.com";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const contents = getAllContentsForLocale(DEFAULT_LOCALE);

  const items = contents
    .map((content) => {
      const url = `${SITE_URL}/${DEFAULT_LOCALE}/blog/${content.slug}`;
      return `    <item>
      <title>${escapeXml(content.frontmatter.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(content.frontmatter.description)}</description>
      <pubDate>${new Date(content.frontmatter.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>최민기 — Mingi Choe</title>
    <link>${SITE_URL}</link>
    <description>프로덕트 엔지니어 최민기의 글</description>
    <language>${DEFAULT_LOCALE}</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
