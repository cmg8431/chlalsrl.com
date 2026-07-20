"use client";

import { useT } from "../libs";

import { MailIcon } from "./icons";
import { islandStore } from "./layouts/island-store";

export function CopyEmailButton({
  email,
  className = "",
}: {
  email: string;
  className?: string;
}) {
  const t = useT();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      islandStore.notify(t("island.copied-email"), {
        icon: "check",
        duration: 1100,
      });
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      onClick={copy}
      aria-label={`Copy email: ${email}`}
      title={email}
      className={className}
    >
      <MailIcon />
    </button>
  );
}
