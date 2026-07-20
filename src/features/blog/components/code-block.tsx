"use client";

import { useRef } from "react";

import { islandStore, useT } from "@/shared";

type CodeBlockProps = React.HTMLAttributes<HTMLPreElement> & {
  "data-language"?: string;
};

export function CodeBlock({ children, ...props }: CodeBlockProps) {
  const ref = useRef<HTMLPreElement>(null);
  const t = useT();
  const language = props["data-language"];

  const copy = async () => {
    const text = ref.current?.innerText;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      islandStore.notify(t("island.copied-code"), {
        icon: "check",
        duration: 1100,
      });
    } catch {
      /* clipboard 미지원 */
    }
  };

  return (
    <div className="code-frame group">
      <div className="code-toolbar">
        {language && <span className="code-lang">{language}</span>}
        <button
          onClick={copy}
          aria-label="Copy code"
          className="code-copy"
          type="button"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="9" y="9" width="12" height="12" rx="2.5" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>
      <pre ref={ref} {...props}>
        {children}
      </pre>
    </div>
  );
}
