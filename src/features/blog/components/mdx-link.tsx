import type { AnchorHTMLAttributes } from "react";

/** 본문 링크 — 외부 링크는 새 탭 + ↗ 표시, 내부 링크는 그대로 */
export function MdxLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? "";
  const external = /^https?:\/\//.test(href);

  if (!external) return <a {...props} />;

  return (
    <a {...props} target="_blank" rel="noreferrer" className="external-link" />
  );
}
