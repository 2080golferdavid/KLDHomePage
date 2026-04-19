import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditModeButton from "@/components/players/EditModeButton";
import ProfileTabs from "@/components/players/ProfileTabs";
import { getAllPlayerIds, getPlayerById } from "@/data/players";

interface PlayerProfilePageProps {
  params: { id: string };
}

/**
 * 정적 경로 프리렌더링 — 빌드 시 모든 선수 id에 대해 정적 페이지 생성.
 */
export async function generateStaticParams() {
  const ids = await getAllPlayerIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PlayerProfilePageProps): Promise<Metadata> {
  const player = await getPlayerById(params.id);
  if (!player) {
    return { title: "선수를 찾을 수 없음 — KLD" };
  }
  return {
    title: `${player.name} — KLD 선수 프로필`,
    description: player.bio,
  };
}

/**
 * 선수 개인 프로필 페이지.
 * 상단: 브레드크럼 → 히어로(사진 + 이름 + 메타) → 시즌 스탯 스트립 → 탭.
 */
export default async function PlayerProfilePage({
  params,
}: PlayerProfilePageProps) {
  const player = await getPlayerById(params.id);
  if (!player) notFound();

  return (
    <main>
      {/* BREADCRUMB */}
      <nav
        className="wrap"
        aria-label="경로"
        style={{ paddingTop: 120, paddingBottom: 12 }}
      >
        <ol
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--kld-font-mono)",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link
              href="/players"
              style={{ color: "var(--kld-fg-3)" }}
            >
              ATHLETES · 선수 목록
            </Link>
          </li>
          <li style={{ color: "var(--kld-fg-4)" }} aria-hidden="true">
            /
          </li>
          <li style={{ color: "var(--accent)" }}>{player.name}</li>
        </ol>
      </nav>

      {/* HERO */}
      <section
        className="wrap"
        style={{
          paddingBottom: 64,
          borderBottom: "1px solid var(--kld-line)",
          position: "relative",
        }}
        aria-label="선수 기본 정보"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(240px, 320px) 1fr",
            gap: 48,
            alignItems: "start",
          }}
          className="player-detail-grid"
        >
          {/* 좌측 사진/이니셜 */}
          <div
            style={{
              position: "relative",
              aspectRatio: "3 / 4",
              width: "100%",
              overflow: "hidden",
              border: "1px solid var(--kld-line-strong)",
              borderTop: "2px solid var(--accent)",
              background:
                "radial-gradient(ellipse at 70% 30%, rgba(200,255,62,0.18), transparent 60%), linear-gradient(135deg, #1a1a22 0%, #0B0B0E 80%)",
            }}
            aria-hidden={!player.photoUrl || undefined}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -20,
                bottom: -30,
                fontFamily: "var(--kld-font-display)",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: 220,
                lineHeight: 0.85,
                color: "transparent",
                WebkitTextStroke: "1px rgba(200, 255, 62, 0.2)",
                pointerEvents: "none",
                letterSpacing: "-0.04em",
              }}
            >
              {player.division.charAt(0)}
            </div>

            {player.photoUrl ? (
              <Image
                src={player.photoUrl}
                alt={`${player.name} 프로필 사진`}
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--kld-font-display)",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: 96,
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
                aria-hidden="true"
              >
                {player.initials}
              </span>
            )}
          </div>

          {/* 우측 정보 */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 20,
              }}
            >
              <div className="kld-caption-mono" style={{ color: "var(--accent)" }}>
                {player.division} · {player.region} · CAREER SINCE {player.careerStart}
              </div>
              <EditModeButton profileId={player.id} />
            </div>

            <h1
              className="sec-title"
              style={{
                fontSize: "clamp(44px, 7vw, 96px)",
                margin: "0 0 16px",
              }}
            >
              {player.name}
            </h1>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px 20px",
                marginBottom: 28,
              }}
            >
              {player.heightCm ? (
                <span className="kld-caption-mono">{player.heightCm}CM</span>
              ) : null}
              {player.weightKg ? (
                <span className="kld-caption-mono">{player.weightKg}KG</span>
              ) : null}
              <span className="kld-caption-mono">
                {player.dominantHand === "오른손" ? "RIGHT-HANDED" : "LEFT-HANDED"} · {player.dominantHand}
              </span>
            </div>

            <p
              style={{
                fontFamily: "var(--kld-font-kr)",
                fontSize: 15,
                lineHeight: 1.75,
                color: "var(--kld-fg-2)",
                maxWidth: 640,
                marginBottom: 28,
              }}
            >
              {player.bio}
            </p>

            {player.social &&
            (player.social.instagram || player.social.youtube) ? (
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                aria-label="소셜 미디어"
              >
                {player.social.instagram ? (
                  <a
                    href="#"
                    style={{
                      fontFamily: "var(--kld-font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      color: "var(--kld-fg-2)",
                      border: "1px solid var(--kld-line-strong)",
                      padding: "7px 14px",
                    }}
                  >
                    ◎ {player.social.instagram}
                  </a>
                ) : null}
                {player.social.youtube ? (
                  <a
                    href="#"
                    style={{
                      fontFamily: "var(--kld-font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      color: "var(--kld-fg-2)",
                      border: "1px solid var(--kld-line-strong)",
                      padding: "7px 14px",
                    }}
                  >
                    ▶ {player.social.youtube}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* SEASON STATS STRIP */}
      <section aria-label="시즌 통계" className="stats-strip">
        <div className="stats-strip-grid">
          <StatCell v={`${player.seasonStats.maxDistance}`} u="M" k="SEASON MAX · 시즌 최장" />
          <StatCell v={`#${player.seasonStats.rank}`} k="RANK · 순위" />
          <StatCell v={player.seasonStats.points} u="PTS" k="POINTS · 포인트" />
          <StatCell
            v={`${player.seasonStats.participationCount}`}
            u="EVT"
            k="EVENTS · 참가"
          />
        </div>
      </section>

      {/* TABS: RESULTS / EQUIPMENT */}
      <section className="sec reveal" aria-label="대회 기록 및 장비">
        <div className="wrap">
          <ProfileTabs
            equipment={player.equipment}
            results={player.results}
          />
        </div>
      </section>
    </main>
  );
}

/* ── 페이지 내부 전용 스탯 셀 ── */
interface StatCellProps {
  v: string;
  u?: string;
  k: string;
}
function StatCell({ v, u, k }: StatCellProps) {
  return (
    <div className="stats-strip-cell">
      <div className="v">
        {v}
        {u ? <sub>{u}</sub> : null}
      </div>
      <div className="k">{k}</div>
    </div>
  );
}
