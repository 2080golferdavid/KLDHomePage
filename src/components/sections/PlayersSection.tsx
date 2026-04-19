import Link from "next/link";
import { BI_FEATURED } from "@/constants/homeData";

/**
 * 이달의 선수 섹션.
 * 4장의 3:4 비율 카드 그리드. 각 카드에는 대형 시드 숫자,
 * 디비전 뱃지(bug), 선수 실루엣 SVG, 그리고 하단의 이름+스탯 오버레이가 있다.
 */
export default function PlayersSection() {
  return (
    <section id="athletes" className="sec reveal">
      <div className="wrap">
        <span className="sec-num">S01 / 06</span>

        <div className="sec-head">
          <div>
            <div className="sec-eyebrow">FEATURED ATHLETES · 이달의 선수</div>
            <h2 className="sec-title">
              HITTERS
              <span className="kr">이달의 선수</span>
            </h2>
          </div>
          <Link href="/players" className="btn btn-secondary">
            VIEW ALL · 선수 전체 →
          </Link>
        </div>

        <div className="players-grid">
          {BI_FEATURED.map((p) => (
            <article
              key={p.id}
              className={`player-card ${p.hi ? "is-hi" : ""}`}
            >
              <div className="bg" aria-hidden="true" />
              <span className="bug">SEED · {p.seed}</span>
              <span className="seed" aria-hidden="true">
                {p.seed}
              </span>
              <AthleteSilhouette />

              <div className="info">
                <div className="div">
                  {p.divEn} · {p.divKr}
                </div>
                <div className="name">
                  {p.name}
                  <span className="kr">{p.kr}</span>
                </div>
                <div className="stats">
                  {p.stats.map((s) => (
                    <div key={s.k}>
                      <div className="v">
                        {s.v}
                        {s.u ? (
                          <span
                            style={{ fontSize: "0.5em", marginLeft: 2 }}
                          >
                            {s.u}
                          </span>
                        ) : null}
                      </div>
                      <div className="k">{s.k}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 선수 실루엣 SVG — 카드 배경 장식용 ── */
function AthleteSilhouette() {
  return (
    <svg
      className="silhouette"
      viewBox="0 0 200 400"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx={100} cy={58} rx={28} ry={32} fill="#fff" />
      <path
        d="M68 100 Q44 160 34 250 Q64 260 100 255 Q138 260 166 250 Q156 160 132 100 Z"
        fill="#fff"
      />
      <path
        d="M70 170 Q22 200 12 240"
        stroke="#fff"
        strokeWidth={20}
        strokeLinecap="round"
      />
      <path
        d="M130 170 Q180 140 198 160"
        stroke="#fff"
        strokeWidth={20}
        strokeLinecap="round"
      />
      <path
        d="M76 255 Q66 320 62 390"
        stroke="#fff"
        strokeWidth={22}
        strokeLinecap="round"
      />
      <path
        d="M124 255 Q134 320 138 390"
        stroke="#fff"
        strokeWidth={22}
        strokeLinecap="round"
      />
    </svg>
  );
}
