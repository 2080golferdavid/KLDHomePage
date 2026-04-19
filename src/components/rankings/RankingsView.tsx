"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { Division, RankingPlayer } from "@/types";

/* ── Props 타입 (컴포넌트 바로 위에 배치) ── */
interface RankingsViewProps {
  rankings: Record<Division, RankingPlayer[]>;
}

/** 디비전 탭 — 영문/한글 라벨 포함 */
const DIVISION_TABS: { key: Division; en: string; kr: string }[] = [
  { key: "아마추어", en: "AMATEUR", kr: "아마추어" },
  { key: "마스터즈", en: "MASTERS", kr: "마스터즈" },
  { key: "우먼스", en: "WOMENS", kr: "우먼스" },
  { key: "오픈", en: "OPEN", kr: "오픈" },
];

/**
 * 랭킹 뷰(Rankings View)
 *
 * 레퍼런스의 `.tabs` + `.rank-table` 스타일을 그대로 사용한다.
 * 탭 전환 시 서버에 추가 요청하지 않고 props 로 받은 전체 데이터에서 필터링만 한다.
 */
export default function RankingsView({ rankings }: RankingsViewProps) {
  const [active, setActive] = useState<Division>("아마추어");
  const players = rankings[active];

  /** ↑n / ↓n / — 표시 */
  function renderChange(p: RankingPlayer): ReactNode {
    if (p.change === "same") return <span className="rank-change same">—</span>;
    if (p.change === "up")
      return <span className="rank-change up">↑{p.changeAmount}</span>;
    return <span className="rank-change down">↓{p.changeAmount}</span>;
  }

  return (
    <div>
      <div
        className="tabs"
        role="tablist"
        aria-label="디비전 선택"
        style={{ marginBottom: 32, width: "100%", overflowX: "auto" }}
      >
        {DIVISION_TABS.map((d) => (
          <button
            key={d.key}
            type="button"
            role="tab"
            aria-selected={active === d.key}
            className={`tab ${active === d.key ? "is-active" : ""}`}
            onClick={() => setActive(d.key)}
            style={{ flex: 1 }}
          >
            {d.en}
            <span className="kr">{d.kr}</span>
          </button>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          className="rank-table"
          aria-label={`${active} 디비전 시즌 랭킹`}
        >
          <thead>
            <tr>
              <th>RANK</th>
              <th aria-label="변동" />
              <th>PLAYER · 선수</th>
              <th>CARRY · 최장 비거리</th>
              <th>EVENTS · 참가</th>
              <th>POINTS</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={`${active}-${p.rank}`}>
                <td>
                  <span
                    className={`rank-pos ${p.rank === 1 ? "is-top" : ""}`}
                  >
                    {String(p.rank).padStart(2, "0")}
                  </span>
                </td>
                <td>{renderChange(p)}</td>
                <td>
                  <div className="rank-player">
                    <div className="rank-avatar">{p.initials}</div>
                    <div>
                      <div className="rank-name">{p.name}</div>
                      <div className="rank-sub">
                        {p.region} · {p.division}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="rank-metric">
                    {p.maxDistance}
                    <span className="u">M</span>
                  </span>
                </td>
                <td>
                  <span
                    className="rank-sub"
                    style={{ margin: 0, fontSize: 12 }}
                  >
                    {p.participation}
                  </span>
                </td>
                <td>
                  <span className="rank-pts">
                    {p.points}
                    <span className="u">PTS</span>
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
