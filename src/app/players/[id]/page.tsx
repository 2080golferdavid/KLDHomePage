import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditModeButton from "@/components/players/EditModeButton";
import ProfileTabs from "@/components/players/ProfileTabs";
import { getAllPlayerIds, getPlayerById } from "@/data/players";

/* ── 동적 라우트 Props 타입 ──
   Next.js 14 에서 dynamic segment `[id]` 는 params.id 로 들어온다. */
interface PlayerProfilePageProps {
  params: { id: string };
}

/**
 * 정적 경로 프리렌더링(generateStaticParams)
 * 빌드 시 모든 선수 id 에 대해 정적 페이지를 생성한다.
 * Supabase 연동 후에도 동일한 패턴을 유지할 수 있다.
 */
export async function generateStaticParams() {
  const ids = await getAllPlayerIds();
  return ids.map((id) => ({ id }));
}

/** 페이지별 동적 메타데이터 — 선수 이름을 타이틀에 포함한다. */
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
 * 선수 개인 프로필 페이지 (동적 라우트: /players/[id])
 *
 * 구조:
 * - 상단 히어로: 사진(또는 이니셜) + 기본 정보 + 본인 편집 버튼
 * - 소개(Bio) 블록
 * - 시즌 스탯 4분할 블록
 * - 하단 탭: 대회 기록 / 장비
 */
export default async function PlayerProfilePage({
  params,
}: PlayerProfilePageProps) {
  const player = await getPlayerById(params.id);

  /* 존재하지 않는 id 로 접근하면 404 페이지로 보낸다. */
  if (!player) {
    notFound();
  }

  return (
    <main className="pt-nav">
      {/* ════════════════════
          브레드크럼(Breadcrumb)
      ════════════════════ */}
      <nav
        className="px-5 md:px-8 lg:px-16 pt-8 md:pt-10"
        aria-label="경로"
      >
        <ol className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase">
          <li>
            <Link
              href="/players"
              className="text-gray-mid hover:text-kld-red transition-colors"
            >
              선수 목록
            </Link>
          </li>
          <li className="text-gray-kld" aria-hidden="true">
            /
          </li>
          <li className="text-white-kld">{player.name}</li>
        </ol>
      </nav>

      {/* ════════════════════
          히어로: 사진 + 기본 정보
      ════════════════════ */}
      <section
        className="
          px-5 md:px-8 lg:px-16
          pt-8 md:pt-10
          pb-12 md:pb-16 lg:pb-20
          border-b border-kld-red/[0.15]
        "
        aria-label="선수 기본 정보"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 md:gap-10 lg:gap-14 items-start">
          {/* ── 좌측: 사진 / 이니셜 영역 ── */}
          <div
            className="
              relative aspect-[4/5] w-full max-w-[320px] mx-auto lg:mx-0
              flex items-center justify-center
              overflow-hidden
              border border-kld-red/[0.2]
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
                absolute right-[-12px] bottom-[-24px]
                font-display text-[200px] leading-none
                text-transparent pointer-events-none
              "
              style={{ WebkitTextStroke: "1px rgba(196,30,30,0.18)" }}
            >
              {player.division.charAt(0)}
            </div>

            {player.photoUrl ? (
              <img
                src={player.photoUrl}
                alt={`${player.name} 프로필 사진`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="relative font-display text-[96px] leading-none text-kld-red tracking-[0.04em]">
                {player.initials}
              </span>
            )}
          </div>

          {/* ── 우측: 텍스트 정보 ── */}
          <div className="flex flex-col">
            {/* 디비전 · 지역 · 편집 버튼 */}
            <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
              <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase">
                {player.division} · {player.region} · 활동 시작 {player.careerStart}
              </div>
              <EditModeButton profileId={player.id} />
            </div>

            {/* 이름 */}
            <h1
              className="
                font-display text-[clamp(48px,7vw,96px)]
                leading-[0.9] tracking-[0.02em]
                text-white-kld mb-3
              "
            >
              {player.name}
            </h1>

            {/* 피지컬 메타 */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 mb-7 font-mono text-[11px] tracking-[0.14em] text-gray-light uppercase">
              {player.heightCm ? <span>{player.heightCm}cm</span> : null}
              {player.weightKg ? <span>{player.weightKg}kg</span> : null}
              <span>{player.dominantHand}</span>
            </div>

            {/* 소개(Bio) */}
            <p className="text-[14px] md:text-[15px] font-light leading-[1.75] text-gray-light max-w-[620px] mb-8">
              {player.bio}
            </p>

            {/* 소셜 링크 */}
            {player.social &&
            (player.social.instagram || player.social.youtube) ? (
              <div className="flex flex-wrap gap-2" aria-label="소셜 미디어">
                {player.social.instagram ? (
                  <a
                    href="#"
                    className="
                      font-mono text-[11px] tracking-[0.16em] text-gray-light
                      border border-kld-red/30 px-3 py-1.5
                      hover:border-kld-red hover:text-kld-red transition-colors
                    "
                  >
                    ◎ {player.social.instagram}
                  </a>
                ) : null}
                {player.social.youtube ? (
                  <a
                    href="#"
                    className="
                      font-mono text-[11px] tracking-[0.16em] text-gray-light
                      border border-kld-red/30 px-3 py-1.5
                      hover:border-kld-red hover:text-kld-red transition-colors
                    "
                  >
                    ▶ {player.social.youtube}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ════════════════════
          시즌 스탯 4분할
      ════════════════════ */}
      <section
        className="
          bg-dark-200
          px-5 md:px-8 lg:px-16
          py-10 md:py-14
          border-b border-kld-red/[0.12]
        "
        aria-label="시즌 통계"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          <StatBlock
            label="Season Max"
            value={`${player.seasonStats.maxDistance}`}
            unit="m"
          />
          <StatBlock
            label="Rank"
            value={`#${player.seasonStats.rank}`}
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
      </section>

      {/* ════════════════════
          하단 탭: 대회 기록 / 장비
      ════════════════════ */}
      <section
        className="
          px-5 md:px-8 lg:px-16
          py-14 md:py-20 lg:py-24
          bg-dark
        "
        aria-label="대회 기록과 장비"
      >
        <ProfileTabs
          equipment={player.equipment}
          results={player.results}
        />
      </section>
    </main>
  );
}

/* ── 시즌 스탯 블록(서브 컴포넌트) ──
   이 페이지 내부에서만 사용하는 간단한 표시 블록이므로
   같은 파일 하단에 두되, export 하지 않는다. */
interface StatBlockProps {
  label: string;
  value: string;
  unit?: string;
}

function StatBlock({ label, value, unit }: StatBlockProps) {
  return (
    <div className="flex flex-col">
      <div className="font-mono text-[10px] tracking-[0.22em] text-gray-mid uppercase mb-2">
        {label}
      </div>
      <div className="font-display text-[clamp(32px,4vw,52px)] leading-none text-white-kld">
        {value}
        {unit ? (
          <span className="font-mono text-[12px] text-gray-mid ml-1">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}
