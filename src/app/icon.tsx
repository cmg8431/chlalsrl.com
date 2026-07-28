import { ImageResponse } from "next/og";

import { LogoMark, loadPlanet } from "./_icon/logo";

export const contentType = "image/png";

const VARIANTS = [
  { id: "small", size: 64 },
  { id: "medium", size: 192 },
  // maskable — 모서리는 OS가 깎는다. 행성은 세이프존 안쪽에 있다
  { id: "large", size: 512, radius: 0 },
];

export function generateImageMetadata() {
  return VARIANTS.map((variant) => ({
    id: variant.id,
    size: { width: variant.size, height: variant.size },
    contentType: "image/png",
  }));
}

/** 어두운 사각에 행성 하나 — 원안 SVG(Frame 1)의 비율을 그대로 옮겼다 */
export default async function Icon({ id }: { id: string | Promise<string> }) {
  const resolvedId = await id;
  const variant = VARIANTS.find((v) => v.id === resolvedId) ?? VARIANTS[0]!;
  const planet = await loadPlanet();

  return new ImageResponse(
    <LogoMark size={variant.size} radius={variant.radius} planet={planet} />,
    { width: variant.size, height: variant.size },
  );
}
