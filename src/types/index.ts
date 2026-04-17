/* ══════════════════════════════════════════
   KLD 프로젝트 공통 타입 정의
   모든 타입을 이 파일에서 관리하고, 필요에 따라 분리한다.
══════════════════════════════════════════ */

/** 네비게이션 링크 항목 */
export interface NavLink {
  label: string;
  href: string;
}

/** 카운트다운 대상 이벤트 */
export interface CountdownEvent {
  name: string;
  date: string; // ISO 8601 형식 (예: "2025-06-29T09:00:00")
}

/** 티커(Ticker)에 표시할 항목 */
export interface TickerItem {
  text: string;
}

/** 대회 디비전(부문) */
export type Division = "아마추어" | "마스터즈" | "우먼스" | "오픈";

/** 다음 대회 정보 */
export interface NextEventData {
  round: number;
  season: string;
  title: string;
  date: string;
  dateNote: string;
  location: string;
  locationDetail: string;
  format: string;
  formatNote: string;
  divisions: Division[];
  applyLink: string;
}

/** 통계 항목 */
export interface StatItem {
  value: string;
  unit?: string;
  label: string;
}

/** 선수 랭킹 정보 */
export interface RankingPlayer {
  rank: number;
  change: "up" | "down" | "same";
  changeAmount?: number;
  name: string;
  initials: string;
  region: string;
  division: Division;
  maxDistance: number;
  participation: string;
  points: string;
}

/** 이달의 선수 카드 정보 */
export interface FeaturedPlayer {
  id: string;
  division: string;
  name: string;
  stats: {
    label: string;
    value: string;
  }[];
  gradient: string;
}

/** 미디어 항목 */
export interface MediaItem {
  type: "HIGHLIGHT" | "PHOTO" | "INTERVIEW";
  roundLabel?: string;
  title: string;
  featured?: boolean;
  hasVideo?: boolean;
}

/** 공지사항 항목 */
export interface NoticeItem {
  category: string;
  title: string;
  date: string;
}

/** 푸터 링크 그룹 */
export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}
