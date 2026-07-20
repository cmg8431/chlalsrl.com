import { FloatingIsland } from "./floating-island";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 아일랜드는 클리핑 래퍼 밖에 — overflow 클리핑 조상은 backdrop-filter를 깨뜨린다 */}
      <FloatingIsland />
      <div className="flex min-h-dvh flex-col overflow-x-clip">
        <main className="mx-auto w-full max-w-xl flex-1 px-6 pt-20 pb-24">
          {children}
        </main>
      </div>
    </>
  );
}
