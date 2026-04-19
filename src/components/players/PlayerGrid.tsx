"use client";

import { useMemo, useState } from "react";
import PlayerCard from "@/components/players/PlayerCard";
import type { Division, PlayerProfile } from "@/types";

/* ── Props 타입 ── */
interface PlayerGridProps {
  players: PlayerProfile[];
}

/** 필터 탭 — "전체" + 4개 디비전 */
type DivisionFilter = "전체" | Division;
const DIVISION_FILTERS: { key: DivisionFilter; en: string; kr: string }[] = [
  { key: "전체", en: "ALL", kr: "전체" },
  { key: "아마추어", en: "AMATEUR", kr: "아마추어" },
  { key: "마스터즈", en: "MASTERS", kr: "마스터즈" },
  { key: "우먼스", en: "WOMENS", kr: "우먼스" },
  { key: "오픈", en: "OPEN", kr: "오픈" },
];

/**
 * 선수 목록 그리드.
 * 상단: 검색 입력 + 디비전 탭.
 * 본문: players-grid 스타일의 3:4 카드 그리드 (레퍼런스 홈과 동일).
 */
export default function PlayerGrid({ players }: PlayerGridProps) {
  const [query, setQuery] = useState("");
  const [division, setDivision] = useState<DivisionFilter>("전체");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players.filter((p) => {
      const matchesDivision = division === "전체" || p.division === division;
      const matchesQuery =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        p.initials.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q);
      return matchesDivision && matchesQuery;
    });
  }, [players, query, division]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <label
          style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}
          aria-label="선수 이름 검색"
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--kld-fg-3)",
              fontFamily: "var(--kld-font-mono)",
              fontSize: 14,
              pointerEvents: "none",
            }}
          >
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH · 선수 이름"
            className="form-input"
            style={{ paddingLeft: 36 }}
          />
        </label>

        <div
          className="tabs"
          role="tablist"
          aria-label="디비전 필터"
          style={{ overflowX: "auto" }}
        >
          {DIVISION_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={division === f.key}
              className={`tab ${division === f.key ? "is-active" : ""}`}
              onClick={() => setDivision(f.key)}
            >
              {f.en}
              <span className="kr">{f.kr}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="kld-caption-mono"
        style={{ marginBottom: 20 }}
        aria-live="polite"
      >
        {filtered.length === 0
          ? "NO RESULTS · 결과 없음"
          : `SHOWING — ${String(filtered.length).padStart(2, "0")} PLAYERS · ${filtered.length}명`}
      </div>

      {filtered.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            padding: "56px 20px",
            border: "1px dashed var(--kld-line-strong)",
            color: "var(--kld-fg-3)",
            fontFamily: "var(--kld-font-kr)",
            fontSize: 14,
          }}
        >
          조건에 맞는 선수가 없습니다. 검색어나 디비전을 변경해보세요.
        </p>
      ) : (
        <div className="players-grid">
          {filtered.map((p) => (
            <PlayerCard key={p.id} player={p} />
          ))}
        </div>
      )}
    </div>
  );
}
