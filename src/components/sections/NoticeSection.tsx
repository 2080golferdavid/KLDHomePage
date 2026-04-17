import Link from "next/link";
import { NOTICES } from "@/constants/siteData";

/**
 * 공지사항 섹션
 * 최근 공지 4건을 리스트 형태로 표시한다.
 */
export default function NoticeSection() {
  return (
    <section className="bg-dark-200 py-14 md:py-[72px] lg:py-20 px-5 md:px-8 lg:px-16 reveal" aria-label="공지사항">
      {/* ── 헤더 ── */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div className="font-mono text-[10px] tracking-[0.28em] text-kld-red uppercase flex items-center gap-3 mb-3.5">
            <span className="w-[22px] h-px bg-kld-red shrink-0" aria-hidden="true" />
            Announcements
          </div>
          <div className="font-display text-[clamp(40px,5vw,70px)] tracking-[0.04em] leading-[0.92] text-white-kld">
            공지사항
          </div>
        </div>
        <Link
          href="/notices"
          className="
            font-ui text-[12px] font-semibold tracking-[0.2em] uppercase text-kld-red
            inline-flex items-center gap-2
            border border-kld-red/30 px-5 py-2.5
            hover:bg-kld-red/10 hover:border-kld-red transition-all
            whitespace-nowrap
          "
        >
          전체 공지 보기
        </Link>
      </div>

      {/* ── 공지 리스트 ── */}
      <ul className="border-t border-kld-red/[0.18]" role="list">
        {NOTICES.map((notice, idx) => (
          <li
            key={idx}
            className="
              grid gap-x-4 md:gap-x-6 items-center cursor-pointer
              border-b border-white/[0.05]
              transition-all hover:pl-2.5 md:hover:pl-2.5

              grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-y-1.5
              py-[18px]

              md:grid-cols-[100px_1fr_auto] md:grid-rows-1
              md:py-[22px]
            "
            role="listitem"
          >
            {/* 카테고리 */}
            <span className="font-mono text-[9px] tracking-[0.15em] text-kld-red uppercase">
              {notice.category}
            </span>

            {/* 날짜 (모바일에서 1행 우측에 위치) */}
            <span className="font-mono text-[11px] text-gray-mid whitespace-nowrap md:order-last">
              {notice.date}
            </span>

            {/* 제목 */}
            <span className="text-[13px] md:text-sm font-normal text-white-kld leading-[1.45] col-span-2 md:col-span-1">
              {notice.title}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
