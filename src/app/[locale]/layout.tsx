import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";

import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import { CommandMenu, getAllContentsForLocale } from "@/features/blog";
import { getBuildInfo } from "@/features/changelog";
import {
  ConsoleSignature,
  Konami,
  LocaleType,
  MainLayout,
  SiteFooter,
  SUPPORTED_LOCALES,
  translation,
} from "@/shared";

import type { Metadata, Viewport } from "next";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleType }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...BASE_METADATA,
    openGraph: {
      ...BASE_METADATA.openGraph,
      locale: OG_LOCALE[locale] ?? "ko_KR",
      alternateLocale: Object.values(OG_LOCALE).filter(
        (l) => l !== (OG_LOCALE[locale] ?? "ko_KR")
      ),
    },
  };
}

const BASE_METADATA: Metadata = {
  metadataBase: new URL("https://chlalsrl.com"),
  title: {
    default: "최민기 — Mingi Choe",
    template: "%s · 최민기",
  },
  description:
    "프로덕트 엔지니어 최민기. 프론트엔드, 프로덕트, 그리고 만들고 살아가며 남기는 기록.",
  keywords: [
    "최민기",
    "Mingi Choe",
    "프론트엔드",
    "프로덕트 엔지니어",
    "개발 블로그",
    "frontend engineer",
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
    creator: "@cmg8431",
  },
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

const themeInit = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}})()`;

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
        name: "최민기 — Mingi Choe",
        inLanguage: locale,
        author: { "@id": "https://chlalsrl.com/#person" },
      },
    ],
  };

  return (
    <ViewTransitions>
      <html lang={locale} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <script dangerouslySetInnerHTML={{ __html: themeInit }} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <MainLayout
            skipLabel={t("a11y.skip")}
            footer={
              <SiteFooter
                commit={getBuildInfo()}
                repoUrl="https://github.com/cmg8431/chlalsrl.com"
              />
            }
          >
            {children}
          </MainLayout>
          <CommandMenu
            items={searchItems}
            placeholder={t("search.placeholder")}
            emptyMessage={t("search.empty")}
            recentLabel={t("search.recent")}
          />
          <ConsoleSignature commit={getBuildInfo()?.hash} />
          <Konami message={t("island.konami")} />
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  );
}
