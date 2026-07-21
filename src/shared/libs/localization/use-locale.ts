"use client";

import { usePathname } from "next/navigation";

import { DEFAULT_LOCALE, type LocaleType, SUPPORTED_LOCALES } from "./helpers";

export function useLocale(): LocaleType {
  const pathname = usePathname();

  const locale = SUPPORTED_LOCALES.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`,
  );

  return locale || DEFAULT_LOCALE;
}
