"use client";

import { islandStore, useT } from "@/shared";

function useCopyLink() {
  const t = useT();
  return async (hash?: string) => {
    const url = `${location.origin}${location.pathname}${hash ? `#${hash}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      islandStore.notify(t("island.copied-link"), {
        icon: "link",
        duration: 1100,
      });
    } catch {
      /* clipboard 미지원 */
    }
  };
}

export function HeadingAnchor({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const copy = useCopyLink();

  return (
    <a
      href={`#${id}`}
      className="heading-anchor"
      onClick={() => copy(id)}
    >
      {children}
    </a>
  );
}

export function CopyLinkButton({ label }: { label: string }) {
  const copy = useCopyLink();

  return (
    <button
      onClick={() => copy()}
      aria-label={label}
      title={label}
      className="rounded-full p-1.5 text-faint transition-colors hover:bg-soft hover:text-bright"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M10 14a5 5 0 0 0 7.1.4l3-3a5 5 0 0 0-7-7l-1.7 1.6" />
        <path d="M14 10a5 5 0 0 0-7.1-.4l-3 3a5 5 0 0 0 7 7l1.7-1.6" />
      </svg>
    </button>
  );
}
