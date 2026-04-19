"use client";

import { useEffect, useMemo, useState } from "react";
import {
  submitCompetitionResult,
  type CompetitionOption,
  type PlayerOption,
} from "@/lib/admin/actions";
import { getPastCompetitions } from "@/data/competitions";
import { getAllPlayers } from "@/data/players";
import type { Division } from "@/types";

/**
 * 대회 결과 입력 폼
 *
 * 흐름:
 *   1) 대회 선택(dropdown) — 현재는 "지난 대회" 만 대상으로 한다.
 *   2) 선수 선택(dropdown, 검색 가능)
 *   3) 디비전 / 비거리 / 순위 / 포인트 입력
 *   4) 제출 시 submitCompetitionResult 호출
 */
export default function ResultInputForm() {
  const [competitions, setCompetitions] = useState<CompetitionOption[]>([]);
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [loading, setLoading] = useState(true);

  /* 폼 상태 */
  const [competitionId, setCompetitionId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [division, setDivision] = useState<Division | "">("");
  const [distance, setDistance] = useState<string>("");
  const [rank, setRank] = useState<string>("");
  const [points, setPoints] = useState<string>("");
  const [playerQuery, setPlayerQuery] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  /* ── 초기 데이터 로딩 ──
     대회 선택 옵션은 getPastCompetitions 를, 선수 옵션은 getAllPlayers 를 재사용한다.
     두 fetcher 를 병렬로 호출해 대기 시간을 줄인다. */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [pastComps, allPlayers] = await Promise.all([
        getPastCompetitions(),
        getAllPlayers(),
      ]);
      if (cancelled) return;
      setCompetitions(
        pastComps.map((c) => ({
          id: c.id,
          title: c.title,
          date: c.date,
          divisions: c.divisions,
        })),
      );
      setPlayers(
        allPlayers.map((p) => ({
          id: p.id,
          name: p.name,
          initials: p.initials,
          division: p.division,
          region: p.region,
        })),
      );
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* 선택된 대회가 있으면 해당 대회의 디비전만 옵션으로 노출한다. */
  const currentCompetition = competitions.find((c) => c.id === competitionId);
  const divisionOptions: Division[] = currentCompetition
    ? currentCompetition.divisions
    : [];

  /* 선수 검색 — 이름/이니셜/지역에 포함되면 매칭 */
  const filteredPlayers = useMemo(() => {
    const q = playerQuery.trim().toLowerCase();
    if (!q) return players;
    return players.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.initials.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q),
    );
  }, [players, playerQuery]);

  /** 선수를 선택하면 해당 선수의 디비전을 기본값으로 제안한다. */
  function handleSelectPlayer(id: string) {
    setPlayerId(id);
    const p = players.find((x) => x.id === id);
    if (p && (!division || !divisionOptions.includes(division as Division))) {
      if (divisionOptions.includes(p.division)) {
        setDivision(p.division);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFlash(null);

    /* 숫자 변환/검증은 submitCompetitionResult 내부에서도 하지만,
       사용자에게 즉시 피드백을 주기 위해 여기서도 간단히 체크한다. */
    const distanceNum = Number(distance);
    const rankNum = Number(rank);
    const pointsNum = Number(points);

    if (!competitionId || !playerId || !division) {
      setFlash({ kind: "err", msg: "대회, 선수, 디비전을 모두 선택해주세요." });
      return;
    }
    if (!Number.isFinite(distanceNum) || !Number.isFinite(rankNum) || !Number.isFinite(pointsNum)) {
      setFlash({ kind: "err", msg: "비거리/순위/포인트는 숫자여야 합니다." });
      return;
    }

    setSubmitting(true);
    const result = await submitCompetitionResult({
      competitionId,
      playerId,
      division: division as Division,
      distance: distanceNum,
      rank: rankNum,
      points: pointsNum,
    });
    setSubmitting(false);

    if (!result.success) {
      setFlash({ kind: "err", msg: result.error ?? "저장에 실패했습니다." });
      return;
    }

    /* 성공 시 폼을 부분적으로 초기화한다 — 같은 대회에 여러 선수 입력하는 경우가
       많으므로 competitionId 는 유지하고 선수/기록만 초기화한다. */
    const savedPlayer = players.find((p) => p.id === playerId);
    setPlayerId("");
    setPlayerQuery("");
    setDistance("");
    setRank("");
    setPoints("");
    setFlash({
      kind: "ok",
      msg: `저장 완료 — ${savedPlayer?.name ?? "선수"} · ${distanceNum}m · ${rankNum}위`,
    });
  }

  if (loading) {
    return (
      <div className="font-mono text-[11px] tracking-[0.22em] text-gray-mid uppercase py-6">
        대회/선수 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* ── 대회 선택 ── */}
      <Field label="대회" htmlFor="rf-competition" required>
        <select
          id="rf-competition"
          required
          value={competitionId}
          onChange={(e) => {
            setCompetitionId(e.target.value);
            setDivision(""); // 대회 바뀌면 디비전 리셋
          }}
          className="input-admin"
        >
          <option value="">대회를 선택하세요</option>
          {competitions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} · {c.date}
            </option>
          ))}
        </select>
      </Field>

      {/* ── 선수 검색 + 선택 ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
        <Field label="선수 검색" htmlFor="rf-player-search">
          <input
            id="rf-player-search"
            type="search"
            value={playerQuery}
            onChange={(e) => setPlayerQuery(e.target.value)}
            placeholder="이름/이니셜/지역으로 검색"
            className="input-admin"
          />
        </Field>
        <Field label="선수 선택" htmlFor="rf-player" required>
          <select
            id="rf-player"
            required
            value={playerId}
            onChange={(e) => handleSelectPlayer(e.target.value)}
            className="input-admin"
            size={1}
          >
            <option value="">선수를 선택하세요 ({filteredPlayers.length}명)</option>
            {filteredPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.division} · {p.region})
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* ── 디비전 / 비거리 / 순위 / 포인트 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Field label="디비전" htmlFor="rf-division" required>
          <select
            id="rf-division"
            required
            value={division}
            onChange={(e) => setDivision(e.target.value as Division | "")}
            className="input-admin"
            disabled={!competitionId}
          >
            <option value="">선택</option>
            {divisionOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field label="비거리 (m)" htmlFor="rf-distance" required>
          <input
            id="rf-distance"
            type="number"
            required
            min={1}
            step={1}
            inputMode="numeric"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="예) 381"
            className="input-admin"
          />
        </Field>

        <Field label="순위" htmlFor="rf-rank" required>
          <input
            id="rf-rank"
            type="number"
            required
            min={1}
            step={1}
            inputMode="numeric"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="예) 1"
            className="input-admin"
          />
        </Field>

        <Field label="포인트" htmlFor="rf-points" required>
          <input
            id="rf-points"
            type="number"
            required
            min={0}
            step={1}
            inputMode="numeric"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="예) 500"
            className="input-admin"
          />
        </Field>
      </div>

      {/* ── 피드백 ── */}
      {flash ? (
        <div
          role={flash.kind === "err" ? "alert" : "status"}
          className={`
            font-mono text-[11px] px-3 py-2.5 border
            ${flash.kind === "ok"
              ? "text-[#5FD17A] border-[#5FD17A]/30 bg-[#5FD17A]/[0.06]"
              : "text-[#FF6060] border-[#FF6060]/30 bg-[#FF6060]/[0.06]"}
          `}
        >
          {flash.msg}
        </div>
      ) : null}

      {/* ── 제출 ── */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="
            inline-flex items-center justify-center
            font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-white-kld
            bg-kld-green px-6 py-3.5
            hover:bg-kld-green-600 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {submitting ? "저장 중..." : "결과 저장"}
        </button>
      </div>

      <style jsx>{`
        .input-admin {
          width: 100%;
          padding: 0.75rem 0.875rem;
          background: #111111;
          border: 1px solid rgba(196, 30, 30, 0.2);
          color: #f5f5f5;
          font-size: 13px;
          transition: border-color 150ms;
        }
        .input-admin::placeholder {
          color: #888888;
        }
        .input-admin:focus {
          outline: none;
          border-color: #c41e1e;
        }
        .input-admin:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}

/* ── 내부 헬퍼: 필드 라벨 ── */
interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, htmlFor, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase flex items-center gap-2"
      >
        {label}
        {required ? (
          <span className="text-kld-green" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
    </div>
  );
}
