"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import HeroSection from "@/components/sections/HeroSection";
import TickerSection from "@/components/sections/TickerSection";
import NextEventSection from "@/components/sections/NextEventSection";
import StatsSection from "@/components/sections/StatsSection";
import RankingsSection from "@/components/sections/RankingsSection";
import PlayersSection from "@/components/sections/PlayersSection";
import MediaSection from "@/components/sections/MediaSection";
import NoticeSection from "@/components/sections/NoticeSection";

/**
 * KLD 홈페이지
 * 모든 섹션 컴포넌트를 순서대로 조립한다.
 * 각 섹션은 독립적으로 동작하며, 이 파일에서는 배치만 담당한다.
 */
export default function HomePage() {
  /* 스크롤 시 .reveal 요소에 등장 애니메이션을 적용한다. */
  useScrollReveal();

  /* Nav와 Footer는 layout.tsx에서 공통으로 렌더링되므로 이 파일에서는 제외한다. */
  return (
    <main>
      {/* 히어로 — 풀스크린 메인 비주얼 */}
      <HeroSection />

      {/* 티커 — 대회 결과 무한 스크롤 */}
      <TickerSection />

      {/* 다음 대회 정보 */}
      <NextEventSection />

      {/* 시즌 통계 바 */}
      <StatsSection />

      {/* 시즌 랭킹 테이블 */}
      <RankingsSection />

      {/* 이달의 선수 카드 */}
      <PlayersSection />

      {/* 미디어 하이라이트 */}
      <MediaSection />

      {/* 공지사항 */}
      <NoticeSection />
    </main>
  );
}
