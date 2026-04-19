/* ══════════════════════════════════════════════════════════════
   홈 페이지 전용 이중언어 데이터
   레퍼런스 디자인(reference/designreference0419/app.jsx)의
   NAV / TICKER / RANKINGS / FEATURED / MEDIA / NOTICES / FOOTER 구성.
   이 파일은 홈 섹션 컴포넌트만 사용하며, 기존 siteData.ts 와는 분리되어
   다른 페이지의 동작에 영향을 주지 않는다.
   ══════════════════════════════════════════════════════════════ */

/* ── 타입 ── */

export interface BiNavLink {
  key: string;
  en: string;
  kr: string;
  href: string;
}

export interface BiTickerItem {
  text: string;
  live?: boolean;
}

export interface BiHeroStat {
  k: string;        // 영문 라벨(MONO)
  v: string;        // 값
  u?: string;       // 단위(선택)
  hi?: boolean;     // 강조 여부
}

export interface BiStat {
  v: string;
  u?: string;
  k: string;
  hi?: boolean;
}

export interface BiDivision {
  key: "amateur" | "masters" | "womens" | "open";
  en: string;
  kr: string;
}

export interface BiRankingPlayer {
  rank: number;
  change: "up" | "down" | "same";
  d?: number;         // 변동 폭
  name: string;       // 영문
  kr: string;         // 한글
  initials: string;
  region: string;
  carry: number;      // 미터
  part: string;       // 참가 n/m
  pts: string;        // 포인트
}

export interface BiFeaturedPlayer {
  id: string;
  divEn: string;
  divKr: string;
  name: string;
  kr: string;
  seed: string;
  stats: { k: string; v: string; u?: string }[];
  hi?: boolean;
}

export interface BiMediaItem {
  type: string;
  title: string;
  feat?: boolean;
  video?: boolean;
  tint: number;
}

export interface BiNoticeItem {
  cat: string;
  title: string;
  date: string;
}

export interface BiFooterGroup {
  h: string;
  links: string[];
}

/* ── 데이터 ── */

export const BI_NAV: BiNavLink[] = [
  { key: "home", en: "HOME", kr: "홈", href: "/" },
  { key: "about", en: "ABOUT", kr: "협회", href: "/about" },
  { key: "events", en: "EVENTS", kr: "대회", href: "/competitions" },
  { key: "athletes", en: "ATHLETES", kr: "선수", href: "/players" },
  { key: "rank", en: "RANKINGS", kr: "랭킹", href: "/rankings" },
  { key: "media", en: "MEDIA", kr: "미디어", href: "/media" },
];

export const BI_TICKER: BiTickerItem[] = [
  { text: "LIVE · R2 · M04", live: true },
  { text: "INCHEON · 15:32 KST" },
  { text: "NEXT — PARK J.H. vs LEE S.W." },
  { text: "WIND 4.2 M/S · ENE" },
  { text: "LEADER — KIM D.H. · 432 YDS" },
  { text: "2025 시즌 3라운드 · 최장 381M — 김태훈" },
  { text: "AMATEUR WIN — KIM T.H. 381M" },
  { text: "OPEN WIN — PARK S.M. 395M" },
  { text: "NEXT EVENT — 플렉스골프라운지 × KLD · 06.29" },
];

/* 카운트다운 대상(ISO 8601) */
export const BI_COUNTDOWN_ISO = "2025-06-29T09:00:00";

export const BI_HERO_STATS: BiHeroStat[] = [
  { k: "BALL SPEED · RECORD", v: "228", u: "MPH", hi: true },
  { k: "CARRY · RECORD", v: "432", u: "YDS" },
  { k: "ATHLETES · ENTRIES", v: "214", u: "2025" },
  { k: "ROUNDS · FORMAT", v: "08", u: "SEASON" },
];

export const BI_NEXT_EVENT = {
  round: 4,
  seasonEn: "KLD 2025 REGULAR SEASON",
  seasonKr: "KLD 2025 정규 시즌",
  titleEn1: "FLEX × KLD",
  titleEn2: "LONG DRIVE OPEN",
  titleKr: "플렉스골프라운지 × KLD 장타대회",
  date: "2025.06.29 · SUN",
  dateNote: "시간 추후 공지 예정",
  venue: "FLEX GOLF LOUNGE",
  venueNote: "서울 · 상세 주소 확인",
  format: "INDIVIDUAL + TEAM",
  formatNote: "팀전은 개인전 참가자만 신청 가능",
  divisions: [
    "AMATEUR · 아마추어",
    "MASTERS · 마스터즈",
    "WOMENS · 우먼스",
    "OPEN · 오픈",
  ],
  applyHref: "/apply",
};

