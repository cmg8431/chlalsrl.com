import { execSync } from "child_process";

export interface ChangelogEntry {
  hash: string;
  /** YYYY-MM-DD */
  date: string;
  type: string;
  subject: string;
}

/** 표기할 커밋 타입 — 나머지(chore/ci/test 등)는 소음이라 숨긴다 */
const TYPE_RE = /^(feat|fix|style|docs|refactor|perf)(\([^)]*\))?!?:\s*/;

/**
 * 빌드 시점의 git log를 홈 업데이트 히스토리로 변환한다.
 * Vercel은 얕은 클론(최근 커밋 일부)이라 결과가 짧을 수 있고,
 * .git이 없는 환경이면 빈 배열 — 섹션 자체가 숨겨진다.
 */
export function getChangelog(limit = 6): ChangelogEntry[] {
  try {
    const out = execSync(
      "git log --no-merges --date=short --pretty=format:%h%x09%ad%x09%s -n 80",
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    );

    const entries: ChangelogEntry[] = [];
    for (const line of out.split("\n")) {
      const [hash, date, ...rest] = line.split("\t");
      const subjectRaw = rest.join("\t").trim();
      if (!hash || !date || !subjectRaw) continue;

      const match = subjectRaw.match(TYPE_RE);
      if (!match) continue;

      entries.push({
        hash,
        date,
        type: match[1] ?? "etc",
        subject: subjectRaw.replace(TYPE_RE, ""),
      });
      if (entries.length >= limit) break;
    }
    return entries;
  } catch {
    return [];
  }
}

export function getBuildInfo(): { hash: string; date: string } | null {
  try {
    const out = execSync(
      "git log -1 --date=format:%Y.%m.%d --pretty=format:%h%x09%ad",
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    );
    const [hash, date] = out.trim().split("\t");
    if (!hash || !date) return null;
    return { hash, date };
  } catch {
    return null;
  }
}
