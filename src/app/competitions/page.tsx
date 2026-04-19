import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CompetitionCard from "@/components/competitions/CompetitionCard";
import {
  getUpcomingCompetitions,
  getPastCompetitions,
} from "@/data/competitions";

export const metadata: Metadata = {
  title: "EVENTS — KLD 대회 일정",
  description:
    "KLD 2025 정규 시즌 예정 대회와 역대 대회 아카이브. 날짜, 장소, 디비전, 신청 정보를 한눈에.",
};

/**
 * 대회(Competitions) 목록 페이지
 * - 예정 대회는 카드 그리드로,
 * - 지난 대회는 행 리스트(.notice-row 패턴)로 표시.
 */
export default async function CompetitionsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingCompetitions(),
    getPastCompetitions(),
  ]);

  return (
    <main>
      <PageHero
        secNum="P · 04"
        eyebrow="EVENTS · 대회 일정"
        titleEn="THE SCHEDULE"
        titleKr="KLD 2025 대회 캘린더"
        lead={
          <>
            예정된 라운드와 역대 대회 아카이브를 한눈에. 각 대회의 참가 디비전,
            장소, 신청 링크를 확인하세요.
            <span className="kr">
              Season rounds, venues, divisions, and apply links in one place.
            </span>
          </>
        }
      />

      {/* UPCOMING */}
      <section className="sec reveal" aria-label="예정된 대회">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-eyebrow">
                UPCOMING — {String(upcoming.length).padStart(2, "0")} · 예정
              </div>
              <h2 className="sec-title">
                NEXT ROUNDS<span className="kr">예정 대회</span>
              </h2>
            </div>
          </div>

          {upcoming.length === 0 ? (
            <p className="kld-caption-kr">
              현재 예정된 대회가 없습니다. 다음 시즌 일정을 곧 발표할 예정입니다.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {upcoming.map((c) => (
                <CompetitionCard key={c.id} competition={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ARCHIVE */}
      <section className="sec sec-alt reveal" aria-label="지난 대회 아카이브">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-eyebrow">
                ARCHIVE — {String(past.length).padStart(2, "0")} · 아카이브
              </div>
              <h2 className="sec-title">
                PAST ROUNDS<span className="kr">지난 대회</span>
              </h2>
            </div>
          </div>

          {past.length === 0 ? (
            <p className="kld-caption-kr">아직 아카이브된 대회가 없습니다.</p>
          ) : (
            <ul className="notice-list">
              {past.map((c) => {
                const top = c.winners?.[0];
                return (
                  <li
                    key={c.id}
                    className="notice-row"
                    style={{
                      gridTemplateColumns: "72px 1fr 220px 90px",
                    }}
                  >
                    <span
                      className="notice-cat"
                      style={{ color: "var(--accent)" }}
                    >
                      R{String(c.round).padStart(2, "0")}
                    </span>
                    <span className="notice-title">
                      {c.title}
                      <span
                        className="kld-caption-mono"
                        style={{
                          display: "block",
                          marginTop: 4,
                          color: "var(--kld-fg-3)",
                        }}
                      >
                        {c.date} · {c.location}
                      </span>
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--kld-font-sans)",
                        fontSize: 13,
                        color: top ? "#fff" : "var(--kld-fg-3)",
                        textAlign: "right",
                      }}
                    >
                      {top ? (
                        <>
                          <span
                            className="kld-caption-mono"
                            style={{ display: "block", marginBottom: 2 }}
                          >
                            TOP · {top.division}
                          </span>
                          {top.name}{" "}
                          <span style={{ color: "var(--accent)" }}>
                            {top.distance}M
                          </span>
                        </>
                      ) : (
                        <span className="kld-caption-mono">기록 없음</span>
                      )}
                    </span>
                    <span style={{ textAlign: "right" }}>
                      {c.resultLink ? (
                        <Link
                          href={c.resultLink}
                          className="btn btn-ghost"
                          style={{ padding: 0 }}
                        >
                          결과 <span className="arrow">→</span>
                        </Link>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
