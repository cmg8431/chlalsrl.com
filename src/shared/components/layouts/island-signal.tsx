"use client";

import { useEffect } from "react";

import { islandStore, type IslandIcon } from "./island-store";

interface IslandSignalProps {
  message?: string;
  icon?: IslandIcon;
  readingMinutes?: number;
}

export function IslandSignal({
  message,
  icon,
  readingMinutes,
}: IslandSignalProps) {
  useEffect(() => {
    islandStore.setContext({ readingMinutes });
    if (message) islandStore.notify(message, { icon });
    return () => islandStore.clearContext();
  }, [message, icon, readingMinutes]);

  return null;
}
