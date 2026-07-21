import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS 홈 화면 아이콘 — 모서리는 iOS가 깎으므로 꽉 찬 사각. 아이콘과 같은 두 눈 디자인 */
export default function AppleIcon() {
  const s = size.width;
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
    size,
  );
}
