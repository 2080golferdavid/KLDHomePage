"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import HeroSection from "@/components/sections/HeroSection";
import NextEventSection from "@/components/sections/NextEventSection";
import StatsSection from "@/components/sections/StatsSection";
import RankingsSection from "@/components/sections/RankingsSection";
import PlayersSection from "@/components/sections/PlayersSection";
import MediaSection from "@/components/sections/MediaSection";
import NoticeSection from "@/components/sections/NoticeSection";
import SponsorsSection from "@/components/sections/SponsorsSection";

/**
 * KLD 홈페이지
 * 레퍼런스(reference/designreference0419) 구성 — Hero → NextEvent → Stats →
 * Rankings → Players → Media → Notices → Sponsors 순서로 조립한다.
 * Ticker·Nav·Footer 는 layout.tsx 에서 공통으로 렌더링되므로 여기서는 제외.
 */
export default function HomePage() {
  /* 스크롤 시 .reveal 요소에 등장 애니메이션을 적용한다. */
  useScrollReveal();

  /* 티커가 28px, Nav 가 72px 로 고정 — 히어로 배경이 상단까지 채워지도록
     main 자체에는 패딩을 주지 않는다. hero 섹션이 자체 160px 상단 패딩으로 보정. */
  return (
    <main>
      <HeroSection />
      <NextEventSection />
      <StatsSection />
      <RankingsSection />
      <PlayersSection />
      <MediaSection />
      <NoticeSection />
      <SponsorsSection />
    </main>
  );
}
