import { translate, type TFunction } from "./translate";

export const SUPPORTED_LOCALES = ["en", "ko", "ja"] as const;
export const DEFAULT_LOCALE = "ko" as const;

export type LocaleType = (typeof SUPPORTED_LOCALES)[number];

export async function translation(
  locale: LocaleType
): Promise<{ t: TFunction }> {
  return { t: (key, params) => translate(locale, key, params) };
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

  // 리로드 후 아일랜드가 "언어 변경" 알림을 띄울 수 있게 플래그를 남긴다
  try {
    sessionStorage.setItem("locale-switched", newLocale);
  } catch {
    /* private mode */
  }

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
