"use client";

export default function GlobalError() {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "'Pretendard Variable', -apple-system, system-ui, sans-serif",
          background: "#fcfcfb",
          color: "#37352f",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 48, fontWeight: 700, margin: 0 }}>500</p>
          <p style={{ marginTop: 12, color: "#73726e" }}>
            문제가 생겼어요. 잠시 후 다시 시도해주세요.
          </p>
          <button
            type="button"
            onClick={() => window.location.assign("/")}
            style={{
              marginTop: 20,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#191919",
              font: "inherit",
            }}
          >
            홈으로 →
          </button>
        </div>
      </body>
    </html>
  );
}
