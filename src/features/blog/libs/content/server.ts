import fs from "fs";
import path from "path";

import matter from "gray-matter";

import { CONTENT_CATEGORIES } from "./types";

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
): { filePath: string; fileLocale: string } | null => {
  const slugDir = getSlugDir(category, slug);
  if (!fs.existsSync(slugDir)) return null;

  // 요청 로케일 → en → ko 순 폴백: 번역이 없는 로케일(ja 등)에서도 글이 보이게
  const candidates = [...new Set([locale, "en", "ko"])];
  for (const candidate of candidates) {
    for (const ext of FILE_EXTENSIONS) {
      const filePath = path.join(slugDir, `${candidate}${ext}`);
      if (fs.existsSync(filePath)) {
        return { filePath, fileLocale: candidate };
      }
    }
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
  const found = findContentPath(category, slug, locale);
  if (!found) return null;

  try {
    const fileContents = fs.readFileSync(found.filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      category,
      frontmatter: data as Content["frontmatter"],
      content,
      fileLocale: found.fileLocale,
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
  const allContents: Content[] = [];

  for (const category of CONTENT_CATEGORIES) {
    allContents.push(...getAllContents(locale, category));
  }

  return allContents.sort(sortByDate);
}

// URL에 카테고리를 노출하지 않으므로 slug는 카테고리 전체에서 유일해야 한다
export function findContentBySlug(
  slug: string,
  locale: LocaleType
): Content | null {
  for (const category of CONTENT_CATEGORIES) {
    const content = getContentBySlug(slug, locale, category);
    if (content) return content;
  }
  return null;
}

export function getAllSlugs(): string[] {
  const slugs = new Set<string>();
  for (const category of CONTENT_CATEGORIES) {
    for (const slug of getContentSlugs(category)) {
      slugs.add(slug);
    }
  }
  return Array.from(slugs);
}

