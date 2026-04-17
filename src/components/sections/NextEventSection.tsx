import Link from "next/link";
import { NEXT_EVENT } from "@/constants/siteData";

/**
 * 다음 대회 정보 섹션
 * 왼쪽에 라운드 번호 비주얼, 오른쪽에 상세 정보를 표시한다.
 */
export default function NextEventSection() {
  const event = NEXT_EVENT;

  return (
    <article className="grid grid-cols-1 lg:grid-cols-2 bg-dark-200 min-h-0 lg:min-h-[460px] reveal" aria-label="다음 대회 정보">
      {/* ── 왼쪽: 라운드 번호 비주얼 ── */}
      <div
        className="
          relative flex items-center justify-center overflow-hidden
          min-h-[160px] md:min-h-[200px] p-10 lg:p-[60px]
        "
        style={{
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(196,30,30,0.16) 0%, transparent 60%),
            linear-gradient(135deg, #141414 0%, #0A0A0A 100%)
          `,
        }}
        aria-hidden="true"
      >
        {/* 배경 숫자 */}
        <div
          className="
            absolute right-[-16px] bottom-[-16px]
            font-display text-[clamp(120px,16vw,200px)] leading-none
            text-transparent pointer-events-none
          "
          style={{ WebkitTextStroke: "1px rgba(196,30,30,0.18)" }}
        >
          {event.round}
        </div>
        {/* 중앙 배지 */}
        <div className="relative z-[1] text-center">
          <span className="font-display text-[clamp(64px,8vw,96px)] leading-none text-kld-red block">
            {event.round}TH
          </span>
          <span className="font-ui text-[13px] tracking-[0.22em] text-gray-mid uppercase">
            2025 Season Round
          </span>
        </div>
      </div>

      {/* ── 오른쪽: 대회 상세 정보 ── */}
      <div
        className="
          flex flex-col justify-center
          px-5 md:px-8 lg:px-12 py-8 lg:py-14
          border-t lg:border-t-0 lg:border-l border-kld-red/[0.15]
        "
      >
        <div className="font-mono text-[10px] tracking-[0.24em] text-kld-red uppercase mb-[18px]">
          {event.season}
        </div>

        <h2 className="font-display text-[clamp(32px,3.5vw,46px)] tracking-[0.04em] leading-[1.02] text-white-kld mb-7 whitespace-pre-line">
          {event.title}
        </h2>

        {/* 메타 정보: 날짜, 장소, 경기 형식 */}
        <dl className="flex flex-col gap-3 mb-7">
          {[
            { icon: "📅", strong: event.date, sub: event.dateNote },
            { icon: "📍", strong: event.location, sub: event.locationDetail },
            { icon: "🏆", strong: event.format, sub: event.formatNote },
          ].map((meta) => (
            <div key={meta.icon} className="flex items-center gap-3.5">
              <div
                className="
                  w-[30px] h-[30px] border border-kld-red/[0.28]
                  flex items-center justify-center text-[13px] shrink-0
                "
                aria-hidden="true"
              >
                {meta.icon}
              </div>
              <div className="text-sm text-gray-light font-light">
                <strong className="text-white-kld font-medium block text-sm">
                  {meta.strong}
                </strong>
                {meta.sub}
              </div>
            </div>
          ))}
        </dl>

        {/* 디비전 태그 */}
        <div className="flex gap-1.5 flex-wrap mb-8" role="list" aria-label="참가 디비전">
          {event.divisions.map((div) => (
            <div
              key={div}
              className="
                font-ui text-[11px] font-semibold tracking-[0.14em] uppercase
                px-3 py-1.5 border border-kld-red text-kld-red
                bg-kld-red/[0.12]
              "
              role="listitem"
            >
              {div}
            </div>
          ))}
        </div>

        <Link
          href={event.applyLink}
          className="
            inline-flex items-center justify-center self-start
            font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-white-kld
            bg-kld-red px-9 py-4
            hover:bg-kld-red-light transition-colors
          "
        >
          지금 신청하기 &rarr;
        </Link>
      </div>
    </article>
  );
}
