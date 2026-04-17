import { FEATURED_PLAYERS } from "@/constants/siteData";

/**
 * 이달의 선수 섹션
 * 4명의 선수 카드를 그리드로 표시한다.
 * 각 카드에는 실루엣 SVG와 선수 정보가 포함된다.
 */
export default function PlayersSection() {
  return (
    <section className="bg-dark-200 py-14 md:py-[72px] lg:py-24 px-5 md:px-8 lg:px-16 reveal" aria-label="이달의 선수">
      {/* 섹션 라벨 */}
      <div className="font-mono text-[10px] tracking-[0.28em] text-kld-red uppercase flex items-center gap-3 mb-3.5">
        <span className="w-[22px] h-px bg-kld-red shrink-0" aria-hidden="true" />
        Featured Athletes
      </div>
      <div className="font-display text-[clamp(40px,5vw,70px)] tracking-[0.04em] leading-[0.92] text-white-kld mb-12">
        이달의 선수
      </div>

      {/* ── 선수 카드 그리드 ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-kld-red/10">
        {FEATURED_PLAYERS.map((player, idx) => (
          <article
            key={player.id}
            className="
              relative overflow-hidden cursor-pointer
              aspect-[3/4] flex flex-col justify-end
              bg-dark-200 group
            "
          >
            {/* 배경 그래디언트 */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${player.gradient} transition-transform duration-500 group-hover:scale-105`}
              aria-hidden="true"
            />

            {/* 배경 넘버 */}
            <div
              className="
                absolute top-4 right-4
                font-display text-[clamp(48px,6vw,80px)] leading-none
                text-kld-red/[0.08] pointer-events-none
              "
              aria-hidden="true"
            >
              {String(idx + 1).padStart(2, "0")}
            </div>

            {/* 실루엣 SVG */}
            <svg
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[72%] opacity-[0.14] group-hover:opacity-[0.22] transition-opacity"
              viewBox="0 0 200 400"
              fill="none"
              aria-hidden="true"
            >
              <ellipse cx="100" cy="60" rx="30" ry="35" fill="white" />
              <path d="M70 100 Q40 160 30 250 Q60 260 100 255 Q140 260 170 250 Q160 160 130 100 Z" fill="white" />
              <path d="M70 170 Q20 200 10 240" stroke="white" strokeWidth="20" strokeLinecap="round" />
              <path d="M130 170 Q180 140 200 160" stroke="white" strokeWidth="20" strokeLinecap="round" />
              <path d="M75 255 Q65 320 60 390" stroke="white" strokeWidth="22" strokeLinecap="round" />
              <path d="M125 255 Q135 320 140 390" stroke="white" strokeWidth="22" strokeLinecap="round" />
            </svg>

            {/* 선수 정보 (하단 그래디언트 위) */}
            <div
              className="relative z-[2] p-[18px]"
              style={{
                background: "linear-gradient(to top, rgba(8,8,8,0.98) 0%, rgba(8,8,8,0.65) 60%, transparent 100%)",
              }}
            >
              <div className="font-mono text-[8px] tracking-[0.22em] text-kld-red uppercase mb-[5px]">
                {player.division}
              </div>
              <div className="font-display text-[clamp(22px,2.5vw,28px)] tracking-[0.04em] text-white-kld leading-none mb-2">
                {player.name}
              </div>
              <div className="flex gap-3.5">
                {player.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="font-display text-lg text-kld-red leading-none">
                      {stat.value}
                    </span>
                    <span className="font-mono text-[8px] tracking-[0.14em] text-gray-mid uppercase">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
