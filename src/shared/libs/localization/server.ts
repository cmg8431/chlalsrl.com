import { createInstance, type TFunction, type i18n } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";

import { getI18nOptions, LocaleType, DEFAULT_NAMESPACE } from "./helpers";

export async function translation(
  language: LocaleType,
  ns: string = DEFAULT_NAMESPACE
): Promise<{
  t: TFunction;
  i18n: i18n;
}> {
  const i18nextInstance = createInstance();

  await i18nextInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init(getI18nOptions(language, ns));

  return {
    t: i18nextInstance.getFixedT(language, ns),
    i18n: i18nextInstance,
  };
}
