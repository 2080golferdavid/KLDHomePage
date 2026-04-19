import Link from "next/link";
import type { Competition } from "@/types";

/* ── Props 타입 ── */
interface CompetitionCardProps {
  competition: Competition;
}

/**
 * 예정된 대회 카드.
 * 레퍼런스의 `.panel` 틀 + 방송형 헤더(라운드 스탬프 + 시즌 라벨)를 조합.
 */
export default function CompetitionCard({
  competition,
}: CompetitionCardProps) {
  return (
    <article
      className="panel reveal"
      aria-label={`${competition.title} 대회`}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "28px 24px 24px",
        borderTop: "2px solid var(--accent)",
        gap: 0,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            fontFamily: "var(--kld-font-display)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 32,
            color: "var(--accent)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          R{String(competition.round).padStart(2, "0")}
        </div>
        <div
          className="kld-caption-mono"
          style={{ textAlign: "right", color: "var(--kld-fg-3)" }}
        >
          {competition.season}
        </div>
      </header>

      <h3
        style={{
          fontFamily: "var(--kld-font-sans)",
          fontSize: 18,
          fontWeight: 600,
          color: "#fff",
          lineHeight: 1.3,
          margin: "0 0 18px",
        }}
      >
        {competition.title}
      </h3>

      <dl
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
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
            <dt className="sr-only">일정</dt>
            <dd
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                margin: 0,
              }}
            >
              {competition.date}
            </dd>
            {competition.dateNote ? (
              <dd
                style={{
                  color: "var(--kld-fg-3)",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {competition.dateNote}
              </dd>
            ) : null}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
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
            <dt className="sr-only">장소</dt>
            <dd
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                margin: 0,
              }}
            >
              {competition.location}
            </dd>
            {competition.locationDetail ? (
              <dd
                style={{
                  color: "var(--kld-fg-3)",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {competition.locationDetail}
              </dd>
            ) : null}
          </div>
        </div>
      </dl>

      <div className="divisions" aria-label="참가 디비전">
        {competition.divisions.map((d) => (
          <span key={d} className="div-chip">
            {d}
          </span>
        ))}
      </div>

      {competition.applyLink ? (
        <Link
          href={competition.applyLink}
          className="btn btn-primary"
          style={{ marginTop: "auto" }}
        >
          지금 신청하기 <span className="arrow">→</span>
        </Link>
      ) : null}
    </article>
  );
}
