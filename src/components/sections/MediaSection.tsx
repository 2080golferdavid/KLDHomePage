import Link from "next/link";
import { BI_MEDIA } from "@/constants/homeData";

/**
 * 미디어/하이라이트 섹션.
 * 큰 feat 카드(2행 span) + 작은 3개 카드로 구성된 방송형 그리드.
 * 각 카드에는 상단 라벨, 가운데 기하 패턴, 비디오면 중앙 재생 버튼이 떠오른다.
 */
export default function MediaSection() {
  return (
    <section id="media" className="sec reveal">
      <div className="wrap">
        <span className="sec-num">S01 / 07</span>

        <div className="sec-head">
          <div>
            <div className="sec-eyebrow">MEDIA &amp; HIGHLIGHTS · 미디어</div>
            <h2 className="sec-title">
              BROADCAST
              <span className="kr">미디어</span>
            </h2>
          </div>
          <Link href="/media" className="btn btn-secondary">
            VIEW ALL MEDIA · 전체 →
          </Link>
        </div>

        <div className="media-grid">
          {BI_MEDIA.map((m, i) => (
            <article key={i} className={`media-card ${m.feat ? "feat" : ""}`}>
              <div
                className="bg"
                style={{
                  background: "linear-gradient(135deg, #151820 0%, #0B0B0E 100%)",
                }}
                aria-hidden="true"
              />
              <MediaPattern tint={m.tint} />
              <div className="overlay" aria-hidden="true" />

              {m.video ? (
                <div className="play" aria-label="재생 · Play">
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="6,4 22,12 6,20" />
                  </svg>
                </div>
              ) : null}

              <div className="info">
                <div className="type">{m.type}</div>
                <h3 className="title">{m.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 카드 배경 장식 — 4가지 기하 패턴을 tint 값에 따라 선택 ── */
function MediaPattern({ tint }: { tint: number }) {
  const shapes = [
    (
      <g key="0">
        <circle
          cx={100}
          cy={100}
          r={90}
          stroke="var(--accent)"
          strokeWidth={1.2}
          fill="none"
          opacity={0.7}
        />
        <circle
          cx={100}
          cy={100}
          r={58}
          stroke="var(--accent)"
          strokeWidth={0.6}
          fill="none"
          opacity={0.5}
        />
        <line
          x1={10}
          y1={100}
          x2={190}
          y2={100}
          stroke="var(--accent)"
          strokeWidth={0.5}
          opacity={0.6}
        />
        <line
          x1={100}
          y1={10}
          x2={100}
          y2={190}
          stroke="var(--accent)"
          strokeWidth={0.5}
          opacity={0.6}
        />
      </g>
    ),
    (
      <g key="1">
        <rect
          x={20}
          y={20}
          width={160}
          height={160}
          stroke="var(--accent)"
          strokeWidth={1.2}
          fill="none"
          opacity={0.7}
        />
        <rect
          x={50}
          y={50}
          width={100}
          height={100}
          stroke="var(--accent)"
          strokeWidth={0.6}
          fill="none"
          opacity={0.5}
        />
      </g>
    ),
    (
      <g key="2">
        <polygon
          points="100,15 185,185 15,185"
          stroke="var(--accent)"
          strokeWidth={1.2}
          fill="none"
          opacity={0.7}
        />
      </g>
    ),
    (
      <g key="3">
        <circle
          cx={100}
          cy={100}
          r={80}
          stroke="var(--accent)"
          strokeWidth={1.2}
          fill="none"
          strokeDasharray="8 4"
          opacity={0.7}
        />
      </g>
    ),
  ];

  return (
    <svg
      width="58%"
      height="58%"
      viewBox="0 0 200 200"
      style={{ position: "absolute", top: "20%", left: "20%", opacity: 0.35 }}
      aria-hidden="true"
    >
      {shapes[tint % 4]}
    </svg>
  );
}
