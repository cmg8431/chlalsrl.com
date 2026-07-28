import fs from "node:fs/promises";
import path from "node:path";

/**
 * 로고 마크 — 어두운 사각 위에 행성 하나.
 *
 * 원안(Frame 1.svg)은 516 캔버스에 모서리 반경 99, 그 안에 지름 353의 원을
 * 얹는다. 여기서는 그 비율만 옮기고 크기는 쓰는 자리가 정한다.
 *
 * 행성은 사진이라 코드로 못 그린다. 512 PNG를 그대로 안고 가면 아이콘 하나에
 * 450KB를 태우므로, 가장 큰 아이콘(512)에서 원이 차지하는 353px보다 조금 큰
 * 384로 줄이고 JPEG로 굽는다 — 원 밖은 어차피 잘려 나가 알파가 필요 없다.
 */
const RATIO = {
  /** 캔버스 대비 원 지름 */
  planet: 353 / 516,
  /** 캔버스 대비 원의 왼쪽·위 여백 */
  inset: 81 / 516,
  /** 캔버스 대비 모서리 반경 */
  radius: 99 / 516,
};

let cached: string | undefined;

/** 빌드 시 한 번 읽어 데이터 URI로 물고 있는다 */
export async function loadPlanet(): Promise<string> {
  if (cached) return cached;
  const file = await fs.readFile(
    path.join(process.cwd(), "src/app/_icon/mars.jpg"),
  );
  cached = `data:image/jpeg;base64,${file.toString("base64")}`;
  return cached;
}

export function LogoMark({
  size,
  planet,
  /** 모서리를 OS가 깎는 자리(maskable, iOS)에서는 0으로 눌러 꽉 채운다 */
  radius = size * RATIO.radius,
}: {
  size: number;
  planet: string;
  radius?: number;
}) {
  const disc = size * RATIO.planet;
  const inset = size * RATIO.inset;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "linear-gradient(180deg, #150500 0%, #000000 100%)",
        borderRadius: radius,
      }}
    >
      <img
        src={planet}
        width={disc}
        height={disc}
        alt=""
        style={{
          position: "absolute",
          left: inset,
          top: inset,
          borderRadius: disc,
        }}
      />
    </div>
  );
}
