import fs from "fs/promises";
import path from "path";

import { ImageResponse } from "next/og";

import { findContentBySlug, readingMinutes } from "@/features/blog";

import type { LocaleType } from "@/shared";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ locale: LocaleType; slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { locale, slug } = await params;
  const content = findContentBySlug(slug, locale);

  const font = await fs.readFile(
    path.join(
      process.cwd(),
      "node_modules/pretendard/dist/public/static/Pretendard-Bold.otf"
    )
  );

  const title = content?.frontmatter.title ?? "chlalsrl.com";
  const minutes = content ? readingMinutes(content.content) : null;
  const category = content?.category ?? "blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#111110",
          color: "#eeeeec",
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#94928b" }}>
          {minutes ? `${category} · ${minutes} min` : category}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            wordBreak: "keep-all",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
          }}
        >
          <span style={{ color: "#eeeeec" }}>최민기 — Mingi Choe</span>
          <span style={{ color: "#6b6963" }}>chlalsrl.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Pretendard", data: font, weight: 700 }],
    }
  );
}
