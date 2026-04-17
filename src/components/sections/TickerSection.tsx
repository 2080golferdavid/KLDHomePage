import { TICKER_ITEMS } from "@/constants/siteData";

/**
 * 티커(Ticker) 섹션 — 대회 결과를 무한 스크롤로 표시한다.
 * CSS animation으로 두 개의 동일 텍스트 블록을 이어 붙여 끊김 없는 루프를 만든다.
 */
export default function TickerSection() {
  /* 티커 내용을 JSX로 변환하는 헬퍼 */
  const renderTickerContent = () => (
    <div className="font-display text-[clamp(12px,1.4vw,14px)] tracking-[0.18em] text-white-kld px-10 flex items-center gap-10">
      {TICKER_ITEMS.map((item, idx) => (
        <span key={idx} className="flex items-center gap-10">
          <span>{item.text}</span>
          <span className="w-1 h-1 bg-white/40 rounded-full shrink-0" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-kld-red py-2.5 overflow-hidden whitespace-nowrap" aria-label="최근 대회 결과" role="marquee">
      <div className="inline-flex animate-ticker">
        {/* 동일한 콘텐츠를 2번 렌더링하여 끊김 없는 무한 스크롤 구현 */}
        {renderTickerContent()}
        <div aria-hidden="true">
          {renderTickerContent()}
        </div>
      </div>
    </div>
  );
}
