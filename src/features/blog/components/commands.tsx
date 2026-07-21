import { hangulToQwerty } from "@/shared";

export interface CommandContext {
  locale: string;
  posts: { title: string; href: string }[];
  go: (href: string) => void;
  setTheme: (choice: "dark" | "light" | "system") => void;
  copy: (text: string) => void;
}

export interface CommandResult {
  /** 터미널에 출력할 줄들 */
  lines: React.ReactNode[];
  /** Enter 시 실행할 액션 */
  run?: () => void;
  /** 액션 힌트 라벨 */
  runLabel?: string;
  /** 실행 후 팔레트를 닫을지 (내비게이션 명령) */
  navigates?: boolean;
}

const VERBS = new Set([
  "help",
  "theme",
  "go",
  "whoami",
  "ls",
  "random",
  "qwerty",
  "sudo",
  "clear",
]);

type Strings = {
  notFound: (cmd: string) => string;
  helpHint: string;
  themeUsage: string;
  themeApply: string;
  goUsage: string;
  goMove: string;
  qwertyUsage: string;
  copy: string;
  sudo: string;
  whoami: string[];
  helpLines: string[];
};

const STRINGS: Record<string, Strings> = {
  ko: {
    notFound: (cmd) => `command not found: ${cmd}`,
    helpHint: "help 를 입력해보세요",
    themeUsage: "theme dark | light | system",
    themeApply: "적용",
    goUsage: "go home | blog | resume",
    goMove: "이동",
    qwertyUsage: "qwerty <한글> — 예: qwerty 최민기",
    copy: "복사",
    sudo: "권한이 없어요. 그래도 시도는 좋았어요 :)",
    whoami: [
      "최민기 (Mingi Choe)",
      "Product Engineer @ inpock",
      "chlalsrl = '최민기'를 두벌식으로 친 것",
    ],
    helpLines: [
      "whoami        내 소개",
      "ls            글 목록",
      "go <곳>       이동 (home/blog/resume)",
      "theme <값>    테마 (dark/light/system)",
      "qwerty <한글> 쿼티로 변환",
      "random        랜덤 글",
    ],
  },
  en: {
    notFound: (cmd) => `command not found: ${cmd}`,
    helpHint: "try typing help",
    themeUsage: "theme dark | light | system",
    themeApply: "apply",
    goUsage: "go home | blog | resume",
    goMove: "go",
    qwertyUsage: "qwerty <korean> — e.g. qwerty 최민기",
    copy: "copy",
    sudo: "permission denied. nice try though :)",
    whoami: [
      "Mingi Choe (최민기)",
      "Product Engineer @ inpock",
      "chlalsrl = '최민기' typed on a QWERTY keyboard",
    ],
    helpLines: [
      "whoami        about me",
      "ls            list posts",
      "go <place>    navigate (home/blog/resume)",
      "theme <v>     theme (dark/light/system)",
      "qwerty <ko>   convert to QWERTY",
      "random        random post",
    ],
  },
  ja: {
    notFound: (cmd) => `command not found: ${cmd}`,
    helpHint: "help と入力してみてください",
    themeUsage: "theme dark | light | system",
    themeApply: "適用",
    goUsage: "go home | blog | resume",
    goMove: "移動",
    qwertyUsage: "qwerty <ハングル> — 例: qwerty 최민기",
    copy: "コピー",
    sudo: "権限がありません。でもいい挑戦でした :)",
    whoami: [
      "Mingi Choe (최민기)",
      "Product Engineer @ inpock",
      "chlalsrl = 「최민기」を2ボル式で打った文字列",
    ],
    helpLines: [
      "whoami        自己紹介",
      "ls            記事一覧",
      "go <場所>     移動 (home/blog/resume)",
      "theme <値>    テーマ (dark/light/system)",
      "qwerty <ハングル> QWERTYに変換",
      "random        ランダム記事",
    ],
  },
};

export function isCommandInput(input: string): boolean {
  const stripped = input.replace(/^>\s*/, "");
  const first = stripped.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  return input.startsWith(">") || VERBS.has(first);
}

export function runCommand(
  input: string,
  ctx: CommandContext
): CommandResult | null {
  const stripped = input.replace(/^>\s*/, "").trim();
  if (!stripped) return null;

  const s = STRINGS[ctx.locale] ?? STRINGS.en!;
  const [verb, ...rest] = stripped.split(/\s+/);
  const arg = rest.join(" ");
  const cmd = (verb ?? "").toLowerCase();
  const base = `/${ctx.locale}`;

  switch (cmd) {
    case "help":
    case "clear":
      return { lines: s.helpLines };

    case "whoami":
      return { lines: s.whoami };

    case "ls":
      return {
        lines: ctx.posts.map((post, i) => `${String(i + 1).padStart(2, "0")}  ${post.title}`),
      };

    case "theme": {
      const value = arg.toLowerCase();
      if (value === "dark" || value === "light" || value === "system") {
        return {
          lines: [`theme → ${value}`],
          run: () => ctx.setTheme(value),
          runLabel: s.themeApply,
        };
      }
      return { lines: [s.themeUsage] };
    }

    case "go": {
      const dest = arg.toLowerCase();
      const map: Record<string, string> = {
        home: base,
        blog: `${base}/blog`,
        resume: `${base}/resume`,
      };
      const href = map[dest];
      if (href) {
        return {
          lines: [`→ ${href}`],
          run: () => ctx.go(href),
          runLabel: s.goMove,
          navigates: true,
        };
      }
      return { lines: [s.goUsage] };
    }

    case "random": {
      if (ctx.posts.length === 0) return { lines: ["no posts"] };
      const pick =
        ctx.posts[Math.floor(Math.random() * ctx.posts.length)]!;
      return {
        lines: [`🎲 ${pick.title}`],
        run: () => ctx.go(pick.href),
        runLabel: s.goMove,
        navigates: true,
      };
    }

    case "qwerty": {
      if (!arg) return { lines: [s.qwertyUsage] };
      const result = hangulToQwerty(arg);
      return {
        lines: [
          <span key="q" className="font-mono">
            {arg}{" "}
            <span className="text-faint">→</span>{" "}
            <span className="text-accent">{result}</span>
          </span>,
        ],
        run: () => ctx.copy(result),
        runLabel: s.copy,
      };
    }

    case "sudo":
      return { lines: [s.sudo] };

    default:
      return { lines: [s.notFound(cmd), s.helpHint] };
  }
}
