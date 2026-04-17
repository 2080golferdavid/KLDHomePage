import Link from "next/link";
import { FOOTER_LINKS } from "@/constants/siteData";

/**
 * 사이트 하단 푸터(Footer)
 * - 데스크탑(1024px 이상): 4열 그리드 — 브랜드 1.2fr + 링크 그룹 3열
 * - 태블릿(768~1023px): 2열 그리드 — 브랜드는 첫 칸에만 위치
 * - 모바일(767px 이하): 브랜드 영역이 전체 폭(col-span-2)을 차지하고,
 *   아래에 링크 그룹 3개가 2열로 배치된다.
 */
export default function Footer() {
  return (
    <footer
      className="bg-[#050505] border-t border-kld-red/[0.14] px-5 md:px-8 lg:px-16 pt-16 pb-10"
      role="contentinfo"
    >
      {/* ── 상단: 브랜드 + 링크 그룹 ── */}
      <div
        className="
          grid grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]
          gap-7 md:gap-9 lg:gap-12
          pb-12 border-b border-white/[0.06] mb-8
        "
      >
        {/* 브랜드 영역 — 모바일에서만 두 칸 전체(col-span-2)를 차지한다. */}
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-[30px] tracking-[0.1em] text-white-kld mb-3.5">
            KLD
          </div>
          <p className="text-[13px] font-light text-gray-mid leading-[1.7] mb-6">
            한국 장타 스포츠의 표준을 세우는
            <br />
            Korea Long Drive Association
          </p>
          {/* 소셜 미디어 버튼 */}
          <div className="flex gap-2.5" aria-label="소셜 미디어">
            <a
              href="#"
              className="
                w-9 h-9 border border-kld-red/[0.28]
                flex items-center justify-center
                text-gray-mid text-sm
                hover:border-kld-red hover:text-kld-red transition-colors
              "
              aria-label="유튜브"
            >
              ▶
            </a>
            <a
              href="#"
              className="
                w-9 h-9 border border-kld-red/[0.28]
                flex items-center justify-center
                text-gray-mid text-sm
                hover:border-kld-red hover:text-kld-red transition-colors
              "
              aria-label="인스타그램"
            >
              ◎
            </a>
            <a
              href="#"
              className="
                w-9 h-9 border border-kld-red/[0.28]
                flex items-center justify-center
                text-gray-mid text-sm
                hover:border-kld-red hover:text-kld-red transition-colors
              "
              aria-label="카카오"
            >
              ✦
            </a>
          </div>
        </div>

        {/* 링크 그룹 */}
        {FOOTER_LINKS.map((group) => (
          <div key={group.title}>
            <div
              className="
                font-ui text-[10px] font-bold
                tracking-[0.24em] uppercase text-kld-red mb-[18px]
              "
            >
              {group.title}
            </div>
            <ul className="flex flex-col gap-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
                      text-[13px] font-light text-gray-mid
                      hover:text-white-kld transition-colors
                    "
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── 하단: 저작권 + 연락처 ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="font-mono text-[10px] tracking-[0.08em] text-gray-kld">
          &copy; 2025 KOREA LONG DRIVE ASSOCIATION. ALL RIGHTS RESERVED.
        </div>
        <div className="font-mono text-[10px] tracking-[0.08em] text-gray-kld">
          대표: 박경현 · kld2024@naver.com · 010-9916-8117
        </div>
      </div>
    </footer>
  );
}
