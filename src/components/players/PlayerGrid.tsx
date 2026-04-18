"use client";

import { useMemo, useState } from "react";
import PlayerCard from "@/components/players/PlayerCard";
import type { Division, PlayerProfile } from "@/types";

/* ── Props 타입 ── */
interface PlayerGridProps {
  /** 서버에서 미리 로딩해 전달받은 전체 선수 목록 */
  players: PlayerProfile[];
}

/** 필터 탭(Filter Tabs) — "전체" + 4개 디비전 */
type DivisionFilter = "전체" | Division;
const DIVISION_FILTERS: DivisionFilter[] = [
  "전체",
  "아마추어",
  "마스터즈",
  "우먼스",
  "오픈",
];

/**
 * 선수 목록 그리드(Client Component)
 *
 * 기능:
 * - 상단 검색 입력 — 선수 이름으로 실시간 필터링
 * - 디비전 탭 — 선택된 디비전으로 필터링
 * - 결과 그리드 — 데스크톱 4열 / 태블릿 3열 / 모바일 2열
 *
 * 서버/클라이언트 분리:
 * - 데이터는 서버 컴포넌트(app/players/page.tsx)에서 한 번에 fetch 되어
 *   props로 전달된다. 이 컴포넌트는 필터링/검색만 담당한다.
 */
export default function PlayerGrid({ players }: PlayerGridProps) {
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState<DivisionFilter>("전체");

  /* 검색어와 디비전 필터를 적용한 결과.
     입력이 바뀔 때만 재계산되도록 useMemo 로 감싼다. */
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return players.filter((player) => {
      const matchesDivision =
        division === "전체" || player.division === division;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        player.name.toLowerCase().includes(normalizedQuery) ||
        player.initials.toLowerCase().includes(normalizedQuery) ||
        player.region.toLowerCase().includes(normalizedQuery);
      return matchesDivision && matchesQuery;
    });
  }, [players, query, division]);

  return (
    <div>
      {/* ════════════════════
          검색 + 디비전 필터 바
      ════════════════════ */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 md:mb-10">
        {/* 검색 입력 */}
        <label className="relative w-full md:max-w-[360px]" aria-label="선수 이름 검색">
          <span
            className="
              absolute left-4 top-1/2 -translate-y-1/2
              font-mono text-[12px] text-gray-mid pointer-events-none
            "
            aria-hidden="true"
          >
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="선수 이름으로 검색"
            className="
              w-full pl-10 pr-4 py-3
              bg-dark-200 border border-kld-red/20
              text-sm text-white-kld placeholder:text-gray-mid
              focus:outline-none focus:border-kld-red
              transition-colors
            "
          />
        </label>

        {/* 디비전 필터 */}
        <div
          className="
            flex border border-kld-red/20
            overflow-x-auto scrollbar-none
          "
          role="tablist"
          aria-label="디비전 필터"
        >
          {DIVISION_FILTERS.map((tab) => {
            const isActive = tab === division;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setDivision(tab)}
                className={`
                  font-ui text-[11px] md:text-[12px]
                  font-semibold tracking-[0.14em] uppercase
                  px-3.5 md:px-4 py-2.5 whitespace-nowrap
                  border-r border-kld-red/20 last:border-r-0
                  transition-colors
                  ${isActive
                    ? "bg-kld-red text-white-kld"
                    : "text-gray-mid hover:text-white-kld"}
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ════════════════════
          결과 수 라벨 + 그리드
      ════════════════════ */}
      <div
        className="font-mono text-[10px] tracking-[0.24em] text-gray-mid uppercase mb-5"
        aria-live="polite"
      >
        {filtered.length === 0
          ? "No Results"
          : `Showing — ${String(filtered.length).padStart(2, "0")} Players`}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-mid text-sm font-light py-14 text-center border border-dashed border-kld-red/20">
          조건에 맞는 선수가 없습니다. 검색어나 디비전을 변경해보세요.
        </p>
      ) : (
        <div
          className="
            grid gap-4 md:gap-5
            grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          "
        >
          {filtered.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}
