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
  const contents = getAllContentsForLocale(DEFAULT_LOCALE).filter(
    (content) => !content.frontmatter.draft
  );

  const items = contents
    .map((content) => {
      const url = `${SITE_URL}/${DEFAULT_LOCALE}/blog/${content.slug}`;
      const tags = (content.frontmatter.tags ?? [])
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");
      return `    <item>
      <title>${escapeXml(content.frontmatter.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(content.frontmatter.description)}</description>
      <pubDate>${new Date(content.frontmatter.date).toUTCString()}</pubDate>
${tags}
    </item>`;
    })
    .join("\n");

  const lastBuildDate = contents[0]
    ? new Date(contents[0].frontmatter.date).toUTCString()
    : new Date(0).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>최민기 — Mingi Choe</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>프로덕트 엔지니어 최민기의 글</description>
    <language>${DEFAULT_LOCALE}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
