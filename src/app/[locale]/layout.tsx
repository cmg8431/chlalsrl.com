import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";

import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import { CommandMenu, getAllContentsForLocale } from "@/features/blog";
import {
  LocaleType,
  MainLayout,
  SUPPORTED_LOCALES,
  translation,
} from "@/shared";

import type { Metadata } from "next";

import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chlalsrl.com"),
  title: {
    default: "최민기 — Mingi Choe",
    template: "%s · 최민기",
  },
  description: "프로덕트 엔지니어 최민기. 글과 이력서.",
  openGraph: {
    siteName: "chlalsrl.com",
    type: "website",
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

  const searchItems = getAllContentsForLocale(locale).map((content) => ({
    title: content.frontmatter.title,
    description: content.frontmatter.description,
    date: content.frontmatter.date,
    href: `/${locale}/blog/${content.slug}`,
  }));

  return (
    <ViewTransitions>
      <html lang={locale} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <script dangerouslySetInnerHTML={{ __html: themeInit }} />
          <MainLayout>{children}</MainLayout>
          <CommandMenu
            items={searchItems}
            placeholder={t("search.placeholder")}
            emptyMessage={t("search.empty")}
          />
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  );
}
