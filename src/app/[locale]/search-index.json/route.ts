import { getAllContentsForLocale } from "@/features/blog";
import { SUPPORTED_LOCALES } from "@/shared";

import type { LocaleType } from "@/shared";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

/** 마크다운 → 검색용 플레인 텍스트 */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ") // 코드 블록
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // 이미지
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 링크 → 텍스트
    .replace(/[#>*_`~|-]/g, " ") // 마크다운 기호
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: LocaleType }> }
) {
  const { locale } = await params;

  const index = getAllContentsForLocale(locale)
    .filter((content) => !content.frontmatter.draft)
    .map((content) => ({
      href: `/${locale}/blog/${content.slug}`,
      body: toPlainText(content.content),
    }));

  return Response.json(index);
}
