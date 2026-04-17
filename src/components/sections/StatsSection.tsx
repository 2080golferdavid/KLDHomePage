import { STATS } from "@/constants/siteData";

/**
 * 통계 바 섹션
 * 시즌 주요 수치를 빨간 배경 위에 4열 그리드로 표시한다.
 */
export default function StatsSection() {
  return (
    <section className="bg-kld-red reveal" aria-label="시즌 주요 통계">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/20">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-kld-red text-center px-[clamp(20px,3vw,40px)] py-[clamp(32px,4vw,48px)]"
          >
            <span className="font-display text-[clamp(48px,6vw,80px)] leading-none text-white-kld tracking-[0.02em] block">
              {stat.value}
              {stat.unit && (
                <span className="text-[0.5em]">{stat.unit}</span>
              )}
            </span>
            <div className="font-ui text-[clamp(10px,1.1vw,12px)] font-semibold tracking-[0.18em] uppercase text-white/60 mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
