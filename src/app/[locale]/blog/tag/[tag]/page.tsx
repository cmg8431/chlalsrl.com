import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import {
  CONTENT_CATEGORIES,
  getAllContents,
  getAllContentsForLocale,
  PostList,
} from "@/features/blog";
import {
  type LocaleType,
  Reveal,
  SUPPORTED_LOCALES,
  translation,
} from "@/shared";

interface TagPageProps {
  params: Promise<{ locale: LocaleType; tag: string }>;
}

export function generateStaticParams() {
  const params: Array<{ locale: LocaleType; tag: string }> = [];

  for (const locale of SUPPORTED_LOCALES) {
    const tags = new Set<string>();
    for (const category of CONTENT_CATEGORIES) {
      for (const content of getAllContents(locale, category)) {
        content.frontmatter.tags?.forEach((tag) => {
          tags.add(tag);
        });
      }
    }
    // 인코딩은 Next가 담당한다 — 미리 인코딩하면 이중 인코딩된 경로로
    // 프리렌더되어 실제 링크(한글 태그)가 404로 떨어진다
    for (const tag of tags) {
      params.push({ locale, tag });
    }
  }

  return params;
}

const SITE_URL = "https://chlalsrl.com";

export async function generateMetadata({ params }: TagPageProps) {
  const { locale, tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const url = `${SITE_URL}/${locale}/blog/tag/${encodeURIComponent(tag)}`;
  return {
    title: `#${tag}`,
    description: `#${tag}`,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LOCALES.map((loc) => [
            loc,
            `${SITE_URL}/${loc}/blog/tag/${encodeURIComponent(tag)}`,
          ]),
        ),
        "x-default": `${SITE_URL}/ko/blog/tag/${encodeURIComponent(tag)}`,
      },
    },
    openGraph: { url, title: `#${tag}` },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { locale, tag: rawTag } = await params;
  const { t } = await translation(locale);
  const tag = decodeURIComponent(rawTag);

  const published = getAllContentsForLocale(locale).filter(
    (content) => !content.frontmatter.draft,
  );
  const contents = published.filter((content) =>
    content.frontmatter.tags?.includes(tag),
  );

  if (contents.length === 0) {
    notFound();
  }

  // 발행 글의 태그 전체 — 현재 태그를 앞에, 나머지는 글 수 순으로
  const tagCounts = new Map<string, number>();
  for (const content of published) {
    for (const item of content.frontmatter.tags ?? []) {
      tagCounts.set(item, (tagCounts.get(item) ?? 0) + 1);
    }
  }
  const otherTags = Array.from(tagCounts.entries())
    .filter(([name]) => name !== tag)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  return (
    <div>
      <Reveal>
        <Link
          href={`/${locale}/blog`}
          className="arrow-link text-xs text-faint transition-colors hover:text-muted"
        >
          <span className="arrow inline-block rotate-180">→</span>{" "}
          {t("post.back")}
        </Link>
        <h1 className="mt-6 text-xl font-semibold tracking-tight text-bright">
          #{tag}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {t("blog.count", { count: contents.length })}
        </p>
        {otherTags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="flex h-8 items-center rounded-full bg-soft px-3.5 text-[13px] leading-none font-medium text-bright">
              #{tag}
            </span>
            {otherTags.map((name) => (
              <Link
                key={name}
                href={`/${locale}/blog/tag/${encodeURIComponent(name)}`}
                className="flex h-8 items-center rounded-full border border-line px-3.5 text-[13px] leading-none text-muted transition-colors hover:border-faint hover:text-bright"
              >
                #{name}
              </Link>
            ))}
          </div>
        )}
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-8">
          <PostList contents={contents} locale={locale} />
        </div>
      </Reveal>
    </div>
  );
}
