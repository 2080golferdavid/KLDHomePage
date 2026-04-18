import Link from "next/link";
import type { PlayerProfile } from "@/types";

/* ── Props 타입 ── */
interface PlayerCardProps {
  player: PlayerProfile;
}

/**
 * 선수 목록 그리드에 표시되는 카드 컴포넌트
 * 클릭 시 해당 선수 상세 페이지(/players/[id])로 이동한다.
 */
export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link
      href={`/players/${player.id}`}
      className="
        group relative flex flex-col
        bg-dark-200 border border-kld-red/[0.15]
        overflow-hidden
        hover:border-kld-red/50 transition-colors
      "
      aria-label={`${player.name} 프로필 보기`}
    >
      {/* ── 상단: 이니셜 배경 영역 ── */}
      <div
        className="
          relative aspect-[4/3] w-full
          flex items-center justify-center
          overflow-hidden
        "
        style={{
          background:
            "linear-gradient(160deg, #1a0404 0%, #080303 100%)",
        }}
        aria-hidden="true"
      >
        {/* 배경 번호(디비전 첫 글자) */}
        <div
          className="
            absolute right-[-8px] bottom-[-20px]
            font-display text-[160px] leading-none
            text-transparent pointer-events-none
          "
          style={{ WebkitTextStroke: "1px rgba(196,30,30,0.16)" }}
        >
          {player.division.charAt(0)}
        </div>

        {/* 중앙 이니셜 */}
        {player.photoUrl ? (
          <img
            src={player.photoUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="relative font-display text-[64px] leading-none text-kld-red tracking-[0.04em]">
            {player.initials}
          </span>
        )}
      </div>

      {/* ── 하단: 정보 영역 ── */}
      <div className="flex flex-col p-5 md:p-6 gap-3">
        {/* 디비전 · 지역 */}
        <div className="font-mono text-[10px] tracking-[0.2em] text-kld-red uppercase">
          {player.division} · {player.region}
        </div>

        {/* 이름 */}
        <div className="font-display text-[26px] leading-none tracking-[0.03em] text-white-kld">
          {player.name}
        </div>

        {/* 시즌 최장 + 랭킹 */}
        <div className="flex items-end justify-between mt-2 pt-3 border-t border-white/[0.06]">
          <div>
            <div className="font-mono text-[9px] tracking-[0.2em] text-gray-mid uppercase mb-1">
              Season Max
            </div>
            <div className="font-display text-[22px] leading-none text-white-kld">
              {player.seasonStats.maxDistance}
              <span className="font-mono text-[10px] text-gray-mid ml-0.5">m</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] tracking-[0.2em] text-gray-mid uppercase mb-1">
              Rank
            </div>
            <div className="font-display text-[22px] leading-none text-kld-red">
              #{player.seasonStats.rank}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
