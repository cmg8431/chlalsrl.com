import { ImageResponse } from "next/og";

export const contentType = "image/png";

const VARIANTS = [
  { id: "small", size: 64, radius: 14 },
  { id: "medium", size: 192, radius: 42 },
  // maskable — 모서리는 OS가 깎는다. 눈은 세이프존 안쪽에 있다
  { id: "large", size: 512, radius: 0 },
];

export function generateImageMetadata() {
  return VARIANTS.map((variant) => ({
    id: variant.id,
    size: { width: variant.size, height: variant.size },
    contentType: "image/png",
  }));
}

/** 다크 잉크 배경에 은은히 빛나는 두 눈 — 원안 SVG(Frame 1)의 비율을 그대로 옮겼다 */
export default async function Icon({ id }: { id: string | Promise<string> }) {
  const resolvedId = await id;
  const variant = VARIANTS.find((v) => v.id === resolvedId) ?? VARIANTS[0]!;
  const s = variant.size;

  // 원안 669px 캔버스 기준 비율
  const eye = s * 0.242;
  const pupil = eye * 0.477;
  const eyeTop = s * 0.339;
  const eyeLefts = [s * 0.227, s * 0.53];
  const pupilOffset = eye * 0.403;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "linear-gradient(180deg, #000000 0%, #1B1919 100%)",
        borderRadius: variant.radius,
      }}
    >
      {eyeLefts.map((left) => (
        <div
          key={left}
          style={{
            position: "absolute",
            display: "flex",
            left,
            top: eyeTop,
            width: eye,
            height: eye,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.8) 55%, rgba(223,223,223,0.76) 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: pupilOffset,
              top: pupilOffset,
              width: pupil,
              height: pupil,
              borderRadius: "50%",
              background: "linear-gradient(45deg, #000000 0%, #404040 100%)",
            }}
          />
        </div>
      ))}
    </div>,
    { width: s, height: s },
  );
}
