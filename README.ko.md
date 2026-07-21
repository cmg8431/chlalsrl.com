# chlalsrl.com

[English](./README.md) | **한국어** | [日本語](./README.ja.md)

개인 블로그. [chlalsrl.com](https://www.chlalsrl.com)

![demo](./.github/demo.gif)

## 기능

- 전 페이지 정적 생성, 한국어 / 영어 / 일본어 MDX 콘텐츠
- View Transitions 기반 내비게이션 (제목 모핑, 가장자리 프리뷰 스와이프)
- Supabase 댓글·좋아요, 로그인 불필요
- 본문 전체 검색 커맨드 메뉴 (⌘K)
- 코드로 생성하는 OG 이미지
- RSS, 사이트맵, JSON-LD, hreflang

## 스택

Next.js 16 · React 19.2 · TypeScript · Tailwind CSS v4 · Supabase · Bun · Biome

## 개발

```sh
bun install
bun run dev
```

## 내 블로그로 쓰기

MIT 라이선스예요. 단, `src/contents`의 글은 제외예요.

1. `src/contents/{카테고리}/{슬러그}/{로케일}.md`의 글을 교체
2. `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`의 이름·링크·도메인 수정
3. `next.config.ts`에 본인 Supabase 프로젝트 설정 (또는 댓글·좋아요 제거)
4. `src/app/[locale]/layout.tsx`의 GA id 교체
