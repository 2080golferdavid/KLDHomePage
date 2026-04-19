import { BI_STATS } from "@/constants/homeData";

/**
 * 스탯 스트립 — 시즌 핵심 수치를 액센트 컬러(레인지 그린) 전면에 큰 숫자로 노출.
 * 4개 셀(참가 선수, 개최 대회, 최장 비거리, 디비전 수)을 균등 그리드로 배치.
 */
export default function StatsSection() {
  return (
    <section className="stats-strip reveal" aria-label="시즌 핵심 지표">
      <div className="stats-strip-grid">
        {BI_STATS.map((s, i) => (
          <div key={i} className="stats-strip-cell">
            <div className="v">
              {s.v}
              {s.u ? <sub>{s.u}</sub> : null}
            </div>
            <div className="k">{s.k}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
