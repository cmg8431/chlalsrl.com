"use client";

import { useEffect } from "react";

/** 개발자 도구를 여는 사람에게만 보이는 시그니처 */
export function ConsoleSignature({ commit }: { commit?: string | null }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    // eslint-disable-next-line no-console
    console.log(
      "%c최민기%c chlalsrl.com\n%c여기까지 열어본 사람, 반가워요. 사이트 코드가 궁금하다면 → github.com/cmg8431/chlalsrl.com" +
        (commit ? `\n지금 보고 있는 배포: ${commit}` : ""),
      "font-size:16px;font-weight:700;color:#C46B47;",
      "font-size:12px;color:#9B958B;",
      "font-size:12px;color:#6E6A62;line-height:1.8;",
    );
  }, [commit]);

  return null;
}
