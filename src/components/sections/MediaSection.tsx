import Link from "next/link";
import { MEDIA_ITEMS } from "@/constants/siteData";

/**
 * 미디어 하이라이트 섹션
 * 비디오, 사진 등을 그리드 형태로 표시한다.
 * featured 항목은 2행을 차지한다.
 */
export default function MediaSection() {
  return (
    <section className="bg-dark py-14 md:py-[72px] lg:py-24 px-5 md:px-8 lg:px-16 reveal" aria-label="미디어 하이라이트">
      {/* ── 헤더 ── */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div className="font-mono text-[10px] tracking-[0.28em] text-kld-red uppercase flex items-center gap-3 mb-3.5">
            <span className="w-[22px] h-px bg-kld-red shrink-0" aria-hidden="true" />
            Media &amp; Highlights
          </div>
          <div className="font-display text-[clamp(40px,5vw,70px)] tracking-[0.04em] leading-[0.92] text-white-kld">
            미디어
          </div>
        </div>
        <Link
          href="/media"
          className="
            font-ui text-[12px] font-semibold tracking-[0.2em] uppercase text-kld-red
            inline-flex items-center gap-2
            border border-kld-red/30 px-5 py-2.5
            hover:bg-kld-red/10 hover:border-kld-red transition-all
            whitespace-nowrap
          "
        >
          전체 보기
        </Link>
      </div>

      {/* ── 미디어 그리드 ── */}
      <div
        className="
          grid gap-[3px]
          grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]
          grid-rows-[220px_160px_160px_160px]
          md:grid-rows-[240px_180px_180px]
          lg:grid-rows-[260px_260px]
        "
      >
        {MEDIA_ITEMS.map((item, idx) => (
          <article
            key={idx}
            className={`
              relative overflow-hidden bg-dark-300 cursor-pointer group
              ${item.featured ? "md:col-span-2 lg:col-span-1 lg:row-span-2 md:row-span-1" : ""}
            `}
          >
            {/* 배경 */}
            <div
              className="absolute inset-0 transition-transform duration-400 group-hover:scale-[1.06]"
              style={{
                background: `linear-gradient(135deg, ${
                  idx === 0 ? "#180808" : idx === 1 ? "#140404" : idx === 2 ? "#120404" : "#160404"
                } 0%, ${
                  idx === 0 ? "#0d0505" : idx === 1 ? "#0a0404" : idx === 2 ? "#080303" : "#0a0404"
                } 100%)`,
              }}
              aria-hidden="true"
            />

            {/* 기하학적 패턴 */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10" aria-hidden="true">
              <svg className="w-[58%] h-[58%]" viewBox="0 0 200 200" fill="none">
                {idx === 0 && (
                  <>
                    <circle cx="100" cy="100" r="90" stroke="rgba(196,30,30,1)" strokeWidth="1.5" />
                    <circle cx="100" cy="100" r="58" stroke="rgba(196,30,30,0.5)" strokeWidth="0.8" />
                    <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(196,30,30,0.4)" strokeWidth="0.6" />
                    <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(196,30,30,0.4)" strokeWidth="0.6" />
                  </>
                )}
                {idx === 1 && (
                  <>
                    <rect x="20" y="20" width="160" height="160" stroke="rgba(196,30,30,1)" strokeWidth="1.5" />
                    <rect x="50" y="50" width="100" height="100" stroke="rgba(196,30,30,0.5)" strokeWidth="0.8" />
                  </>
                )}
                {idx === 2 && (
                  <polygon points="100,15 185,185 15,185" stroke="rgba(196,30,30,1)" strokeWidth="1.5" fill="none" />
                )}
                {idx === 3 && (
                  <circle cx="100" cy="100" r="80" stroke="rgba(196,30,30,0.8)" strokeWidth="1.5" strokeDasharray="8 4" />
                )}
              </svg>
            </div>

            {/* 오버레이 그래디언트 */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.28) 55%, transparent 100%)",
              }}
              aria-hidden="true"
            />

            {/* 재생 버튼 (비디오 항목만) */}
            {item.hasVideo && (
              <div
                className="
                  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[52px] h-[52px] border-2 border-kld-red rounded-full
                  flex items-center justify-center
                  text-kld-red text-lg
                  opacity-0 group-hover:opacity-100 transition-opacity
                "
                aria-label="영상 재생"
                role="button"
              >
                ▶
              </div>
            )}

            {/* 콘텐츠 */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="font-mono text-[9px] tracking-[0.24em] text-kld-red uppercase flex items-center gap-[7px] mb-[7px]">
                <span className="w-[5px] h-[5px] rounded-full bg-kld-red" aria-hidden="true" />
                {item.type}
                {item.roundLabel && ` · ${item.roundLabel}`}
              </div>
              <h3
                className={`
                  font-medium text-white-kld leading-[1.4] whitespace-pre-line
                  ${item.featured
                    ? "font-display text-[clamp(22px,2.5vw,30px)] tracking-[0.04em] leading-[1.05]"
                    : "text-sm"
                  }
                `}
              >
                {item.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
