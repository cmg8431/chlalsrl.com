import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";

import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import type { Metadata, Viewport } from "next";
import { CommandMenu, getAllContentsForLocale } from "@/features/blog";
import { getBuildInfo } from "@/features/changelog";
import {
  ConsoleSignature,
  Konami,
  type LocaleType,
  MainLayout,
  SUPPORTED_LOCALES,
  translation,
} from "@/shared";

import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfb" },
    { media: "(prefers-color-scheme: dark)", color: "#111110" },
  ],
};

const OG_LOCALE: Record<string, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
};

// 검색 결과에 그대로 노출되는 문구 — 제목은 60자, 설명은 120~160자 안쪽으로 유지
const SEO_COPY: Record<
  LocaleType,
  { title: string; template: string; description: string }
> = {
  ko: {
    title: "최민기 Mingi Choe | 프로덕트 엔지니어",
    template: "%s | 최민기",
    description:
      "프로덕트 엔지니어 최민기의 블로그. 개발과 제품 만들기, 그 과정에서 배운 것들을 기록해요.",
  },
  en: {
    title: "Mingi Choe | Product Engineer",
    template: "%s | Mingi Choe",
    description:
      "Blog by Mingi Choe, a product engineer. Writing about engineering, building products, and what I learn along the way.",
  },
  ja: {
    title: "Mingi Choe | プロダクトエンジニア",
    template: "%s | Mingi Choe",
    description:
      "プロダクトエンジニア Mingi Choe のブログ。開発とプロダクトづくりで学んだことを記録しています。",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_COPY[locale];
  return {
    ...BASE_METADATA,
    title: { default: seo.title, template: seo.template },
    description: seo.description,
    openGraph: {
      ...BASE_METADATA.openGraph,
      description: seo.description,
      locale: OG_LOCALE[locale] ?? "ko_KR",
      alternateLocale: Object.values(OG_LOCALE).filter(
        (l) => l !== (OG_LOCALE[locale] ?? "ko_KR"),
      ),
    },
  };
}

const BASE_METADATA: Metadata = {
  metadataBase: new URL("https://chlalsrl.com"),
  keywords: [
    "최민기",
    "Mingi Choe",
    "프로덕트 엔지니어",
    "프론트엔드",
    "프론트엔드 개발자",
    "개발자",
    "개발 블로그",
    "product engineer",
    "frontend engineer",
    "software engineer",
  ],
  authors: [{ name: "Mingi Choe", url: "https://chlalsrl.com" }],
  creator: "Mingi Choe",
  publisher: "Mingi Choe",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    siteName: "chlalsrl.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@cmg8431",
    creator: "@cmg8431",
  },
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
  verification: {
    google: "lmVS8vd_iMh0UxVRQ7CYEwmi1p6n1ZNwXMC2s5MzgjU",
    other: {
      "naver-site-verification": "9bac99fe9cc064b811849588196f0b8854c10abc",
    },
  },
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

const themeInit = `(function(){try{var d=document.documentElement,t=localStorage.getItem("theme");if(t==="dark"||t==="light")d.dataset.theme=t;var s=localStorage.getItem("reading-size");if(s==="sm"||s==="lg")d.dataset.readingSize=s;if(localStorage.getItem("reading-focus")==="on")d.dataset.readingFocus="on";if(sessionStorage.getItem("locale-switched")){d.dataset.langEnter="";setTimeout(function(){delete d.dataset.langEnter},520)}}catch(e){}addEventListener("pageshow",function(){delete d.dataset.langExit})})()`;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: LocaleType }>;
}>) {
  const { locale } = await params;
  const { t } = await translation(locale);

  const searchItems = [
    // 페이지 내비게이션 액션 — 글 목록 위에 고정 노출
    {
      title: t("nav.home"),
      href: `/${locale}`,
      meta: t("search.page"),
    },
    {
      title: t("blog.title"),
      href: `/${locale}/blog`,
      meta: t("search.page"),
    },
    ...getAllContentsForLocale(locale)
      .filter((content) => !content.frontmatter.draft)
      .map((content) => ({
        title: content.frontmatter.title,
        description: content.frontmatter.description,
        date: content.frontmatter.date,
        href: `/${locale}/blog/${content.slug}`,
      })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://chlalsrl.com/#person",
        name: "Mingi Choe",
        alternateName: "최민기",
        url: "https://chlalsrl.com",
        jobTitle: "Product Engineer",
        knowsAbout: [
          "Product Engineering",
          "Frontend Development",
          "Software Development",
          "Web",
        ],
        sameAs: [
          "https://github.com/cmg8431",
          "https://twitter.com/cmg8431",
          "https://www.linkedin.com/in/cmg8431/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://chlalsrl.com/#website",
        url: "https://chlalsrl.com",
        name: "최민기 Mingi Choe",
        description: SEO_COPY[locale].description,
        inLanguage: locale,
        author: { "@id": "https://chlalsrl.com/#person" },
      },
    ],
  };

  return (
    <ViewTransitions>
      <html
        lang={locale}
        suppressHydrationWarning
        data-scroll-behavior="smooth"
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <script dangerouslySetInnerHTML={{ __html: themeInit }} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <MainLayout skipLabel={t("a11y.skip")}>{children}</MainLayout>
          <CommandMenu
            items={searchItems}
            placeholder={t("search.placeholder")}
            emptyMessage={t("search.empty")}
            recentLabel={t("search.recent")}
          />
          <ConsoleSignature commit={getBuildInfo()?.hash} />
          <Konami message={t("island.konami")} />
          <Analytics />
          <GoogleAnalytics gaId="G-XWZ35DZJKR" />
        </body>
      </html>
    </ViewTransitions>
  );
}
