"use client";

import { BI_TICKER } from "@/constants/homeData";

/**
 * 상단 고정 티커 — 라이브 스코어/속보를 좌→우 무한 스크롤로 노출.
 * CSS keyframe `ticker-scroll` 이 같은 리스트를 두 번 렌더링해 이음매 없이 돈다.
 */
export default function Ticker() {
  /* 원본 + 복제본을 함께 깔아 루프 이음매를 감춘다. */
  const items = [...BI_TICKER, ...BI_TICKER];

  return (
    <div className="ticker" aria-label="라이브 티커 · Live event ticker">
      <div className="ticker-track">
        {items.map((item, i) => (
          <span
            key={i}
            className={`ticker-item ${item.live ? "live" : ""}`}
          >
            {item.live ? <span className="ticker-dot" aria-hidden="true" /> : null}
            <span>{item.text}</span>
            <span className="ticker-sep" aria-hidden="true">
              /
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
