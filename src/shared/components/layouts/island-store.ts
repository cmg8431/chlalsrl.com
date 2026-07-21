// context: 페이지 체류 동안 유지 / message: 잠깐 떴다 자동으로 접히는 알림

export type IslandIcon =
  | "clock"
  | "pen"
  | "sun"
  | "moon"
  | "link"
  | "check"
  | "globe"
  | "heart";

export interface IslandMessage {
  text: string;
  icon?: IslandIcon;
}

export interface IslandContext {
  readingMinutes?: number;
}

export interface IslandState {
  context: IslandContext;
  message: IslandMessage | null;
}

let state: IslandState = { context: {}, message: null };
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function emit(next: IslandState): void {
  state = next;
  listeners.forEach((listener) => {
    listener();
  });
}

export const islandStore = {
  get: (): IslandState => state,

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setContext(context: IslandContext): void {
    emit({ ...state, context });
  },

  clearContext(): void {
    emit({ ...state, context: {} });
  },

  notify(text: string, opts?: { icon?: IslandIcon; duration?: number }): void {
    if (timer) clearTimeout(timer);
    emit({ ...state, message: { text, icon: opts?.icon } });
    timer = setTimeout(
      () => emit({ ...state, message: null }),
      opts?.duration ?? 1500,
    );
  },

  dismiss(): void {
    if (timer) clearTimeout(timer);
    timer = null;
    if (state.message) emit({ ...state, message: null });
  },
};
