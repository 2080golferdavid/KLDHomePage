"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUpcomingCompetitions } from "@/data/competitions";
import type { MemberTier } from "@/hooks/useCurrentUser";
import type { Competition, PlayerProfile } from "@/types";

interface DashboardContentProps {
  name: string;
  memberType: MemberTier;
  profile: PlayerProfile | null;
}

/**
 * 마이페이지 대시보드 본문.
 * - 환영 헤더
 * - 빠른 상태 4셀(랭킹·최장·출전·다음 대회 D-Day)
 * - 최근 대회 결과 3건
 * - 일반 회원 전용 정회원 업그레이드 배너
 */
export default function DashboardContent({
  name,
  memberType,
  profile,
}: DashboardContentProps) {
  const [nextEvent, setNextEvent] = useState<Competition | null>(null);

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
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <header>
        <div className="sec-eyebrow">DASHBOARD · 마이 대시보드</div>
        <h1
          className="sec-title"
          style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
        >
          WELCOME
          <span className="kr">{name}님, 안녕하세요</span>
        </h1>
        <p
          className="kld-caption-kr"
          style={{ marginTop: 14, color: "var(--kld-fg-2)" }}
        >
          오늘도 KLD 에서 좋은 기록 남기시길 바랍니다.
        </p>
      </header>

      {/* 빠른 상태 카드 4셀 — 스탯 스트립 변형 */}
      <section
        aria-label="빠른 상태"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 1,
          background: "var(--kld-line)",
          border: "1px solid var(--kld-line)",
        }}
      >
        <StatCard
          label="RANK · 현재 랭킹"
          value={profile ? `#${profile.seasonStats.rank}` : "—"}
          sub={profile ? profile.division : undefined}
          hi
        />
        <StatCard
          label="CARRY · 최장 비거리"
          value={profile ? `${profile.seasonStats.maxDistance}` : "—"}
          unit={profile ? "M" : undefined}
        />
        <StatCard
          label="ENTRIES · 올해 출전"
          value={`${thisYearEntries}`}
          unit="EVT"
        />
        <StatCard
          label="NEXT · 다음 대회"
          value={dday.value}
          sub={nextEvent?.title ?? dday.unit}
        />
      </section>

      {/* 최근 대회 결과 */}
      <section aria-label="최근 대회 결과">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2 className="panel-title">
            RECENT RESULTS<span className="kr">최근 대회 결과</span>
          </h2>
          <Link
            href="/mypage/records"
            className="kld-caption-mono"
            style={{ color: "var(--accent)" }}
          >
            전체 보기 →
          </Link>
        </div>

        {recentResults.length === 0 ? (
          <div
            style={{
              padding: 24,
              background: "var(--kld-surface-1)",
              border: "1px solid var(--kld-line)",
              textAlign: "center",
              color: "var(--kld-fg-3)",
              fontFamily: "var(--kld-font-kr)",
              fontSize: 13,
            }}
          >
            아직 참가한 대회 기록이 없습니다.
          </div>
        ) : (
          <ul
            style={{
              background: "var(--kld-surface-1)",
              border: "1px solid var(--kld-line)",
            }}
          >
            {recentResults.map((r) => (
              <li
                key={r.competitionId}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  alignItems: "center",
                  gap: 20,
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--kld-line)",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--kld-font-sans)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.competitionTitle}
                  </div>
                  <div
                    className="kld-caption-mono"
                    style={{ marginTop: 4 }}
                  >
                    {r.date} · {r.division}
                  </div>
                </div>
                <span
                  className={`rank-pos ${r.placement === 1 ? "is-top" : ""}`}
                  style={{ fontSize: 22 }}
                >
                  {r.placement}
                  <span
                    style={{
                      fontFamily: "var(--kld-font-mono)",
                      fontStyle: "normal",
                      fontWeight: 500,
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      marginLeft: 4,
                      color: "var(--kld-fg-3)",
                    }}
                  >
                    PL
                  </span>
                </span>
                <span className="rank-metric">
                  {r.distance}
                  <span className="u">M</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 정회원 전환 배너 */}
      {memberType === "general" ? (
        <section
          aria-label="정회원 전환 안내"
          style={{
            padding: 32,
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(200, 255, 62, 0.1), transparent 65%), var(--kld-surface-1)",
            border: "1px solid var(--kld-line-strong)",
            borderTop: "2px solid var(--accent)",
          }}
        >
          <div className="sec-eyebrow" style={{ marginBottom: 12 }}>
            UPGRADE · 정회원 전환
          </div>
          <h3
            style={{
              fontFamily: "var(--kld-font-display)",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(24px, 3vw, 36px)",
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              margin: "0 0 12px",
            }}
          >
            GO FULL MEMBER
          </h3>
          <p
            className="kld-caption-kr"
            style={{
              marginBottom: 24,
              maxWidth: 560,
              color: "var(--kld-fg-2)",
            }}
          >
            정회원이 되면 KLD 공식 대회 참가 신청, 시즌 포인트 집계, 공식 선수
            프로필 공개 등 모든 기능을 이용할 수 있습니다.
          </p>
          <Link href="/auth/register" className="btn btn-primary">
            정회원 전환하기 <span className="arrow">→</span>
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
  hi?: boolean;
}

function StatCard({ label, value, unit, sub, hi }: StatCardProps) {
  return (
    <div
      style={{
        background: "var(--kld-surface-1)",
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div className="kld-caption-mono">{label}</div>
      <div
        style={{
          fontFamily: "var(--kld-font-display)",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: "clamp(28px, 3vw, 40px)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: hi ? "var(--accent)" : "#fff",
          display: "inline-flex",
          alignItems: "baseline",
          gap: 4,
        }}
      >
        {value}
        {unit ? (
          <span
            style={{
              fontSize: "0.4em",
              color: "var(--kld-fg-3)",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontStyle: "normal",
            }}
          >
            {unit}
          </span>
        ) : null}
      </div>
      {sub ? (
        <div
          className="kld-caption-mono"
          style={{
            color: "var(--kld-fg-3)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}

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

function countThisYearEntries(profile: PlayerProfile | null): number {
  if (!profile) return 0;
  const thisYear = new Date().getFullYear().toString();
  return profile.results.filter((r) => r.date.startsWith(thisYear)).length;
}
