import { ImageResponse } from "next/og";

import { LogoMark, loadPlanet } from "./_icon/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS 홈 화면 아이콘 — 모서리는 iOS가 깎으므로 꽉 찬 사각 */
export default async function AppleIcon() {
  const planet = await loadPlanet();

  return new ImageResponse(
    <LogoMark size={size.width} radius={0} planet={planet} />,
    size,
  );
}
