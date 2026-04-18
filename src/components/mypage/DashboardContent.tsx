"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUpcomingCompetitions } from "@/data/competitions";
import type { MemberTier } from "@/hooks/useCurrentUser";
import type { Competition, PlayerProfile } from "@/types";

/* ── Props ── */
interface DashboardContentProps {
  /** 표시용 이름 */
  name: string;
  memberType: MemberTier;
  /** 현재 사용자의 선수 프로필. null 이면 기록/랭킹 자리에 "—" 표기. */
  profile: PlayerProfile | null;
}

/**
 * 마이페이지 대시보드 본문
 *
 * 구성:
 *  - 환영 메시지
 *  - 빠른 상태 카드 4개(현재 랭킹 / 최장 비거리 / 올해 출전 수 / 다음 대회 D-Day)
 *  - 최근 대회 결과 3건
 *  - 정회원 유도 배너(일반회원에게만)
 */
export default function DashboardContent({
  name,
  memberType,
  profile,
}: DashboardContentProps) {
  const [nextEvent, setNextEvent] = useState<Competition | null>(null);

  /* 다음 예정 대회 — D-Day 계산용. 없으면 null 로 둔다. */
  useEffect(() => {
    let cancelled = false;
    getUpcomingCompetitions().then((list) => {
      if (cancelled) return;
      setNextEvent(list[0] ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const dday = computeDDay(nextEvent?.dateISO);
  const thisYearEntries = countThisYearEntries(profile);
  const recentResults = profile?.results.slice(0, 3) ?? [];

  return (
    <div className="flex flex-col gap-7">
      {/* ── 환영 메시지 ── */}
      <header>
        <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-2">
          My Dashboard
        </div>
        <h1 className="font-display text-[clamp(28px,3.5vw,44px)] leading-[1.05] tracking-[0.02em] text-white-kld">
          {name}님, 안녕하세요
        </h1>
        <p className="mt-3 text-[13px] font-light text-gray-light leading-[1.7]">
          오늘도 KLD 에서 좋은 기록 남기시길 바랍니다.
        </p>
      </header>

      {/* ── 빠른 상태 카드 4개 ── */}
      <section aria-label="빠른 상태">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            label="현재 랭킹"
            value={profile ? `#${profile.seasonStats.rank}` : "—"}
            unit={profile ? profile.division : undefined}
          />
          <StatCard
            label="최장 비거리"
            value={profile ? `${profile.seasonStats.maxDistance}` : "—"}
            unit={profile ? "m" : undefined}
          />
          <StatCard
            label="올해 출전 대회"
            value={`${thisYearEntries}`}
            unit="회"
          />
          <StatCard
            label="다음 대회"
            value={dday.value}
            unit={dday.unit}
            sub={nextEvent?.title}
          />
        </div>
      </section>

      {/* ── 최근 대회 결과 ── */}
      <section aria-label="최근 대회 결과">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-display text-[22px] md:text-[26px] tracking-[0.03em] text-white-kld">
            최근 대회 결과
          </h2>
          <Link
            href="/mypage/records"
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-mid hover:text-kld-red transition-colors"
          >
            전체 보기 →
          </Link>
        </div>

        {recentResults.length === 0 ? (
          <div className="p-5 bg-white-kld border border-black/[0.08] text-center text-[13px] text-[#666]">
            아직 참가한 대회 기록이 없습니다.
          </div>
        ) : (
          <ul className="bg-white-kld border border-black/[0.08] divide-y divide-black/[0.06]">
            {recentResults.map((r) => (
              <li
                key={r.competitionId}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 md:gap-5 px-4 py-3.5"
              >
                <div className="min-w-0">
                  <div className="font-ui text-sm font-semibold text-[#080808] truncate">
                    {r.competitionTitle}
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.08em] text-[#666] mt-0.5">
                    {r.date} · {r.division}
                  </div>
                </div>
                <div
                  className={`
                    inline-flex items-center justify-center
                    min-w-[40px] px-2 py-1
                    font-display text-[13px] tracking-[0.04em]
                    ${r.placement === 1
                      ? "bg-kld-red/15 border border-kld-red text-kld-red"
                      : "border border-black/10 text-[#444]"}
                  `}
                >
                  {r.placement}위
                </div>
                <div className="text-right">
                  <span className="font-display text-[18px] tracking-[0.04em] text-[#080808]">
                    {r.distance}
                    <span className="font-mono text-[10px] text-[#666] ml-0.5">
                      m
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── 정회원 유도 배너 (일반회원에게만) ── */}
      {memberType === "general" ? (
        <section
          aria-label="정회원 전환 안내"
          className="
            relative overflow-hidden
            p-6 md:p-7
            bg-kld-red/10 border border-kld-red/40
          "
        >
          <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-2">
            Upgrade · Full Member
          </div>
          <h3 className="font-display text-[22px] md:text-[28px] tracking-[0.02em] text-white-kld mb-2">
            정회원으로 업그레이드하고 대회에 출전하세요
          </h3>
          <p className="text-[13px] font-light leading-[1.7] text-gray-light mb-5 max-w-[560px]">
            정회원이 되면 KLD 공식 대회 참가 신청, 시즌 포인트 집계,
            공식 선수 프로필 공개 등 모든 기능을 이용할 수 있습니다.
          </p>
          <Link
            href="/auth/register"
            className="
              inline-flex items-center justify-center
              font-ui text-[12px] font-bold tracking-[0.22em] uppercase text-white-kld
              bg-kld-red px-5 py-3
              hover:bg-kld-red-light transition-colors
            "
          >
            정회원 전환하기 →
          </Link>
        </section>
      ) : null}
    </div>
  );
}

/* ══════════════════════════════════════════
   내부 헬퍼
══════════════════════════════════════════ */

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
}

function StatCard({ label, value, unit, sub }: StatCardProps) {
  return (
    <div
      className="
        flex flex-col
        p-4 md:p-5
        bg-white-kld border border-black/[0.08]
      "
    >
      <div className="font-mono text-[10px] tracking-[0.22em] text-[#666] uppercase mb-2">
        {label}
      </div>
      <div className="font-display text-[clamp(24px,3vw,36px)] leading-none text-[#080808]">
        {value}
        {unit ? (
          <span className="font-mono text-[11px] text-[#888] ml-1">
            {unit}
          </span>
        ) : null}
      </div>
      {sub ? (
        <div className="mt-2 font-mono text-[11px] text-[#888] truncate">
          {sub}
        </div>
      ) : null}
    </div>
  );
}

/** 다음 대회 D-Day 표시값을 계산한다. */
function computeDDay(dateISO?: string): { value: string; unit?: string } {
  if (!dateISO) return { value: "—" };

  const target = new Date(dateISO).getTime();
  if (Number.isNaN(target)) return { value: "—" };

  const diffMs = target - Date.now();
  const days = Math.ceil(diffMs / 86_400_000);

  if (days > 0) return { value: `D-${days}`, unit: "일 뒤" };
  if (days === 0) return { value: "D-Day", unit: "오늘" };
  return { value: "종료", unit: "대회 마감" };
}

/** 해당 선수의 올해(현재 시스템 기준) 출전 대회 수를 센다. */
function countThisYearEntries(profile: PlayerProfile | null): number {
  if (!profile) return 0;
  const thisYear = new Date().getFullYear().toString();
  return profile.results.filter((r) => r.date.startsWith(thisYear)).length;
}
