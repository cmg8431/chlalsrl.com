import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS 홈 화면 아이콘 — 모서리는 iOS가 깎으므로 꽉 찬 사각으로 */
export default async function AppleIcon() {
  const font = await fs.readFile(
    path.join(
      process.cwd(),
      "node_modules/pretendard/dist/public/static/Pretendard-Bold.otf",
    ),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #1A1613 0%, #0E0C0A 100%)",
        color: "#E38B63",
        fontSize: 96,
        fontWeight: 700,
        fontFamily: "Pretendard",
      }}
    >
      민
    </div>,
    {
      ...size,
      fonts: [{ name: "Pretendard", data: font, weight: 700 }],
    },
  );
}
