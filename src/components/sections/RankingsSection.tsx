"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BI_DIVISIONS,
  BI_RANKINGS,
  type BiDivision,
  type BiRankingPlayer,
} from "@/constants/homeData";

/**
 * 시즌 랭킹 섹션.
 * 상단에 디비전 탭(아마추어/마스터즈/우먼스/오픈)과 "전체 보기" 보조 버튼.
 * 본문은 RANK / 변동 / 선수 / 최장 비거리 / 참가 / 포인트 열을 가진 테이블.
 */
export default function RankingsSection() {
  const [division, setDivision] = useState<BiDivision["key"]>("amateur");
  const players = BI_RANKINGS[division];

  /* 변동 표시(↑n / ↓n / —)를 렌더링한다. */
  function renderChange(p: BiRankingPlayer): ReactNode {
    if (p.change === "same") return <span className="rank-change same">—</span>;
    if (p.change === "up") return <span className="rank-change up">↑{p.d}</span>;
    return <span className="rank-change down">↓{p.d}</span>;
  }

  return (
    <section id="rankings" className="sec sec-alt reveal">
      <div className="wrap">
        <span className="sec-num">S01 / 05</span>

        <div className="sec-head">
          <div>
            <div className="sec-eyebrow">SEASON STANDINGS · 시즌 랭킹</div>
            <h2 className="sec-title">
              2025
              <br />
              STANDINGS
              <span className="kr">시즌 랭킹</span>
            </h2>
          </div>

          <div className="rank-head-right">
            <div className="tabs" role="tablist" aria-label="디비전 선택">
              {BI_DIVISIONS.map((d) => (
                <button
                  key={d.key}
                  role="tab"
                  type="button"
                  aria-selected={division === d.key}
                  className={`tab ${division === d.key ? "is-active" : ""}`}
                  onClick={() => setDivision(d.key)}
                >
                  {d.en}
                  <span className="kr">{d.kr}</span>
                </button>
              ))}
            </div>
            <Link href="/rankings" className="btn btn-secondary">
              VIEW FULL TABLE · 전체 랭킹 →
            </Link>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="rank-table" aria-label="현재 시즌 랭킹">
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
                <tr key={p.rank}>
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
                        <div className="rank-name">
                          {p.name} <span className="kr">/ {p.kr}</span>
                        </div>
                        <div className="rank-sub">{p.region}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="rank-metric">
                      {p.carry}
                      <span className="u">M</span>
                    </span>
                  </td>
                  <td>
                    <span
                      className="rank-sub"
                      style={{ margin: 0, fontSize: 12 }}
                    >
                      {p.part}
                    </span>
                  </td>
                  <td>
                    <span className="rank-pts">
                      {p.pts}
                      <span className="u">PTS</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
