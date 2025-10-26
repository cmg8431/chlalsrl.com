import Link from "next/link";

import { getAllContentsForLocale } from "@/features/blog";
import { LocaleType, LanguageSwitcher } from "@/shared";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}) {
  const { locale } = await params;
  const contents = getAllContentsForLocale(locale);

  return (
    <div className="">
      <LanguageSwitcher />

      <div className="space-y-6 mt-8">
        {contents.length === 0 ? (
          <p className="text-gray-500">No contents found.</p>
        ) : (
          contents.map((content) => (
            <article
              key={`${content.category}-${content.slug}`}
              className="border-b border-gray-200 pb-6"
            >
              <Link
                href={`/${locale}/contents/${content.category}/${content.slug}`}
                className="block hover:opacity-80 transition-opacity"
              >
                <div className="mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium uppercase">
                    {content.category}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  {content.frontmatter.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  {content.frontmatter.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <time dateTime={content.frontmatter.date}>
                    {new Date(content.frontmatter.date).toLocaleDateString(
                      locale,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </time>
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
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
