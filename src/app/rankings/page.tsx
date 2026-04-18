import type { Metadata } from "next";
import RankingsView from "@/components/rankings/RankingsView";
import { getAllDivisionRankings } from "@/data/rankings";

/* ── SEO 메타데이터 ── */
export const metadata: Metadata = {
  title: "시즌 랭킹 — KLD",
  description:
    "KLD 2025 정규 시즌 디비전별(아마추어·마스터즈·우먼스·오픈) 랭킹. 순위, 변동, 최장 비거리, 포인트를 확인하세요.",
};

/**
 * 시즌 랭킹(Rankings) 페이지
 *
 * 구조:
 * - 서버 컴포넌트(Server Component)에서 4개 디비전 랭킹을 한 번에 fetch 한다.
 * - 전체 데이터를 `RankingsView`(클라이언트 컴포넌트)에 props로 전달한다.
 * - 탭 전환은 클라이언트 측에서만 일어나며 서버 왕복이 없다.
 *
 * 서버 컴포넌트로 만든 이유:
 * 1) 초기 렌더링 시 HTML에 랭킹 데이터가 포함되어 SEO/초기 표시가 유리하다.
 * 2) 추후 Supabase 연동 시 page.tsx 코드 수정 없이 fetcher만 교체하면 된다.
 */
export default async function RankingsPage() {
  const rankings = await getAllDivisionRankings();

  return (
    <main className="pt-nav">
      {/* ════════════════════
          페이지 헤더
      ════════════════════ */}
      <section
        className="
          px-5 md:px-8 lg:px-16
          pt-16 md:pt-20 lg:pt-24
          pb-10 md:pb-14
          border-b border-kld-red/[0.15]
          bg-dark
        "
        aria-label="페이지 소개"
      >
        <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-4">
          Season Standings
        </div>
        <h1
          className="
            font-display text-[clamp(40px,6vw,76px)]
            leading-[0.95] tracking-[0.02em]
            text-white-kld mb-5
          "
        >
          2025 시즌 랭킹
        </h1>
        <p className="max-w-[560px] text-[14px] font-light leading-[1.7] text-gray-light">
          4개 디비전(아마추어 · 마스터즈 · 우먼스 · 오픈)별 상위 10명 랭킹입니다.
          탭을 선택해 디비전을 전환하고, 순위 변동과 최장 비거리, 포인트를 확인하세요.
        </p>
      </section>

      {/* ════════════════════
          디비전 탭 + 랭킹 테이블
      ════════════════════ */}
      <section
        className="
          bg-dark
          px-5 md:px-8 lg:px-16
          py-14 md:py-20 lg:py-24
        "
        aria-label="디비전별 랭킹"
      >
        <RankingsView rankings={rankings} />
      </section>
    </main>
  );
}
