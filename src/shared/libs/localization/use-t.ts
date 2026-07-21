"use client";

import { useCallback } from "react";

import { type TFunction, translate } from "./translate";
import { useLocale } from "./use-locale";

export function useT(): TFunction {
  const locale = useLocale();
  return useCallback<TFunction>(
    (key, params) => translate(locale, key, params),
    [locale],
  );
}
