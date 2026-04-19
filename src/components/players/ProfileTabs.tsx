"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  PlayerCompetitionResult,
  PlayerEquipment,
} from "@/types";

interface ProfileTabsProps {
  equipment: PlayerEquipment[];
  results: PlayerCompetitionResult[];
}

/** 탭 식별자 */
type TabId = "records" | "equipment";

const TABS: { id: TabId; en: string; kr: string }[] = [
  { id: "records", en: "RESULTS", kr: "대회 기록" },
  { id: "equipment", en: "EQUIPMENT", kr: "장비" },
];

/**
 * 선수 프로필 하단 탭.
 * RESULTS 탭: 대회 출전 기록을 .rank-table 스타일로 표시.
 * EQUIPMENT 탭: 장비 목록을 카드 그리드로 표시.
 */
export default function ProfileTabs({
  equipment,
  results,
}: ProfileTabsProps) {
  const [active, setActive] = useState<TabId>("records");

  return (
    <div>
      <div
        className="tabs"
        role="tablist"
        aria-label="프로필 상세 탭"
        style={{ marginBottom: 28 }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            aria-controls={`tab-panel-${t.id}`}
            className={`tab ${active === t.id ? "is-active" : ""}`}
            onClick={() => setActive(t.id)}
          >
            {t.en}
            <span className="kr">{t.kr}</span>
          </button>
        ))}
      </div>

      {active === "records" ? (
        <div id="tab-panel-records" role="tabpanel" aria-label="대회 기록">
          {results.length === 0 ? (
            <p
              className="kld-caption-kr"
              style={{ textAlign: "center", padding: "40px 0" }}
            >
              아직 대회 출전 기록이 없습니다.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="rank-table" aria-label="대회 출전 기록">
                <thead>
                  <tr>
                    <th>DATE · 일자</th>
                    <th>EVENT · 대회</th>
                    <th>DIVISION · 디비전</th>
                    <th style={{ textAlign: "center" }}>PLACE · 순위</th>
                    <th style={{ textAlign: "right" }}>CARRY · 비거리</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.competitionId}>
                      <td>
                        <span
                          className="kld-caption-mono"
                          style={{ color: "var(--kld-fg-2)" }}
                        >
                          {r.date}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/competitions#${r.competitionId}`}
                          style={{
                            color: "#fff",
                            fontFamily: "var(--kld-font-sans)",
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {r.competitionTitle}
                        </Link>
                      </td>
                      <td>
                        <span className="rank-sub" style={{ margin: 0 }}>
                          {r.division}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
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
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className="rank-metric">
                          {r.distance}
                          <span className="u">M</span>
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

      {active === "equipment" ? (
        <div id="tab-panel-equipment" role="tabpanel" aria-label="장비 목록">
          {equipment.length === 0 ? (
            <p
              className="kld-caption-kr"
              style={{ textAlign: "center", padding: "40px 0" }}
            >
              등록된 장비 정보가 없습니다.
            </p>
          ) : (
            <ul
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 1,
                background: "var(--kld-line)",
                border: "1px solid var(--kld-line)",
              }}
            >
              {equipment.map((item) => (
                <li
                  key={`${item.category}-${item.brand}-${item.model}`}
                  style={{
                    background: "var(--kld-surface-1)",
                    padding: "20px 22px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    className="kld-caption-mono"
                    style={{ color: "var(--accent)" }}
                  >
                    {item.category}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--kld-font-sans)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    {item.brand}{" "}
                    <span
                      style={{ color: "var(--kld-fg-2)", fontWeight: 400 }}
                    >
                      {item.model}
                    </span>
                  </div>
                  {item.note ? (
                    <div
                      className="kld-caption-kr"
                      style={{ fontSize: 12 }}
                    >
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
