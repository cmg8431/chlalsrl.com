import type { Resume } from "../libs";

/**
 * AI Native 블록.
 *
 * 탭으로 접어봤지만 이력서에서 접는 건 손해다 — 읽는 사람은 누르지 않는다.
 * 넷을 다 펼치고, 대신 문장을 줄여 한눈에 들어오게 한다.
 *
 * 상자로 두르지 않는다. 테두리를 치면 본문에서 떨어져 나온 광고처럼 보인다.
 * 파란 결은 위쪽 헤어라인과 라벨·세로줄에만 남겨 문서의 일부로 둔다.
 */
export function AiNative({ data }: { data: Resume["aiNative"] }) {
  return (
    <section className="ai-native" aria-label={data.title}>
      <div className="ai-native-head">
        <span className="ai-native-badge">{data.title}</span>
        <p className="ai-native-lead">{data.lead}</p>
      </div>

      <div className="ai-native-grid">
        {data.points.map((point) => (
          <div key={point.label} className="ai-native-point">
            <span className="ai-native-label">{point.label}</span>
            <h3 className="ai-native-title">{point.title}</h3>
            <p className="ai-native-body">{point.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
