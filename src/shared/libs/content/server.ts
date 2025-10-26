import fs from "fs";
import path from "path";

import matter from "gray-matter";

import type { Content, ContentCategory } from "./types";
import type { LocaleType } from "@/shared";

const CONTENT_DIR = path.join(process.cwd(), "src/contents");
const FILE_EXTENSIONS = [".mdx", ".md"] as const;

const getCategoryDir = (category: ContentCategory): string => {
  return path.join(CONTENT_DIR, category);
};

const getSlugDir = (category: ContentCategory, slug: string): string => {
  return path.join(getCategoryDir(category), slug);
};

const isDirectory = (categoryDir: string, entry: string): boolean => {
  try {
    return fs.statSync(path.join(categoryDir, entry)).isDirectory();
  } catch {
    return false;
  }
};

const findContentPath = (
  category: ContentCategory,
  slug: string,
  locale: LocaleType
): string | null => {
  const slugDir = getSlugDir(category, slug);
  if (!fs.existsSync(slugDir)) return null;

  for (const ext of FILE_EXTENSIONS) {
    const filePath = path.join(slugDir, `${locale}${ext}`);
    if (fs.existsSync(filePath)) return filePath;
  }

  return null;
};

const sortByDate = (a: Content, b: Content): number => {
  return (
    new Date(b.frontmatter.date).getTime() -
    new Date(a.frontmatter.date).getTime()
  );
};

export function getContentSlugs(category: ContentCategory): string[] {
  const categoryDir = getCategoryDir(category);
  if (!fs.existsSync(categoryDir)) return [];

  try {
    const entries = fs.readdirSync(categoryDir);
    return entries.filter((entry) => isDirectory(categoryDir, entry));
  } catch {
    return [];
  }
}

export function getContentBySlug(
  slug: string,
  locale: LocaleType,
  category: ContentCategory
): Content | null {
  const contentPath = findContentPath(category, slug, locale);
  if (!contentPath) return null;

  try {
    const fileContents = fs.readFileSync(contentPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      category,
      frontmatter: data as Content["frontmatter"],
      content,
    };
  } catch {
    return null;
  }
}

export function getAllContents(
  locale: LocaleType,
  category: ContentCategory
): Content[] {
  const slugs = getContentSlugs(category);

  return slugs
    .map((slug) => getContentBySlug(slug, locale, category))
    .filter((content): content is Content => content !== null)
    .sort(sortByDate);
}

export function getAllContentsForLocale(locale: LocaleType): Content[] {
  const { CONTENT_CATEGORIES } = require("./types");
  const allContents: Content[] = [];

  for (const category of CONTENT_CATEGORIES) {
    allContents.push(...getAllContents(locale, category));
  }

  return allContents.sort(sortByDate);
}

export function getContentsByTag(
  locale: LocaleType,
  category: ContentCategory,
  tag: string
): Content[] {
  return getAllContents(locale, category).filter((content) =>
    content.frontmatter.tags?.includes(tag)
  );
}

export function getAllTags(
  locale: LocaleType,
  category: ContentCategory
): string[] {
  const contents = getAllContents(locale, category);
  const tags = new Set<string>();

  contents.forEach((content) => {
    content.frontmatter.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

export function hasContentForLocale(
  slug: string,
  locale: LocaleType,
  category: ContentCategory
): boolean {
  return findContentPath(category, slug, locale) !== null;
}

export function getAvailableLocales(
  slug: string,
  category: ContentCategory
): LocaleType[] {
  const slugDir = getSlugDir(category, slug);
  if (!fs.existsSync(slugDir)) return [];

  const locales: LocaleType[] = ["ko", "en"];
  return locales.filter(
    (locale) => findContentPath(category, slug, locale) !== null
  );
}
