import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Link } from "next-view-transitions";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import {
  CodeBlock,
  Comments,
  CopyLinkButton,
  HighlightShare,
  LikeButton,
  TopHighlight,
  extractToc,
  findContentBySlug,
  getAllContentsForLocale,
  getAllSlugs,
  MdxH2,
  MdxH3,
  MdxLink,
  MobileToc,
  PostFooterNav,
  PostKeyboardNav,
  PostList,
  ReadingControls,
  RecentTracker,
  readingMinutes,
  ShareRow,
  Toc,
  ZoomImage,
} from "@/features/blog";
import {
  IslandSignal,
  LocaleType,
  Reveal,
  SUPPORTED_LOCALES,
  translation,
} from "@/shared";

const SITE_URL = "https://chlalsrl.com";

const MDX_OPTIONS = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
  // rehype 플러그인 타입이 next-mdx-remote 옵션 타입과 어긋나 단언이 필요
} as unknown as React.ComponentProps<typeof MDXRemote>["options"];

interface PostPageProps {
  params: Promise<{ locale: LocaleType; slug: string }>;
}

export function generateStaticParams() {
  const allParams: Array<{ locale: LocaleType; slug: string }> = [];

  for (const slug of getAllSlugs()) {
    for (const locale of SUPPORTED_LOCALES) {
      allParams.push({ locale, slug });
    }
  }

  return allParams;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { locale, slug } = await params;
  const content = findContentBySlug(slug, locale);

  if (!content || content.frontmatter.draft) {
    return { title: "Not Found" };
  }

  const { title, description, date, updated, tags } = content.frontmatter;
  const path = `/blog/${slug}`;
  const url = `${SITE_URL}/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LOCALES.map((loc) => [loc, `${SITE_URL}/${loc}${path}`])
        ),
        "x-default": `${SITE_URL}/ko${path}`,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      locale,
      publishedTime: date,
      modifiedTime: updated ?? date,
      authors: ["Mingi Choe"],
      section: content.category,
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function formatDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params;
  const { t } = await translation(locale);
  const content = findContentBySlug(slug, locale);

  // 작성중 글은 목록에 제목만 노출 — 상세 접근은 차단
  if (!content || content.frontmatter.draft) {
    notFound();
  }

  const toc = extractToc(content.content);
  const minutes = readingMinutes(content.content);
  const { title, description, date, updated, tags } = content.frontmatter;

  const all = getAllContentsForLocale(locale).filter(
    (item) => !item.frontmatter.draft
  );
  const index = all.findIndex((item) => item.slug === slug);
  const newer = index > 0 ? all[index - 1] : undefined;
  const older = index >= 0 ? all[index + 1] : undefined;

  const related = tags?.length
    ? all
        .filter(
          (item) =>
            item.slug !== slug &&
            item.frontmatter.tags?.some((tag) => tags.includes(tag))
        )
        .slice(0, 3)
    : [];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("blog.title"),
        item: `${SITE_URL}/${locale}/blog`,
      },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    dateModified: updated ?? date,
    inLanguage: locale,
    keywords: tags?.join(", "),
    author: {
      "@type": "Person",
      name: "Mingi Choe",
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/${locale}/blog/${slug}`,
  };

  return (
    <article className="post-layout">
      <IslandSignal
        message={t("island.reading", { minutes })}
        icon="clock"
        readingMinutes={minutes}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <aside className="post-aside">
        <Toc items={toc} label={t("post.toc")} />
      </aside>

      <ReadingControls />

      <div className="post-main">
        <Reveal>
          <Link
            href={`/${locale}/blog`}
            className="arrow-link text-xs text-faint transition-colors hover:text-muted"
          >
            <span className="arrow inline-block rotate-180">→</span>{" "}
            {t("post.back")}
          </Link>

          <header className="mt-10">
            <Link
              href={`/${locale}/blog?c=${content.category}`}
              className="series-label"
            >
              {t(`categories.${content.category}`)}
            </Link>
            <h1 className="mt-2.5 text-2xl font-semibold leading-snug tracking-tight text-bright sm:text-3xl">
              <span
                className="inline-block"
                style={
                  {
                    viewTransitionName: `post-${content.category}-${slug}`,
                    viewTransitionClass: "vt-morph",
                  } as React.CSSProperties
                }
              >
                {title}
              </span>
            </h1>
            <p className="mt-3 text-muted">{description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-faint">
              <time dateTime={date} className="font-mono tabular-nums">
                {formatDate(date, locale)}
              </time>
              <span className="font-mono tabular-nums">
                · {t("post.minutes", { minutes })}
              </span>
              {updated && (
                <span className="font-mono tabular-nums">
                  · {t("post.updated", { date: formatDate(updated, locale) })}
                </span>
              )}
              <CopyLinkButton label={t("post.copy-link")} />
            </div>
            {tags && tags.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/${locale}/blog/tag/${encodeURIComponent(tag)}`}
                    className="post-tag"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>
        </Reveal>

        {content.fileLocale !== locale && (
          <Reveal delay={70}>
            <p className="mt-8 border-l-2 border-line pl-3.5 text-[13px] leading-relaxed text-muted">
              {t("post.untranslated")}
            </p>
          </Reveal>
        )}

        <Reveal delay={70}>
          <MobileToc items={toc} label={t("post.toc")} />
        </Reveal>

        <Reveal delay={80}>
          <div className="prose-blog mt-12">
            <MDXRemote
              source={content.content}
              components={{
                img: ZoomImage,
                a: MdxLink,
                h2: MdxH2,
                h3: MdxH3,
                pre: CodeBlock,
              }}
              options={MDX_OPTIONS}
            />
          </div>
        </Reveal>

        <HighlightShare slug={slug} />

        <div className="mt-16 flex flex-wrap items-center justify-center gap-2 border-t border-line pt-8">
          <LikeButton slug={slug} />
          <ShareRow title={title} />
        </div>

        <TopHighlight slug={slug} />

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-1 text-sm font-medium text-bright">
              {t("post.related")}
            </h2>
            <PostList contents={related} locale={locale} />
          </section>
        )}

        {(older || newer) && (
          <nav className="mt-16 flex items-start justify-between gap-8">
            {older ? (
              <Link
                href={`/${locale}/blog/${older.slug}`}
                className="arrow-link group min-w-0 flex-1"
              >
                <span className="text-xs text-faint">
                  <span className="arrow inline-block rotate-180">→</span>{" "}
                  {t("post.prev")}
                </span>
                <span className="mt-1.5 block truncate text-sm text-foreground transition-colors group-hover:text-bright">
                  {older.frontmatter.title}
                </span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {newer && (
              <Link
                href={`/${locale}/blog/${newer.slug}`}
                className="arrow-link group min-w-0 flex-1 text-right"
              >
                <span className="text-xs text-faint">
                  {t("post.next")} <span className="arrow">→</span>
                </span>
                <span className="mt-1.5 block truncate text-sm text-foreground transition-colors group-hover:text-bright">
                  {newer.frontmatter.title}
                </span>
              </Link>
            )}
          </nav>
        )}

        <PostKeyboardNav
          prevHref={older ? `/${locale}/blog/${older.slug}` : undefined}
          nextHref={newer ? `/${locale}/blog/${newer.slug}` : undefined}
        />
        <RecentTracker
          href={`/${locale}/blog/${slug}`}
          title={title}
          date={date}
        />

        <Comments slug={slug} />

        <PostFooterNav
          locale={locale}
          backLabel={t("post.back")}
          topLabel={t("post.top")}
        />
      </div>
    </article>
  );
}
