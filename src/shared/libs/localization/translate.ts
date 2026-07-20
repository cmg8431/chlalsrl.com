import en from "./locales/en/common.json";
import ja from "./locales/ja/common.json";
import ko from "./locales/ko/common.json";

import type { LocaleType } from "./helpers";

const DICTIONARIES: Record<LocaleType, unknown> = { ko, en, ja };

type Dict = typeof ko;
type Paths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`;
    }[keyof T & string];

/** ko 사전 기준 자동완성 — 복수형 접미사(_one/_other) 키는 베이스 키로 호출 */
export type TranslationKey = Paths<Dict> | (string & {});
export type TranslateParams = Record<string, string | number>;
export type TFunction = (key: TranslationKey, params?: TranslateParams) => string;

function lookup(dict: unknown, path: string): string | undefined {
  let cur: unknown = dict;
  for (const part of path.split(".")) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(template: string, params?: TranslateParams): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) =>
    String(params?.[name] ?? "")
  );
}

export function translate(
  locale: LocaleType,
  key: string,
  params?: TranslateParams
): string {
  const chain = [DICTIONARIES[locale], DICTIONARIES.en, DICTIONARIES.ko];
  const count = params?.count;

  for (const dict of chain) {
    let raw = lookup(dict, key);
    if (raw === undefined && typeof count === "number") {
      const rule = new Intl.PluralRules(locale).select(count);
      raw = lookup(dict, `${key}_${rule}`) ?? lookup(dict, `${key}_other`);
    }
    if (raw !== undefined) return interpolate(raw, params);
  }
  return key;
}
