import { InitOptions } from "i18next";

export const SUPPORTED_LOCALES = ["en", "ko"] as const;
export const DEFAULT_LOCALE = "ko" as const;
export const DEFAULT_NAMESPACE = "common" as const;

export type LocaleType = (typeof SUPPORTED_LOCALES)[number];
export type NamespaceType = typeof DEFAULT_NAMESPACE | string;

export function getI18nOptions(
  lang: LocaleType = DEFAULT_LOCALE,
  ns: NamespaceType = DEFAULT_NAMESPACE
): InitOptions {
  return {
    supportedLngs: [...SUPPORTED_LOCALES],
    fallbackLng: DEFAULT_LOCALE,
    lng: lang,
    fallbackNS: DEFAULT_NAMESPACE,
    defaultNS: DEFAULT_NAMESPACE,
    ns,
  };
}

export function changeLanguage(newLocale: LocaleType) {
  if (typeof window === "undefined") return;

  const pathname = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;

  const currentLocale = SUPPORTED_LOCALES.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  if (newLocale === currentLocale) return;

  document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;

  let pathWithoutLocale = pathname;
  if (currentLocale) {
    if (pathname.startsWith(`/${currentLocale}/`)) {
      pathWithoutLocale = pathname.slice(`/${currentLocale}`.length);
    } else if (pathname === `/${currentLocale}`) {
      pathWithoutLocale = "";
    }
  }

  window.location.href = `/${newLocale}${pathWithoutLocale}${search}${hash}`;
}
