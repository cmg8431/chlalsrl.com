import { getAllContentsForLocale } from "@/features/blog";
import { DEFAULT_LOCALE } from "@/shared";

const SITE_URL = "https://chlalsrl.com";

export const dynamic = "force-static";

/** AI 검색엔진용 사이트 요약 — https://llmstxt.org 규격 */
export function GET() {
  const contents = getAllContentsForLocale(DEFAULT_LOCALE).filter(
    (content) => !content.frontmatter.draft,
  );

  const posts = contents.map((content) => {
    const url = `${SITE_URL}/${DEFAULT_LOCALE}/blog/${content.slug}`;
    return `- [${content.frontmatter.title}](${url}): ${content.frontmatter.description}`;
  });

  const text = [
    "# 최민기 Mingi Choe",
    "",
    "> 프로덕트 엔지니어 최민기의 블로그. 개발과 제품 만들기, 그 과정에서 배운 것들을 기록해요.",
    "",
    "## 글",
    "",
    ...posts,
    "",
    "## 링크",
    "",
    `- [RSS](${SITE_URL}/rss.xml)`,
    "- [GitHub](https://github.com/cmg8431)",
    "- [X](https://twitter.com/cmg8431)",
    "",
  ].join("\n");

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
