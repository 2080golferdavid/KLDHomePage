import Link from "next/link";
import { BI_NOTICES } from "@/constants/homeData";

/**
 * 공지사항 섹션.
 * 카테고리 / 제목 / 날짜 3열 그리드. 행 호버 시 좌측 패딩이 늘어나는 모션.
 */
export default function NoticeSection() {
  return (
    <section id="notices" className="sec sec-alt reveal">
      <div className="wrap">
        <span className="sec-num">S01 / 08</span>

        <div className="sec-head">
          <div>
            <div className="sec-eyebrow">ANNOUNCEMENTS · 공지사항</div>
            <h2 className="sec-title">
              NOTICES
              <span className="kr">공지사항</span>
            </h2>
          </div>
          <Link href="/notices" className="btn btn-secondary">
            VIEW ALL · 전체 공지 →
          </Link>
        </div>

        <ul className="notice-list">
          {BI_NOTICES.map((n, i) => (
            <li key={i} className="notice-row">
              <span className="notice-cat">{n.cat}</span>
              <span className="notice-title">{n.title}</span>
              <span className="notice-date">{n.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
