import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supabase 퍼블리셔블 키 — 브라우저에 노출되는 공개 키(RLS가 보안 담당)라 커밋 안전.
  // 환경변수로 넘기면 그 값이 우선한다.
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      "https://digrbgcyqkfaosnvfenv.supabase.co",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      "sb_publishable_rWgk7gzdoTpHO5-9csK3WA_rvjuPpHU",
  },
  // OG 이미지 라우트가 fs로 읽는 폰트를 서버 번들에 포함시킨다 (Vercel 트레이싱)
  outputFileTracingIncludes: {
    "/[locale]/opengraph-image": [
      "./node_modules/pretendard/dist/public/static/Pretendard-Regular.otf",
      "./node_modules/pretendard/dist/public/static/Pretendard-SemiBold.otf",
      "./node_modules/pretendard/dist/public/static/Pretendard-ExtraBold.otf",
      "./src/app/_og/fonts/InstrumentSerif-Regular.ttf",
    ],
    "/[locale]/blog/opengraph-image": [
      "./node_modules/pretendard/dist/public/static/Pretendard-Regular.otf",
      "./node_modules/pretendard/dist/public/static/Pretendard-SemiBold.otf",
      "./node_modules/pretendard/dist/public/static/Pretendard-ExtraBold.otf",
      "./src/app/_og/fonts/InstrumentSerif-Regular.ttf",
    ],
    "/[locale]/blog/tag/[tag]/opengraph-image": [
      "./node_modules/pretendard/dist/public/static/Pretendard-Regular.otf",
      "./node_modules/pretendard/dist/public/static/Pretendard-SemiBold.otf",
      "./node_modules/pretendard/dist/public/static/Pretendard-ExtraBold.otf",
      "./src/app/_og/fonts/InstrumentSerif-Regular.ttf",
    ],
    "/[locale]/blog/[slug]/opengraph-image": [
      "./node_modules/pretendard/dist/public/static/Pretendard-Regular.otf",
      "./node_modules/pretendard/dist/public/static/Pretendard-SemiBold.otf",
      "./node_modules/pretendard/dist/public/static/Pretendard-ExtraBold.otf",
      "./src/app/_og/fonts/InstrumentSerif-Regular.ttf",
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  // 구 URL(/contents/카테고리/슬러그) → 신 URL(/blog/슬러그)
  async redirects() {
    return [
      {
        source: "/:locale/contents/:category/:slug",
        destination: "/:locale/blog/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
