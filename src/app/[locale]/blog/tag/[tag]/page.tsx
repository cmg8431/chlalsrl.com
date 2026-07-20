import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";

import {
  CONTENT_CATEGORIES,
  getAllContents,
  getAllContentsForLocale,
  PostList,
} from "@/features/blog";
import { LocaleType, Reveal, SUPPORTED_LOCALES, translation } from "@/shared";

interface TagPageProps {
  params: Promise<{ locale: LocaleType; tag: string }>;
}

export function generateStaticParams() {
  const params: Array<{ locale: LocaleType; tag: string }> = [];

  for (const locale of SUPPORTED_LOCALES) {
    const tags = new Set<string>();
    for (const category of CONTENT_CATEGORIES) {
      for (const content of getAllContents(locale, category)) {
        content.frontmatter.tags?.forEach((tag) => tags.add(tag));
      }
    }
    for (const tag of tags) {
      params.push({ locale, tag: encodeURIComponent(tag) });
    }
  }

  return params;
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage({ params }: TagPageProps) {
  const { locale, tag: rawTag } = await params;
  const { t } = await translation(locale);
  const tag = decodeURIComponent(rawTag);

  const contents = getAllContentsForLocale(locale).filter((content) =>
    content.frontmatter.tags?.includes(tag)
  );

  if (contents.length === 0) {
    notFound();
  }

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
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-8">
          <PostList contents={contents} locale={locale} />
        </div>
      </Reveal>
    </div>
  );
}