export const BI_STATS: BiStat[] = [
  { v: "214", k: "ATHLETES / 시즌 참가" },
  { v: "8", k: "EVENTS / 개최 대회" },
  { v: "387", u: "M", k: "LONGEST CARRY / 최장 비거리", hi: true },
  { v: "04", k: "DIVISIONS / 리그" },
];

export const BI_DIVISIONS: BiDivision[] = [
  { key: "amateur", en: "AMATEUR", kr: "아마추어" },
  { key: "masters", en: "MASTERS", kr: "마스터즈" },
  { key: "womens", en: "WOMENS", kr: "우먼스" },
  { key: "open", en: "OPEN", kr: "오픈" },
];

export const BI_RANKINGS: Record<BiDivision["key"], BiRankingPlayer[]> = {
  amateur: [
    { rank: 1, change: "same", name: "KIM TAE-HUN", kr: "김태훈", initials: "KT", region: "SEOUL", carry: 381, part: "3/3", pts: "1,250" },
    { rank: 2, change: "up", d: 2, name: "LEE JAE-HO", kr: "이재호", initials: "LJ", region: "BUSAN", carry: 373, part: "3/3", pts: "1,140" },
    { rank: 3, change: "down", d: 1, name: "PARK JUN-SEO", kr: "박준서", initials: "PJ", region: "INCHEON", carry: 369, part: "2/3", pts: "980" },
    { rank: 4, change: "up", d: 1, name: "CHOI SEUNG-WOO", kr: "최승우", initials: "CS", region: "DAEGU", carry: 365, part: "3/3", pts: "870" },
    { rank: 5, change: "down", d: 2, name: "HAN MIN-JUN", kr: "한민준", initials: "HM", region: "GWANGJU", carry: 358, part: "2/3", pts: "760" },
  ],
  masters: [
    { rank: 1, change: "same", name: "CHOI BYUNG-HUN", kr: "최병훈", initials: "CB", region: "SEOUL", carry: 368, part: "3/3", pts: "1,080" },
    { rank: 2, change: "up", d: 1, name: "YOON DAE-SIK", kr: "윤대식", initials: "YD", region: "BUSAN", carry: 362, part: "3/3", pts: "1,020" },
    { rank: 3, change: "down", d: 1, name: "KANG HO-JIN", kr: "강호진", initials: "KH", region: "DAEJEON", carry: 355, part: "3/3", pts: "910" },
    { rank: 4, change: "same", name: "SHIN DONG-WOOK", kr: "신동욱", initials: "SD", region: "ULSAN", carry: 351, part: "2/3", pts: "820" },
    { rank: 5, change: "up", d: 3, name: "OH KI-HOON", kr: "오기훈", initials: "OK", region: "DAEGU", carry: 348, part: "3/3", pts: "760" },
  ],
  womens: [
    { rank: 1, change: "same", name: "LEE JI-SU", kr: "이지수", initials: "LJ", region: "SEOUL", carry: 312, part: "3/3", pts: "1,180" },
    { rank: 2, change: "up", d: 1, name: "PARK SO-YEON", kr: "박소연", initials: "PS", region: "BUSAN", carry: 305, part: "3/3", pts: "1,060" },
    { rank: 3, change: "down", d: 1, name: "KIM HYE-RIM", kr: "김혜림", initials: "KH", region: "INCHEON", carry: 299, part: "2/3", pts: "940" },
    { rank: 4, change: "up", d: 2, name: "JUNG EUN-BI", kr: "정은비", initials: "JE", region: "DAEGU", carry: 294, part: "3/3", pts: "860" },
    { rank: 5, change: "same", name: "YOO SE-AH", kr: "유세아", initials: "YS", region: "JEJU", carry: 289, part: "2/3", pts: "720" },
  ],
  open: [
    { rank: 1, change: "same", name: "PARK SUNG-MIN", kr: "박성민", initials: "PS", region: "SEOUL", carry: 395, part: "3/3", pts: "1,320" },
    { rank: 2, change: "up", d: 1, name: "KIM DAE-HYUN", kr: "김대현", initials: "KD", region: "BUSAN", carry: 392, part: "3/3", pts: "1,260" },
    { rank: 3, change: "down", d: 1, name: "LEE SANG-WOO", kr: "이상우", initials: "LS", region: "INCHEON", carry: 388, part: "3/3", pts: "1,140" },
    { rank: 4, change: "up", d: 2, name: "HWANG JIN-HO", kr: "황진호", initials: "HJ", region: "DAEGU", carry: 384, part: "3/3", pts: "1,020" },
    { rank: 5, change: "down", d: 1, name: "RYU MIN-KI", kr: "류민기", initials: "RM", region: "GWANGJU", carry: 379, part: "2/3", pts: "890" },
  ],
};

