"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  PlayerCompetitionResult,
  PlayerEquipment,
} from "@/types";

/* ── Props 타입 ── */
interface ProfileTabsProps {
  equipment: PlayerEquipment[];
  results: PlayerCompetitionResult[];
}

/** 탭 식별자 — 순서가 곧 탭 표시 순서 */
type TabId = "records" | "equipment";

const TABS: { id: TabId; label: string }[] = [
  { id: "records", label: "대회 기록" },
  { id: "equipment", label: "장비" },
];

/**
 * 선수 프로필 하단 탭 컴포넌트
 * - "대회 기록" 탭: 선수의 대회 출전 내역을 최신순으로 테이블 형태로 표시
 * - "장비" 탭: 드라이버/샤프트/볼 등 장비 목록 표시
 *
 * 클라이언트 컴포넌트(Client Component)로 동작하며 탭 전환 상태만 관리한다.
 */
export default function ProfileTabs({
  equipment,
  results,
}: ProfileTabsProps) {
  const [active, setActive] = useState<TabId>("records");

  return (
    <div>
      {/* ── 탭 바 ── */}
      <div
        className="flex border-b border-kld-red/20 mb-8"
        role="tablist"
        aria-label="프로필 상세 탭"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tab-panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`
                font-ui text-[13px] font-semibold
                tracking-[0.18em] uppercase
                px-5 md:px-7 py-3.5
                border-b-2 -mb-px
                transition-colors
                ${isActive
                  ? "border-kld-red text-white-kld"
                  : "border-transparent text-gray-mid hover:text-white-kld"}
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── 탭 패널: 대회 기록 ── */}
      {active === "records" ? (
        <div
          id="tab-panel-records"
          role="tabpanel"
          aria-label="대회 기록"
        >
          {results.length === 0 ? (
            <p className="text-gray-mid text-sm font-light py-10 text-center">
              아직 대회 출전 기록이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full border-collapse"
                aria-label="대회 출전 기록"
              >
                <thead>
                  <tr className="border-b border-kld-red/25">
                    <th
                      scope="col"
                      className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-left px-3 py-3 font-normal whitespace-nowrap"
                    >
                      DATE
                    </th>
                    <th
                      scope="col"
                      className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-left px-3 py-3 font-normal"
                    >
                      대회
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-left px-3 py-3 font-normal whitespace-nowrap"
                    >
                      디비전
                    </th>
                    <th
                      scope="col"
                      className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-center px-3 py-3 font-normal whitespace-nowrap"
                    >
                      결과
                    </th>
                    <th
                      scope="col"
                      className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-right px-3 py-3 font-normal whitespace-nowrap"
                    >
                      기록
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr
                      key={result.competitionId}
                      className="border-b border-white/[0.04] hover:bg-kld-red/[0.04] transition-colors"
                    >
                      <td className="px-3 py-4 font-mono text-[12px] text-gray-light whitespace-nowrap">
                        {result.date}
                      </td>
                      <td className="px-3 py-4">
                        <Link
                          href={`/competitions#${result.competitionId}`}
                          className="text-sm text-white-kld hover:text-kld-red transition-colors"
                        >
                          {result.competitionTitle}
                        </Link>
                      </td>
                      <td className="hidden md:table-cell px-3 py-4 font-mono text-[11px] text-gray-light tracking-[0.1em]">
                        {result.division}
                      </td>
                      <td className="px-3 py-4 text-center">
                        <span
                          className={`
                            inline-flex items-center justify-center
                            min-w-[42px] px-2 py-1
                            font-display text-[14px] tracking-[0.04em]
                            ${result.placement === 1
                              ? "bg-kld-red/20 border border-kld-red text-kld-red"
                              : "border border-white/10 text-gray-light"}
                          `}
                        >
                          {result.placement}위
                        </span>
                      </td>
                      <td className="px-3 py-4 text-right">
                        <span className="font-display text-[18px] md:text-[20px] tracking-[0.04em] text-white-kld">
                          {result.distance}
                          <span className="font-mono text-[10px] text-gray-mid ml-0.5">
                            m
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {/* ── 탭 패널: 장비 ── */}
      {active === "equipment" ? (
        <div
          id="tab-panel-equipment"
          role="tabpanel"
          aria-label="장비 목록"
        >
          {equipment.length === 0 ? (
            <p className="text-gray-mid text-sm font-light py-10 text-center">
              등록된 장비 정보가 없습니다.
            </p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {equipment.map((item) => (
                <li
                  key={`${item.category}-${item.brand}-${item.model}`}
                  className="
                    flex flex-col gap-1.5
                    p-4 md:p-5
                    bg-dark-200 border border-kld-red/[0.15]
                  "
                >
                  <div className="font-mono text-[10px] tracking-[0.22em] text-kld-red uppercase">
                    {item.category}
                  </div>
                  <div className="font-ui text-sm font-semibold text-white-kld">
                    {item.brand}{" "}
                    <span className="font-normal text-gray-light">
                      {item.model}
                    </span>
                  </div>
                  {item.note ? (
                    <div className="font-mono text-[11px] text-gray-mid leading-[1.5]">
                      {item.note}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
