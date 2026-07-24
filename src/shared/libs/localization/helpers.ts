import { type TFunction, translate } from "./translate";

export const SUPPORTED_LOCALES = ["en", "ko", "ja"] as const;
export const DEFAULT_LOCALE = "ko" as const;

export type LocaleType = (typeof SUPPORTED_LOCALES)[number];

export async function translation(
  locale: LocaleType,
): Promise<{ t: TFunction }> {
  return { t: (key, params) => translate(locale, key, params) };
}

/** 현재 URL에서 로케일 세그먼트만 갈아 끼운 경로. 이미 그 언어면 null */
export function localeHref(newLocale: LocaleType): string | null {
  if (typeof window === "undefined") return null;

  const { pathname, search, hash } = window.location;

  const currentLocale = SUPPORTED_LOCALES.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`,
  );

  if (newLocale === currentLocale) return null;

  let pathWithoutLocale = pathname;
  if (currentLocale) {
    pathWithoutLocale =
      pathname === `/${currentLocale}`
        ? ""
        : pathname.slice(`/${currentLocale}`.length);
  }

  return `/${newLocale}${pathWithoutLocale}${search}${hash}`;
}

/** 선택한 언어를 쿠키에 기억하고, 아일랜드가 "언어 변경" 알림을 띄울 플래그를 남긴다 */
export function persistLocaleSwitch(newLocale: LocaleType) {
  document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;

  try {
    sessionStorage.setItem("locale-switched", newLocale);
  } catch {
    /* private mode */
  }
}
