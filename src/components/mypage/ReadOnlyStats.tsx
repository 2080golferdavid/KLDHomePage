import type { PlayerProfile } from "@/types";

/* ── Props ── */
interface ReadOnlyStatsProps {
  player: PlayerProfile;
}

/**
 * 마이페이지 — 편집 불가(Read-only) 항목 블록
 *
 * 표시 대상:
 *  - 시즌 포인트, 랭킹, 시즌 최장 비거리, 대회 참가 수
 *  - 대회 기록(최근 5건)
 *
 * 안내 문구:
 *  - 상단에 "편집 불가 항목은 관리자만 수정할 수 있습니다" 배너 표시
 */
export default function ReadOnlyStats({ player }: ReadOnlyStatsProps) {
  /* 최근 대회 기록 5건만 노출 — 전체 내역은 /players/[id] 에서 조회 가능 */
  const recentResults = player.results.slice(0, 5);

  return (
    <section aria-label="편집 불가 항목" className="flex flex-col gap-5">
      {/* ── 안내 배너 ── */}
      <div
        className="
          flex items-start gap-3
          p-4
          bg-kld-red/[0.06] border border-kld-red/30
        "
        role="note"
      >
        <span
          className="
            mt-0.5 shrink-0
            inline-flex items-center justify-center
            w-5 h-5 border border-kld-red text-kld-red
            font-mono text-[11px]
          "
          aria-hidden="true"
        >
          !
        </span>
        <div>
          <div className="font-ui text-[12px] font-bold tracking-[0.14em] uppercase text-kld-red mb-1">
            Admin Only
          </div>
          <p className="text-[13px] font-light leading-[1.6] text-gray-light">
            편집 불가 항목은 관리자만 수정할 수 있습니다. 기록 정정이 필요하면
            운영팀에 문의해주세요.
          </p>
        </div>
      </div>

      {/* ── 시즌 스탯 ── */}
      <div>
        <h3 className="font-mono text-[10px] tracking-[0.24em] text-gray-mid uppercase mb-3">
          Season Stats (Read-only)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBlock
            label="Rank"
            value={`#${player.seasonStats.rank}`}
          />
          <StatBlock
            label="Season Max"
            value={`${player.seasonStats.maxDistance}`}
            unit="m"
          />
          <StatBlock
            label="Points"
            value={player.seasonStats.points}
            unit="pts"
          />
          <StatBlock
            label="Events"
            value={`${player.seasonStats.participationCount}`}
            unit="회"
          />
        </div>
      </div>

      {/* ── 대회 기록 ── */}
      <div>
        <h3 className="font-mono text-[10px] tracking-[0.24em] text-gray-mid uppercase mb-3">
          Competition Results (Read-only)
        </h3>

        {recentResults.length === 0 ? (
          <p className="text-[13px] font-light text-gray-mid py-6 text-center border border-dashed border-white/10">
            아직 기록된 대회가 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {recentResults.map((r) => (
              <li
                key={r.competitionId}
                className="
                  grid grid-cols-[1fr_auto_auto] items-center gap-3 md:gap-5
                  py-3.5
                "
              >
                <div className="min-w-0">
                  <div className="font-ui text-sm font-semibold text-white-kld truncate">
                    {r.competitionTitle}
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.08em] text-gray-mid mt-0.5">
                    {r.date} · {r.division}
                  </div>
                </div>
                <div
                  className={`
                    inline-flex items-center justify-center
                    min-w-[42px] px-2 py-1
                    font-display text-[13px] tracking-[0.04em]
                    ${r.placement === 1
                      ? "bg-kld-red/20 border border-kld-red text-kld-red"
                      : "border border-white/10 text-gray-light"}
                  `}
                >
                  {r.placement}위
                </div>
                <div className="text-right">
                  <span className="font-display text-[18px] tracking-[0.04em] text-white-kld">
                    {r.distance}
                    <span className="font-mono text-[10px] text-gray-mid ml-0.5">
                      m
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ── 내부 헬퍼: 스탯 블록 ── */
interface StatBlockProps {
  label: string;
  value: string;
  unit?: string;
}

function StatBlock({ label, value, unit }: StatBlockProps) {
  return (
    <div
      className="
        flex flex-col p-4
        bg-dark-200 border border-white/[0.06]
        opacity-[0.95]
      "
    >
      <div className="font-mono text-[10px] tracking-[0.22em] text-gray-mid uppercase mb-2">
        {label}
      </div>
      <div className="font-display text-[clamp(22px,3vw,32px)] leading-none text-white-kld">
        {value}
        {unit ? (
          <span className="font-mono text-[11px] text-gray-mid ml-1">
            {unit}
          </span>
        ) : null}
      </div>
      {/* 우상단 자물쇠 아이콘 */}
      <div className="flex items-center gap-1 mt-3 font-mono text-[9px] tracking-[0.2em] text-gray-kld uppercase">
        <span aria-hidden="true">🔒</span>
        Locked
      </div>
    </div>
  );
}
