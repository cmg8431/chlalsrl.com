import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { LocaleType, SUPPORTED_LOCALES } from "@/shared";
import { CONTENT_CATEGORIES, ContentCategory } from "@/shared/libs/content";
import {
  getContentBySlug,
  getContentSlugs,
} from "@/shared/libs/content/server";

interface ContentPageProps {
  params: Promise<{
    locale: LocaleType;
    category: ContentCategory;
    slug: string;
  }>;
}

export function generateStaticParams() {
  const allParams: Array<{
    locale: LocaleType;
    category: ContentCategory;
    slug: string;
  }> = [];

  for (const category of CONTENT_CATEGORIES) {
    const slugs = getContentSlugs(category);
    for (const slug of slugs) {
      for (const locale of SUPPORTED_LOCALES) {
        allParams.push({ locale, category, slug });
      }
    }
  }

  return allParams;
}

export async function generateMetadata({ params }: ContentPageProps) {
  const { locale, category, slug } = await params;
  const content = getContentBySlug(slug, locale, category);

  if (!content) {
    return {
      title: "Content Not Found",
    };
  }

  return {
    title: content.frontmatter.title,
    description: content.frontmatter.description,
  };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { locale, category, slug } = await params;
  const content = getContentBySlug(slug, locale, category);

  if (!content) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium uppercase">
            {category}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">{content.frontmatter.title}</h1>
        <p className="text-xl text-gray-600 mb-4">
          {content.frontmatter.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 border-b pb-4">
          <time dateTime={content.frontmatter.date}>
            {new Date(content.frontmatter.date).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {content.frontmatter.author && (
            <span>By {content.frontmatter.author}</span>
          )}
          {content.frontmatter.tags && (
            <div className="flex gap-2">
              {content.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <MDXRemote source={content.content} />
      </div>
    </article>
  );
}
