import Link from "next/link";
import { BI_NEXT_EVENT } from "@/constants/homeData";

/**
 * 다음 대회 섹션 — 좌측 라운드 비주얼 + 우측 상세 정보의 스플릿 카드.
 * 좌측에는 라운드 번호가 대형 아웃라인 숫자로, 우측에는 시즌/제목/일정/장소/포맷과
 * 디비전 칩(chip) + 신청 CTA 버튼이 배치된다.
 */
export default function NextEventSection() {
  const e = BI_NEXT_EVENT;

  return (
    <section id="events" className="sec reveal">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <div className="sec-eyebrow">NEXT EVENT · 다음 대회</div>
            <h2 className="sec-title">
              ROUND 04
              <span className="kr">4라운드</span>
            </h2>
          </div>
        </div>
        <span className="sec-num">S01 / 04</span>

        <article className="next-event">
          <div className="next-event-vis">
            <div className="next-event-backnum" aria-hidden="true">
              {e.round}
            </div>
            <div className="next-event-round">
              <span className="big">R{String(e.round).padStart(2, "0")}</span>
              <div className="sub">2025 SEASON · ROUND</div>
            </div>
          </div>

          <div className="next-event-body">
            <div className="next-event-season">
              {e.seasonEn}{" "}
              <span style={{ color: "var(--kld-fg-3)", marginLeft: 8 }}>
                / {e.seasonKr}
              </span>
            </div>

            <h3 className="next-event-title">
              {e.titleEn1}
              <br />
              {e.titleEn2}
              <span className="kr">{e.titleKr}</span>
            </h3>

            <div className="next-event-meta">
              <div className="meta-row">
                <div className="meta-icon" aria-hidden="true">
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x={3} y={4} width={18} height={18} rx={0} />
                    <path d="M8 2v4M16 2v4M3 10h18" />
                  </svg>
                </div>
                <div>
                  <span className="strong">{e.date}</span>
                  <span className="note">{e.dateNote}</span>
                </div>
              </div>

              <div className="meta-row">
                <div className="meta-icon" aria-hidden="true">
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 22s-7-7.5-7-13a7 7 0 0 1 14 0c0 5.5-7 13-7 13z" />
                    <circle cx={12} cy={9} r={2.5} />
                  </svg>
                </div>
                <div>
                  <span className="strong">{e.venue}</span>
                  <span className="note">{e.venueNote}</span>
                </div>
              </div>

              <div className="meta-row">
                <div className="meta-icon" aria-hidden="true">
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M6 3h12v4a6 6 0 0 1-12 0V3z" />
                    <path d="M6 5H2v2a4 4 0 0 0 4 4M18 5h4v2a4 4 0 0 1-4 4M9 21h6M12 13v8" />
                  </svg>
                </div>
                <div>
                  <span className="strong">{e.format}</span>
                  <span className="note">{e.formatNote}</span>
                </div>
              </div>
            </div>

            <div className="divisions">
              {e.divisions.map((d) => (
                <span key={d} className="div-chip">
                  {d}
                </span>
              ))}
            </div>

            <Link href={e.applyHref} className="btn btn-primary btn-lg">
              지금 신청하기 · APPLY NOW <span className="arrow">→</span>
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