export const BI_FEATURED: BiFeaturedPlayer[] = [
  { id: "kim-taehun", divEn: "AMATEUR · #1", divKr: "아마추어 1위", name: "KIM TAE-HUN", kr: "김태훈", seed: "01", stats: [{ k: "CARRY · RECORD", v: "381", u: "M" }, { k: "SEASON PTS", v: "1,250" }], hi: true },
  { id: "park-sungmin", divEn: "OPEN · CHAMPION", divKr: "오픈 챔피언", name: "PARK SUNG-MIN", kr: "박성민", seed: "02", stats: [{ k: "CARRY · RECORD", v: "395", u: "M" }, { k: "WINS", v: "03" }] },
  { id: "lee-jisu", divEn: "WOMENS · #1", divKr: "우먼스 1위", name: "LEE JI-SU", kr: "이지수", seed: "03", stats: [{ k: "CARRY · RECORD", v: "312", u: "M" }, { k: "WINS", v: "02" }] },
  { id: "choi-byunghun", divEn: "MASTERS · #1", divKr: "마스터즈 1위", name: "CHOI BYUNG-HUN", kr: "최병훈", seed: "04", stats: [{ k: "CARRY · RECORD", v: "368", u: "M" }, { k: "SEASON PTS", v: "1,080" }] },
];

export const BI_MEDIA: BiMediaItem[] = [
  { type: "HIGHLIGHT · R3", title: "2025 시즌 3라운드\n대회 하이라이트", feat: true, video: true, tint: 0 },
  { type: "PHOTO", title: "광주 쌍암점 대회 포토", tint: 1 },
  { type: "INTERVIEW", title: "챔피언 인터뷰 — 박성민", video: true, tint: 2 },
  { type: "PHOTO", title: "시즌 3 수상 갤러리", tint: 3 },
];

export const BI_NOTICES: BiNoticeItem[] = [
  { cat: "EVENTS · 대회공지", title: "2025 플렉스골프라운지 × KLD 장타대회 참가 신청 안내", date: "2025.05.28" },
  { cat: "RESULTS · 대회결과", title: "2025 시즌 3라운드 S SEVEN × FIRSTONE GOLF 대회 결과 발표", date: "2025.04.14" },
  { cat: "RULES · 규정안내", title: "2025 시즌 디비전 참가 자격 및 리그 규정 개정 안내", date: "2025.03.10" },
  { cat: "SCHEDULE · 시즌일정", title: "KLD 2025 정규 시즌 전체 대회 일정 및 장소 확정 안내", date: "2025.01.15" },
];

export const BI_SPONSORS: string[] = [
  "삼대오백",
  "캐비아그립",
  "타운샌드위치",
  "COMING SOON",
  "COMING SOON",
  "COMING SOON",
];

export const BI_FOOTER_COLS: BiFooterGroup[] = [
  {
    h: "COMPETE · 대회",
    links: ["대회 일정", "대회 신청", "대회 결과", "대회 규정", "역대 대회"],
  },
  {
    h: "ATHLETES · 선수 & 랭킹",
    links: ["선수 프로필", "시즌 랭킹", "최장 비거리 기록", "명예의 전당", "선수 등록"],
  },
  {
    h: "ASSOCIATION · 협회",
    links: ["KLD 소개", "운영진", "개인정보처리방침", "이용약관", "문의하기"],
  },
];
