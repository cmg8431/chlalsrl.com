"use client";

/**
 * 채용 담당자가 실제로 누르는 버튼이라 회색 글씨로 흘려두지 않는다.
 * 문서 톤을 깨지 않는 선에서 테두리로 눌러볼 것임을 알린다.
 */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-full border border-line px-3.5 py-1.5 text-[12.5px] text-muted transition-colors hover:border-faint hover:bg-soft hover:text-bright active:scale-95"
    >
      {label}
    </button>
  );
}
