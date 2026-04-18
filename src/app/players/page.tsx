import type { Metadata } from "next";
import PlayerGrid from "@/components/players/PlayerGrid";
import { getAllPlayers } from "@/data/players";

/* ── SEO 메타데이터 ── */
export const metadata: Metadata = {
  title: "선수 목록 — KLD",
  description:
    "KLD 2025 시즌에 등록된 선수들을 한눈에. 이름 검색과 디비전 필터로 원하는 선수를 빠르게 찾아보세요.",
};

/**
 * 선수(Players) 목록 페이지
 *
 * 구조:
 * - 서버 컴포넌트(Server Component)에서 전체 선수 목록을 한 번에 fetch 한다.
 * - 검색/필터 UI 와 그리드 렌더링은 `PlayerGrid`(클라이언트 컴포넌트)에 위임한다.
 *
 * 이 구조의 장점:
 * 1) 초기 HTML 에 선수 데이터가 포함되어 SEO/초기 표시가 유리하다.
 * 2) 필터링은 클라이언트 메모리에서 즉시 처리되어 반응성이 좋다.
 * 3) Supabase 교체 시 page.tsx 는 수정 불필요, fetcher 내부만 교체하면 된다.
 */
export default async function PlayersPage() {
  const players = await getAllPlayers();

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
          KLD Players
        </div>
        <h1
          className="
            font-display text-[clamp(40px,6vw,76px)]
            leading-[0.95] tracking-[0.02em]
            text-white-kld mb-5
          "
        >
          선수 목록
        </h1>
        <p className="max-w-[560px] text-[14px] font-light leading-[1.7] text-gray-light">
          KLD 2025 시즌에 등록된 선수들입니다. 이름으로 검색하거나 디비전으로 필터링해
          각 선수의 상세 프로필을 확인할 수 있습니다.
        </p>
      </section>

      {/* ════════════════════
          검색 + 필터 + 그리드
      ════════════════════ */}
      <section
        className="
          bg-dark
          px-5 md:px-8 lg:px-16
          py-14 md:py-20 lg:py-24
        "
        aria-label="선수 목록"
      >
        <PlayerGrid players={players} />
      </section>
    </main>
  );
}
