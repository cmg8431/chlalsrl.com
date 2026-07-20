import fs from "fs/promises";
import path from "path";

import { ImageResponse } from "next/og";

export const contentType = "image/png";

const VARIANTS = [
  { id: "small", size: 64, fontSize: 34, radius: 14 },
  { id: "medium", size: 192, fontSize: 102, radius: 42 },
  // maskable — 세이프존 확보를 위해 글자를 작게, 모서리는 OS가 깎는다
  { id: "large", size: 512, fontSize: 246, radius: 0 },
];

export function generateImageMetadata() {
  return VARIANTS.map((variant) => ({
    id: variant.id,
    size: { width: variant.size, height: variant.size },
    contentType: "image/png",
  }));
}

/** 브라우저 탭·매니페스트 아이콘 — OG와 같은 웜 다크 + 테라코타 모노그램 */
export default async function Icon({ id }: { id: string }) {
  const variant = VARIANTS.find((v) => v.id === id) ?? VARIANTS[0]!;
  const font = await fs.readFile(
    path.join(
      process.cwd(),
      "node_modules/pretendard/dist/public/static/Pretendard-Bold.otf"
    )
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #1A1613 0%, #0E0C0A 100%)",
          borderRadius: variant.radius,
          color: "#E38B63",
          fontSize: variant.fontSize,
          fontWeight: 700,
          fontFamily: "Pretendard",
        }}
      >
        민
      </div>
    ),
    {
      width: variant.size,
      height: variant.size,
      fonts: [{ name: "Pretendard", data: font, weight: 700 }],
    }
  );
}
