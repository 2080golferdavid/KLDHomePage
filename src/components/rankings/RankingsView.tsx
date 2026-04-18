"use client";

import { useState } from "react";
import type { Division, RankingPlayer } from "@/types";

/* ── Props 타입 (컴포넌트 바로 위에 배치) ── */
interface RankingsViewProps {
  /** 4개 디비전의 랭킹 데이터를 미리 로딩해서 전달받는다. */
  rankings: Record<Division, RankingPlayer[]>;
}

/** 탭 순서(Division Tabs) — 화면에 표시할 순서 */
const DIVISION_TABS: Division[] = ["아마추어", "마스터즈", "우먼스", "오픈"];

/**
 * 랭킹 뷰(Rankings View) — 클라이언트 컴포넌트
 *
 * 동작:
 * - 디비전 탭 버튼을 눌러 현재 디비전을 전환한다.
 * - 탭 전환 시 서버에 추가 요청하지 않고, props로 받은 전체 데이터에서
 *   현재 탭에 해당하는 배열만 렌더링한다.
 *
 * 반응형:
 * - 모바일(<768px): 순위, 선수명, 포인트 3개 컬럼만 표시한다.
 * - 데스크톱(>=768px): 변동(change), 최장 비거리, 대회 참가까지 모두 표시한다.
 */
export default function RankingsView({ rankings }: RankingsViewProps) {
  const [activeDivision, setActiveDivision] = useState<Division>("아마추어");
  const players = rankings[activeDivision];

  /**
   * 순위 변동(Change) 표시 헬퍼
   * 상승(up) → 초록, 하락(down) → 빨강, 동일(same) → 회색 대시
   */
  function renderChange(player: RankingPlayer) {
    if (player.change === "same") {
      return <span className="text-gray-kld">─</span>;
    }
    if (player.change === "up") {
      return <span className="text-[#5FD17A]">↑{player.changeAmount}</span>;
    }
    return <span className="text-[#FF6060]">↓{player.changeAmount}</span>;
  }

  return (
    <div>
      {/* ════════════════════
          디비전 탭 바
      ════════════════════ */}
      <div
        className="
          flex border border-kld-red/20
          overflow-x-auto scrollbar-none
          mb-8 md:mb-10
        "
        role="tablist"
        aria-label="디비전 선택"
      >
        {DIVISION_TABS.map((tab) => {
          const isActive = tab === activeDivision;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveDivision(tab)}
              className={`
                flex-1 md:flex-none
                font-ui text-[12px] md:text-[13px]
                font-semibold tracking-[0.14em] uppercase
                px-4 md:px-7 py-3 md:py-3.5
                whitespace-nowrap
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

      {/* ════════════════════
          랭킹 테이블
          overflow-x-auto 로 감싸 모바일에서 가로 스크롤 가능하게 함.
      ════════════════════ */}
      <div role="region" aria-live="polite" className="overflow-x-auto scrollbar-none">
        <table
          className="w-full border-collapse"
          aria-label={`${activeDivision} 디비전 시즌 랭킹`}
        >
          <thead>
            <tr className="border-b border-kld-red/25">
              {/* 순위 — 모바일/데스크톱 공통 */}
              <th
                scope="col"
                className="
                  font-mono text-[10px] tracking-[0.2em]
                  text-gray-mid uppercase
                  text-left px-3 md:px-4 py-3
                  font-normal whitespace-nowrap
                "
              >
                RANK
              </th>

              {/* 변동 — 데스크톱 전용 */}
              <th
                scope="col"
                className="
                  hidden md:table-cell
                  font-mono text-[10px] tracking-[0.2em]
                  text-gray-mid uppercase
                  text-left px-4 py-3
                  font-normal
                "
                aria-label="변동"
              />

              {/* 선수 — 모바일/데스크톱 공통 */}
              <th
                scope="col"
                className="
                  font-mono text-[10px] tracking-[0.2em]
                  text-gray-mid uppercase
                  text-left px-3 md:px-4 py-3
                  font-normal whitespace-nowrap
                "
              >
                PLAYER
              </th>

              {/* 최장 비거리 — 데스크톱 전용 */}
              <th
                scope="col"
                className="
                  hidden md:table-cell
                  font-mono text-[10px] tracking-[0.2em]
                  text-gray-mid uppercase
                  text-left px-4 py-3
                  font-normal whitespace-nowrap
                "
              >
                최장 비거리
              </th>

              {/* 대회 참가 — 데스크톱 전용 */}
              <th
                scope="col"
                className="
                  hidden md:table-cell
                  font-mono text-[10px] tracking-[0.2em]
                  text-gray-mid uppercase
                  text-left px-4 py-3
                  font-normal whitespace-nowrap
                "
              >
                대회 참가
              </th>

              {/* 포인트 — 모바일/데스크톱 공통 */}
              <th
                scope="col"
                className="
                  font-mono text-[10px] tracking-[0.2em]
                  text-gray-mid uppercase
                  text-right md:text-left
                  px-3 md:px-4 py-3
                  font-normal whitespace-nowrap
                "
              >
                POINTS
              </th>
            </tr>
          </thead>

          <tbody>
            {players.map((player) => (
              <tr
                key={`${activeDivision}-${player.rank}`}
                className="
                  border-b border-white/[0.04]
                  hover:bg-kld-red/[0.04] transition-colors
                "
              >
                {/* 순위 */}
                <td className="px-3 md:px-4 py-4">
                  <div
                    className={`
                      font-display text-xl md:text-2xl tracking-[0.04em]
                      ${player.rank === 1 ? "text-kld-red" : "text-gray-kld"}
                    `}
                  >
                    {String(player.rank).padStart(2, "0")}
                  </div>
                </td>

                {/* 변동 — 데스크톱 전용 */}
                <td className="hidden md:table-cell px-4 py-4">
                  <div className="font-mono text-[11px] w-9">
                    {renderChange(player)}
                  </div>
                </td>

                {/* 선수 (이니셜 배지 + 이름 + 지역·디비전) */}
                <td className="px-3 md:px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        w-[36px] h-[36px] md:w-[42px] md:h-[42px]
                        bg-dark-300 border border-kld-red/20
                        flex items-center justify-center
                        font-display text-[13px] md:text-base text-kld-red
                        shrink-0
                      "
                      aria-hidden="true"
                    >
                      {player.initials}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-white-kld block truncate">
                        {player.name}
                      </span>
                      <span className="font-mono text-[9px] text-gray-mid tracking-[0.1em] hidden md:block">
                        {player.region} · {player.division}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 최장 비거리 — 데스크톱 전용 */}
                <td className="hidden md:table-cell px-4 py-4">
                  <span className="font-display text-xl md:text-2xl tracking-[0.04em] text-white-kld">
                    {player.maxDistance}
                    <span className="font-mono text-[10px] text-gray-mid font-normal">
                      m
                    </span>
                  </span>
                </td>

                {/* 대회 참가 — 데스크톱 전용 */}
                <td className="hidden md:table-cell px-4 py-4">
                  <span className="font-mono text-[13px] text-gray-light">
                    {player.participation}
                  </span>
                </td>

                {/* 포인트 */}
                <td className="px-3 md:px-4 py-4 text-right md:text-left">
                  <span className="font-mono text-[13px] text-gray-light">
                    <strong className="text-white-kld text-[15px] block">
                      {player.points}
                    </strong>
                    pts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
