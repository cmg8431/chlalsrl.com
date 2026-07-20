interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

// 순수 CSS 애니메이션 — JS 게이팅은 느린 기기에서 이중 모션을 만든다
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <div
      className={`reveal ${className ?? ""}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
