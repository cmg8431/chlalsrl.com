import type { IslandIcon } from "./island-store";

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" {...STROKE} aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...STROKE} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...STROKE} aria-hidden>
      <path d="m16.5 3.5 4 4L8 20l-5 1 1-5L16.5 3.5Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...STROKE} aria-hidden>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...STROKE} aria-hidden>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...STROKE} aria-hidden>
      <path d="M10 14a5 5 0 0 0 7.1.4l3-3a5 5 0 0 0-7-7l-1.7 1.6" />
      <path d="M14 10a5 5 0 0 0-7.1-.4l-3 3a5 5 0 0 0 7 7l1.7-1.6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...STROKE} aria-hidden>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...STROKE} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" {...STROKE} aria-hidden>
      <path d="M12 20.5s-7.5-4.7-9.5-9A5.3 5.3 0 0 1 12 6.6a5.3 5.3 0 0 1 9.5 4.9c-2 4.3-9.5 9-9.5 9Z" />
    </svg>
  );
}

export function MessageIcon({ name }: { name: IslandIcon }) {
  switch (name) {
    case "clock":
      return <ClockIcon />;
    case "pen":
      return <PenIcon />;
    case "sun":
      return <SunIcon />;
    case "moon":
      return <MoonIcon />;
    case "link":
      return <LinkIcon />;
    case "check":
      return <CheckIcon />;
    case "globe":
      return <GlobeIcon />;
    case "heart":
      return <HeartIcon />;
  }
}
