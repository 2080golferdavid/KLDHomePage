import Image from "next/image";
import Link from "next/link";
import type { PlayerProfile } from "@/types";

/* ── Props 타입 ── */
interface PlayerCardProps {
  player: PlayerProfile;
}

/**
 * 선수 목록 카드 — /players 그리드에 표시.
 * 레퍼런스의 .player-card 스타일을 재사용하되 배경 비주얼과 스탯을 목록용으로 단순화한다.
 */
export default function PlayerCard({ player }: PlayerCardProps) {
  /* 디비전 첫 글자를 시드 번호 자리에 넣어 브로드캐스트 뱃지처럼 보이게 한다. */
  const divisionLetter = player.division.charAt(0);

  return (
    <Link
      href={`/players/${player.id}`}
      className="player-card"
      aria-label={`${player.name} 프로필 보기`}
      style={{ aspectRatio: "3 / 4" }}
    >
      <div className="bg" aria-hidden="true" />
      <span className="bug">
        {player.division} · {player.region}
      </span>
      <span className="seed" aria-hidden="true">
        {divisionLetter}
      </span>

      {/* 사진이 있으면 상단 영역에 중앙 배치. 없으면 이니셜을 큰 아웃라인으로. */}
      {player.photoUrl ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            zIndex: 1,
          }}
          aria-hidden="true"
        >
          <Image
            src={player.photoUrl}
            alt=""
            fill
            sizes="(max-width: 720px) 50vw, 25vw"
            style={{
              objectFit: "cover",
              opacity: 0.55,
            }}
          />
        </div>
      ) : (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "38%",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "var(--kld-font-display)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 72,
            lineHeight: 1,
            color: "var(--accent)",
            opacity: 0.35,
            letterSpacing: "-0.02em",
          }}
        >
          {player.initials}
        </span>
      )}

      <div className="info">
        <div className="div">{player.division.toUpperCase()}</div>
        <div className="name">
          {player.name}
          <span className="kr">{player.region}</span>
        </div>
        <div className="stats">
          <div>
            <div className="v">
              {player.seasonStats.maxDistance}
              <span style={{ fontSize: "0.5em", marginLeft: 2 }}>M</span>
            </div>
            <div className="k">SEASON MAX</div>
          </div>
          <div>
            <div className="v">#{player.seasonStats.rank}</div>
            <div className="k">RANK</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
