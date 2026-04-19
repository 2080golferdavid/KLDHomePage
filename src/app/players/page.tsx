import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PlayerGrid from "@/components/players/PlayerGrid";
import { getAllPlayers } from "@/data/players";

export const metadata: Metadata = {
  title: "ATHLETES — KLD 선수 목록",
  description:
    "KLD 2025 시즌에 등록된 선수들을 한눈에. 이름 검색과 디비전 필터로 원하는 선수를 빠르게 찾아보세요.",
};

/**
 * 선수(Players) 목록 페이지
 * - 서버 컴포넌트에서 전체 선수 목록을 fetch.
 * - 검색/필터/그리드 렌더링은 PlayerGrid(클라이언트) 가 담당.
 */
export default async function PlayersPage() {
  const players = await getAllPlayers();

  return (
    <main>
      <PageHero
        secNum="P · 06"
        eyebrow="ATHLETES · 선수 목록"
        titleEn="HITTERS"
        titleKr="KLD 2025 등록 선수"
        lead={
          <>
            KLD 2025 시즌에 등록된 선수들입니다. 이름으로 검색하거나 디비전으로
            필터링해 각 선수의 상세 프로필을 확인할 수 있습니다.
            <span className="kr">
              Search by name or filter by division to open a player profile.
            </span>
          </>
        }
      />

      <section className="sec reveal" aria-label="선수 목록">
        <div className="wrap">
          <PlayerGrid players={players} />
        </div>
      </section>
    </main>
  );
}
