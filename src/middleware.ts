import { NextResponse, NextRequest } from "next/server";

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from "@/shared/libs/localization/helpers";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const hasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  const localeCookie = request.cookies.get("locale")?.value;
  const preferredLocale = SUPPORTED_LOCALES.includes(localeCookie as any)
    ? localeCookie
    : DEFAULT_LOCALE;

  return NextResponse.redirect(
    new URL(`/${preferredLocale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: [
    "/((?!api|.*\\..*|_next/static|_next/image|manifest.json|assets|favicon.ico|icon|apple-icon).*)",
  ],
};
