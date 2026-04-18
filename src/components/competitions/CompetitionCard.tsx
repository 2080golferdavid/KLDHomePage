import Link from "next/link";
import type { Competition } from "@/types";

/* ── Props 타입 (컴포넌트 바로 위에 배치) ── */
interface CompetitionCardProps {
  competition: Competition;
}

/**
 * 예정된 대회(Competition)를 표시하는 카드(Card) 컴포넌트
 *
 * 구성:
 * - 상단: 라운드 배지 + 시즌 라벨
 * - 타이틀
 * - 메타(일정, 장소)
 * - 디비전 태그 목록
 * - 하단: 신청 버튼(applyLink가 있을 때만 렌더링)
 */
export default function CompetitionCard({ competition }: CompetitionCardProps) {
  return (
    <article
      className="
        flex flex-col bg-dark-200
        border border-kld-red/[0.15]
        p-6 md:p-7
        hover:border-kld-red/40 transition-colors
        reveal
      "
      aria-label={`${competition.title} 대회`}
    >
      {/* ── 상단: 라운드 배지 + 시즌 ── */}
      <header className="flex items-center justify-between mb-5 gap-3">
        <div
          className="
            font-display text-[22px] leading-none text-kld-red
            border border-kld-red/40 px-2.5 py-1.5
            tracking-[0.04em]
          "
          aria-hidden="true"
        >
          R{String(competition.round).padStart(2, "0")}
        </div>
        <div className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase text-right">
          {competition.season}
        </div>
      </header>

      {/* ── 타이틀 ── */}
      <h3
        className="
          font-display text-[clamp(20px,2vw,26px)]
          tracking-[0.03em] leading-[1.15]
          text-white-kld mb-5
        "
      >
        {competition.title}
      </h3>

      {/* ── 메타 정보(일정 / 장소) ── */}
      <dl className="flex flex-col gap-3 mb-6 text-sm">
        {/* 일정 */}
        <div className="flex items-start gap-3">
          <span
            className="
              w-7 h-7 border border-kld-red/[0.28]
              flex items-center justify-center text-[12px] shrink-0
            "
            aria-hidden="true"
          >
            📅
          </span>
          <div>
            <dt className="sr-only">일정</dt>
            <dd className="text-white-kld font-medium leading-tight">
              {competition.date}
            </dd>
            {competition.dateNote ? (
              <dd className="text-gray-mid text-[12px] font-light mt-0.5">
                {competition.dateNote}
              </dd>
            ) : null}
          </div>
        </div>

        {/* 장소 */}
        <div className="flex items-start gap-3">
          <span
            className="
              w-7 h-7 border border-kld-red/[0.28]
              flex items-center justify-center text-[12px] shrink-0
            "
            aria-hidden="true"
          >
            📍
          </span>
          <div>
            <dt className="sr-only">장소</dt>
            <dd className="text-white-kld font-medium leading-tight">
              {competition.location}
            </dd>
            {competition.locationDetail ? (
              <dd className="text-gray-mid text-[12px] font-light mt-0.5">
                {competition.locationDetail}
              </dd>
            ) : null}
          </div>
        </div>
      </dl>

      {/* ── 디비전 태그 ── */}
      <div
        className="flex gap-1.5 flex-wrap mb-7"
        role="list"
        aria-label="참가 디비전"
      >
        {competition.divisions.map((div) => (
          <div
            key={div}
            className="
              font-ui text-[10px] font-semibold tracking-[0.14em] uppercase
              px-2.5 py-1 border border-kld-red/60 text-kld-red
              bg-kld-red/[0.08]
            "
            role="listitem"
          >
            {div}
          </div>
        ))}
      </div>

      {/* ── 하단: 신청 버튼(예정 대회에만 존재) ── */}
      {competition.applyLink ? (
        <Link
          href={competition.applyLink}
          className="
            mt-auto inline-flex items-center justify-center
            font-ui text-[12px] font-bold tracking-[0.22em] uppercase text-white-kld
            bg-kld-red px-6 py-3
            hover:bg-kld-red-light transition-colors
          "
        >
          지금 신청하기 &rarr;
        </Link>
      ) : null}
    </article>
  );
}
