export const CONTENT_CATEGORIES = ["dev", "life", "stock"] as const;
export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];

export interface ContentFrontmatter {
  title: string;
  description: string;
  date: string;
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
