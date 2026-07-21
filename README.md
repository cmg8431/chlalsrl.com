# chlalsrl.com

**English** | [한국어](./README.ko.md) | [日本語](./README.ja.md)

Personal blog. [chlalsrl.com](https://www.chlalsrl.com)

![demo](./.github/demo.gif)

## Features

- All pages statically generated, MDX content in Korean / English / Japanese
- View Transitions based navigation (title morphing, swipe with edge preview)
- Comments and likes on Supabase, no login required
- Command menu with full-text search (⌘K)
- OG images generated in code
- RSS, sitemap, JSON-LD, hreflang

## Stack

Next.js 16 · React 19.2 · TypeScript · Tailwind CSS v4 · Supabase · Bun · Biome

## Development

```sh
bun install
bun run dev
```

## Use as your own

MIT licensed, except for the posts under `src/contents`.

1. Replace posts in `src/contents/{category}/{slug}/{locale}.md`
2. Update name, links and domain in `src/app/[locale]/layout.tsx` and `src/app/[locale]/page.tsx`
3. Set your Supabase project in `next.config.ts` (or remove comments/likes)
4. Swap the GA id in `src/app/[locale]/layout.tsx`
