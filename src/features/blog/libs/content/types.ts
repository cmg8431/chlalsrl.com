export const CONTENT_CATEGORIES = ["dev", "life", "stock"] as const;
export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];

export interface ContentFrontmatter {
  title: string;
  description: string;
  date: string;
  /** 마지막 수정일 — 있으면 상세에 함께 표기되고 SEO modifiedTime으로 쓰인다 */
  updated?: string;
  tags?: string[];
  author?: string;
  thumbnail?: string;
}

export interface Content {
  slug: string;
  category: ContentCategory;
  frontmatter: ContentFrontmatter;
  content: string;
}
