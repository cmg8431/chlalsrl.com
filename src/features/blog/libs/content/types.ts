export const CONTENT_CATEGORIES = ["dev", "life", "stock"] as const;
export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];

export interface ContentFrontmatter {
  title: string;
  description: string;
  date: string;
  /** 마지막 수정일 — 있으면 상세에 함께 표기되고 SEO modifiedTime으로 쓰인다 */
  updated?: string;
  /** 작성중 — 목록에는 제목만 노출되고 상세·검색·RSS·사이트맵에서 제외된다 */
  draft?: boolean;
  tags?: string[];
  author?: string;
  thumbnail?: string;
}

export interface Content {
  slug: string;
  category: ContentCategory;
  frontmatter: ContentFrontmatter;
  content: string;
  /** 실제로 읽힌 파일의 로케일 — 요청 로케일과 다르면 번역 폴백된 것 */
  fileLocale: string;
}
