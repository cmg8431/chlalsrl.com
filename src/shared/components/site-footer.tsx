interface SiteFooterProps {
  commit?: { hash: string; date: string } | null;
  repoUrl: string;
}

/** 하단 고정 푸터 — 저작권 + 배포 커밋(개발자 시그니처) */
export function SiteFooter({ commit, repoUrl }: SiteFooterProps) {
  return (
    <footer className="no-print mx-auto w-full max-w-xl px-6 pb-8">
      <div className="flex items-center justify-between border-t border-line pt-5 font-mono text-[11px] text-faint">
        <span>© {new Date().getFullYear()} Mingi Choe</span>
        {commit ? (
          <a
            href={`${repoUrl}/commit/${commit.hash}`}
            target="_blank"
            rel="noreferrer"
            className="tabular-nums transition-colors hover:text-bright"
            title="Deployed commit"
          >
            {commit.hash} · {commit.date}
          </a>
        ) : (
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-bright"
          >
            source
          </a>
        )}
      </div>
    </footer>
  );
}
