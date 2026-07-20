"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print text-xs text-faint transition-colors hover:text-bright"
    >
      {label}
    </button>
  );
}
