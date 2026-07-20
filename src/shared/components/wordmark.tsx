interface WordmarkProps {
  primary: string;
  secondary: string;
  className?: string;
}

export function Wordmark({ primary, secondary, className = "" }: WordmarkProps) {
  return (
    <span className={`wordmark ${className}`} aria-label={primary}>
      <span className="wm-a" aria-hidden>
        {Array.from(primary).map((ch, i) => (
          <span key={i} style={{ "--d": `${i * 18}ms` } as React.CSSProperties}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
      <span className="wm-b" aria-hidden>
        {Array.from(secondary).map((ch, i) => (
          <span
            key={i}
            style={{ "--d": `${80 + i * 45}ms` } as React.CSSProperties}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
    </span>
  );
}

export function localizedNames(locale: string): {
  primary: string;
  secondary: string;
} {
  return locale === "ko"
    ? { primary: "최민기", secondary: "Mingi Choe" }
    : { primary: "Mingi Choe", secondary: "최민기" };
}
