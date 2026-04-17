"use client";

import { useState } from "react";
import Link from "next/link";
import { RANKINGS_AMATEUR } from "@/constants/siteData";
import type { Division, RankingPlayer } from "@/types";

/** 사용 가능한 디비전 탭 목록 */
const DIVISION_TABS: Division[] = ["아마추어", "마스터즈", "우먼스", "오픈"];

/**
 * 시즌 랭킹 섹션
 * 디비전 탭 전환과 상위 5명의 랭킹 테이블을 표시한다.
 * 현재는 아마추어 디비전 목 데이터만 사용한다.
 */
export default function RankingsSection() {
  const [activeDivision, setActiveDivision] = useState<Division>("아마추어");

  /* TODO: API 연동 시 디비전별 데이터를 가져오도록 변경 */
  const players: RankingPlayer[] = RANKINGS_AMATEUR;

  /** 순위 변동 표시 헬퍼 */
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
    <section className="bg-dark py-14 md:py-[72px] lg:py-24 px-5 md:px-8 lg:px-16 reveal" aria-label="시즌 랭킹">
      {/* ── 헤더: 제목 + 탭 ── */}
      <div className="flex flex-wrap items-end justify-between gap-5 mb-9">
        <div>
          <div className="font-mono text-[10px] tracking-[0.28em] text-kld-red uppercase flex items-center gap-3 mb-3.5">
            <span className="w-[22px] h-px bg-kld-red shrink-0" aria-hidden="true" />
            Season Standings
          </div>
          <div className="font-display text-[clamp(40px,5vw,70px)] tracking-[0.04em] leading-[0.92] text-white-kld">
            2025
            <br />
            시즌 랭킹
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          {/* 디비전 탭 */}
          <div className="flex border border-kld-red/20 overflow-x-auto scrollbar-none" role="tablist" aria-label="디비전 선택">
            {DIVISION_TABS.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={tab === activeDivision}
                onClick={() => setActiveDivision(tab)}
                className={`
                  font-ui text-[12px] font-semibold tracking-[0.14em] uppercase
                  px-5 py-2.5 whitespace-nowrap
                  border-r border-kld-red/20 last:border-r-0
                  transition-all
                  ${tab === activeDivision
                    ? "bg-kld-red text-white-kld"
                    : "text-gray-mid hover:text-white-kld"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
          <Link
            href="/rankings"
            className="
              font-ui text-[12px] font-semibold tracking-[0.2em] uppercase text-kld-red
              inline-flex items-center gap-2
              border border-kld-red/30 px-5 py-2.5
              hover:bg-kld-red/10 hover:border-kld-red transition-all
              whitespace-nowrap
            "
          >
            전체 랭킹 보기
          </Link>
        </div>
      </div>

      {/* ── 랭킹 테이블 ── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" aria-label={`${activeDivision} 디비전 랭킹`}>
          <thead>
            <tr className="border-b border-kld-red/25">
              <th className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-left px-4 py-3 font-normal whitespace-nowrap">
                RANK
              </th>
              <th className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-left px-4 py-3 font-normal" aria-label="변동" />
              <th className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-left px-4 py-3 font-normal whitespace-nowrap">
                PLAYER
              </th>
              <th className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-left px-4 py-3 font-normal whitespace-nowrap">
                최장 비거리
              </th>
              <th className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-left px-4 py-3 font-normal whitespace-nowrap hidden md:table-cell">
                대회 참가
              </th>
              <th className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-left px-4 py-3 font-normal whitespace-nowrap">
                포인트
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.rank}
                className="border-b border-white/[0.04] hover:bg-kld-red/[0.04] transition-colors"
              >
                {/* 순위 */}
                <td className="px-4 py-4">
                  <div className={`font-display text-2xl ${player.rank === 1 ? "text-kld-red" : "text-gray-kld"}`}>
                    {String(player.rank).padStart(2, "0")}
                  </div>
                </td>
                {/* 변동 */}
                <td className="px-4 py-4">
                  <div className="font-mono text-[11px] w-9">
                    {renderChange(player)}
                  </div>
                </td>
                {/* 선수 */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        w-[36px] h-[36px] md:w-[42px] md:h-[42px]
                        bg-dark-300 border border-kld-red/20
                        flex items-center justify-center
                        font-display text-[13px] md:text-base text-kld-red shrink-0
                      "
                    >
                      {player.initials}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white-kld block">
                        {player.name}
                      </span>
                      <span className="font-mono text-[9px] text-gray-mid tracking-[0.1em]">
                        {player.region} · {player.division}
                      </span>
                    </div>
                  </div>
                </td>
                {/* 최장 비거리 */}
                <td className="px-4 py-4">
                  <span className="font-display text-xl md:text-2xl tracking-[0.04em] text-white-kld">
                    {player.maxDistance}
                    <span className="font-mono text-[10px] text-gray-mid font-normal">m</span>
                  </span>
                </td>
                {/* 대회 참가 (모바일 숨김) */}
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="font-mono text-[13px] text-gray-light">
                    {player.participation}
                  </span>
                </td>
                {/* 포인트 */}
                <td className="px-4 py-4">
                  <span className="font-mono text-[13px] text-gray-light">
                    <strong className="text-white-kld text-[15px] block">{player.points}</strong>
                    pts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
