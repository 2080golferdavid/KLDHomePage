import type { ReactNode } from "react";

/**
 * 페이지 상단 히어로 블록.
 * 홈을 제외한 나머지 페이지(about/apply/media/players/rankings/competitions 등)에서
 * 반복되는 "아이브로 + 영문 타이틀 + 한글 서브 + 리드 카피" 패턴을 공통화한다.
 *
 * 레이아웃은 site.css 의 .sec 토큰에 맞춰 패딩과 하단 2px 액센트 + 1px 헤어라인을 깔고,
 * 우측 상단에 섹션 번호(sec-num)를 노출한다.
 */
interface PageHeroProps {
  /** EYEBROW — 영문 + 한글. 예: "ABOUT KLD · 협회 소개" */
  eyebrow: string;
  /** 큰 제목(영문, 이탤릭 디스플레이) */
  titleEn: string;
  /** 제목 한글 서브. 선택. */
  titleKr?: string;
  /** 본문 리드. 자식으로도 전달 가능. */
  lead?: ReactNode;
  /** 섹션 번호(예: "P · 02"). 선택. */
  secNum?: string;
  /** 히어로 우측에 들어갈 추가 콘텐츠(필터 등). 선택. */
  aside?: ReactNode;
}

export default function PageHero({
  eyebrow,
  titleEn,
  titleKr,
  lead,
  secNum,
  aside,
}: PageHeroProps) {
  return (
    <section
      className="page-hero"
      aria-label={`${titleEn} 페이지 헤더`}
    >
      <div className="wrap page-hero-inner">
        {secNum ? <span className="sec-num page-hero-num">{secNum}</span> : null}

        <div className="page-hero-head">
          <div>
            <div className="sec-eyebrow">{eyebrow}</div>
            <h1 className="sec-title page-hero-title">
              {titleEn}
              {titleKr ? <span className="kr">{titleKr}</span> : null}
            </h1>
            {lead ? <p className="page-hero-lead">{lead}</p> : null}
          </div>
          {aside ? <div className="page-hero-aside">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
