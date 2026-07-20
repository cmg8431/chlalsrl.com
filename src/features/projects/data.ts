import type { LocaleType } from "@/shared";

export interface Project {
  name: string;
  description: Record<LocaleType, string>;
  /** 없으면 링크 없이 이름만 노출 */
  href?: string;
  period: string;
}

/**
 * 홈 '만든 것들' 섹션 데이터.
 * 설명은 블로그 글에 적힌 사실 기반의 한 줄만 — 자세한 소개·링크는 여기서 수정.
 */
export const PROJECTS: Project[] = [
  {
    name: "인포크링크",
    description: {
      ko: "지금 만들고 있는 프로덕트",
      en: "The product I'm building now",
      ja: "いま作っているプロダクト",
    },
    href: "https://link.inpock.co.kr/",
    period: "2022 —",
  },
  {
    name: "고잉",
    description: {
      ko: "한국코드페어 출품작",
      en: "Korea Code Fair entry",
      ja: "韓国コードフェア出品作",
    },
    period: "2021",
  },
  {
    name: "HMM",
    description: {
      ko: "만들고 배포하며 배운 개인 프로젝트",
      en: "A personal project, built and shipped",
      ja: "作って公開しながら学んだ個人プロジェクト",
    },
    period: "2021",
  },
  {
    name: "코드디씨 홈페이지",
    description: {
      ko: "교내 개발 동아리 홈페이지",
      en: "Website for my school's dev club",
      ja: "校内開発クラブのホームページ",
    },
    period: "2021",
  },
];
