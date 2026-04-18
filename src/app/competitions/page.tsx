import type { Metadata } from "next";
import Link from "next/link";
import CompetitionCard from "@/components/competitions/CompetitionCard";
import {
  getUpcomingCompetitions,
  getPastCompetitions,
} from "@/data/competitions";

/* ── SEO 메타데이터(Metadata) ── */
export const metadata: Metadata = {
  title: "대회 일정 — KLD",
  description:
    "KLD 2025 정규 시즌 예정 대회와 역대 대회 아카이브를 확인하세요. 날짜, 장소, 디비전, 신청 정보를 한눈에 제공합니다.",
};

/**
 * 대회(Competitions) 목록 페이지
 *
 * - 상단: 페이지 헤더
 * - 중단: 예정 대회 카드 그리드(데스크톱 3열 / 태블릿 2열 / 모바일 1열)
 * - 하단: 지난 대회 아카이브 리스트
 *
 * 서버 컴포넌트(Server Component)로 동작한다.
 * `async function` 시그니처이므로 fetcher의 `await`를 그대로 사용할 수 있고,
 * 추후 Supabase 연동 시 page.tsx 코드는 수정할 필요가 없다.
 */
export default async function CompetitionsPage() {
  /* 두 개의 독립적인 fetcher를 병렬로 호출하여 응답 대기 시간을 줄인다. */
  const [upcoming, past] = await Promise.all([
    getUpcomingCompetitions(),
    getPastCompetitions(),
  ]);

  return (
    <main className="pt-nav">
      {/* ════════════════════
          페이지 헤더
      ════════════════════ */}
      <section
        className="
          px-5 md:px-8 lg:px-16
          pt-16 md:pt-20 lg:pt-24
          pb-10 md:pb-14
          border-b border-kld-red/[0.15]
          bg-dark
        "
        aria-label="페이지 소개"
      >
        <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-4">
          KLD Competitions
        </div>
        <h1
          className="
            font-display text-[clamp(40px,6vw,76px)]
            leading-[0.95] tracking-[0.02em]
            text-white-kld mb-5
          "
        >
          대회 일정
        </h1>
        <p className="max-w-[560px] text-[14px] font-light leading-[1.7] text-gray-light">
          KLD 2025 정규 시즌의 예정 대회와 역대 대회 결과를 한눈에 확인할 수 있습니다.
          각 대회의 참가 디비전과 신청 링크를 확인하세요.
        </p>
      </section>

      {/* ════════════════════
          예정 대회(Upcoming)
      ════════════════════ */}
      <section
        className="px-5 md:px-8 lg:px-16 py-14 md:py-20 lg:py-24 bg-dark"
        aria-label="예정된 대회"
      >
        <header className="flex items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <div className="font-mono text-[10px] tracking-[0.24em] text-kld-red uppercase mb-3">
              Upcoming — {String(upcoming.length).padStart(2, "0")}
            </div>
            <h2
              className="
                font-display text-[clamp(26px,3.2vw,40px)]
                tracking-[0.03em] leading-[1.05]
                text-white-kld
              "
            >
              예정된 대회
            </h2>
          </div>
        </header>

        {upcoming.length === 0 ? (
          <p className="text-gray-mid text-sm font-light">
            현재 예정된 대회가 없습니다. 다음 시즌 일정을 곧 발표할 예정입니다.
          </p>
        ) : (
          <div
            className="
              grid gap-5 md:gap-6
              grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            "
          >
            {upcoming.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        )}
      </section>

      {/* ════════════════════
          지난 대회 아카이브(Past)
      ════════════════════ */}
      <section
        className="
          bg-dark-200
          px-5 md:px-8 lg:px-16
          py-14 md:py-20 lg:py-24
          border-t border-kld-red/[0.12]
        "
        aria-label="지난 대회 아카이브"
      >
        <header className="flex items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <div className="font-mono text-[10px] tracking-[0.24em] text-kld-red uppercase mb-3">
              Archive — {String(past.length).padStart(2, "0")}
            </div>
            <h2
              className="
                font-display text-[clamp(26px,3.2vw,40px)]
                tracking-[0.03em] leading-[1.05]
                text-white-kld
              "
            >
              지난 대회
            </h2>
          </div>
        </header>

        {past.length === 0 ? (
          <p className="text-gray-mid text-sm font-light">
            아직 아카이브된 대회가 없습니다.
          </p>
        ) : (
          <ul
            className="
              flex flex-col
              divide-y divide-white/[0.06]
              border-y border-white/[0.06]
            "
          >
            {past.map((competition) => {
              /* 지난 대회에서 1위(가장 먼 비거리) 우승자를 미리 추출한다.
                 데이터는 이미 distance 내림차순으로 정렬되어 있다. */
              const topWinner = competition.winners?.[0];

              return (
                <li
                  key={competition.id}
                  className="
                    grid items-center gap-4 md:gap-6
                    grid-cols-[56px_1fr_auto]
                    md:grid-cols-[72px_1fr_160px_auto]
                    py-5 md:py-6
                    hover:bg-white/[0.02] transition-colors
                  "
                >
                  {/* 라운드 번호 */}
                  <div
                    className="
                      font-display text-[20px] md:text-[26px]
                      text-kld-red leading-none
                      tracking-[0.04em]
                    "
                  >
                    R{String(competition.round).padStart(2, "0")}
                  </div>

                  {/* 타이틀 + 날짜·장소 */}
                  <div className="min-w-0">
                    <div className="font-ui text-[14px] md:text-[15px] font-semibold text-white-kld truncate">
                      {competition.title}
                    </div>
                    <div className="font-mono text-[11px] tracking-[0.08em] text-gray-mid mt-1 truncate">
                      {competition.date} · {competition.location}
                    </div>
                  </div>

                  {/* 우승자 요약 — 태블릿 이상에서만 표시 */}
                  <div className="hidden md:flex flex-col items-end text-right">
                    {topWinner ? (
                      <>
                        <div className="font-mono text-[10px] tracking-[0.18em] text-gray-mid uppercase mb-0.5">
                          Top · {topWinner.division}
                        </div>
                        <div className="font-ui text-[13px] font-semibold text-white-kld">
                          {topWinner.name}{" "}
                          <span className="text-kld-red font-bold">
                            {topWinner.distance}m
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-mid text-xs">기록 없음</div>
                    )}
                  </div>

                  {/* 결과 상세 링크 */}
                  {competition.resultLink ? (
                    <Link
                      href={competition.resultLink}
                      className="
                        font-ui text-[11px] font-bold tracking-[0.2em] uppercase
                        text-gray-light hover:text-kld-red transition-colors
                        whitespace-nowrap
                      "
                      aria-label={`${competition.title} 결과 상세 보기`}
                    >
                      결과 &rarr;
                    </Link>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
