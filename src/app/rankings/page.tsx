import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import RankingsView from "@/components/rankings/RankingsView";
import { getAllDivisionRankings } from "@/data/rankings";

export const metadata: Metadata = {
  title: "STANDINGS — KLD 2025 시즌 랭킹",
  description:
    "KLD 2025 정규 시즌 디비전별(아마추어·마스터즈·우먼스·오픈) 랭킹. 순위, 변동, 최장 비거리, 포인트를 확인하세요.",
};

/**
 * 시즌 랭킹(Rankings) 페이지
 * - 서버 컴포넌트에서 4개 디비전 랭킹을 한 번에 fetch.
 * - 탭 전환은 RankingsView(클라이언트)에서 처리.
 */
export default async function RankingsPage() {
  const rankings = await getAllDivisionRankings();

  return (
    <main>
      <PageHero
        secNum="P · 05"
        eyebrow="SEASON STANDINGS · 시즌 랭킹"
        titleEn="2025 STANDINGS"
        titleKr="시즌 전체 랭킹"
        lead={
          <>
            4개 디비전(아마추어 · 마스터즈 · 우먼스 · 오픈)별 상위 랭킹입니다.
            탭을 눌러 디비전을 전환하고 순위 변동과 최장 비거리, 포인트를 확인하세요.
            <span className="kr">
              Tap a division to switch. Rank change and carry metrics update
              every round.
            </span>
          </>
        }
      />

      <section className="sec reveal" aria-label="디비전별 랭킹">
        <div className="wrap">
          <RankingsView rankings={rankings} />
        </div>
      </section>
    </main>
  );
}
