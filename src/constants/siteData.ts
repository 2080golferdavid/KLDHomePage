import type {
  NavLink,
  CountdownEvent,
  TickerItem,
  NextEventData,
  StatItem,
  RankingPlayer,
  FeaturedPlayer,
  MediaItem,
  NoticeItem,
  FooterLinkGroup,
} from "@/types";

/* ══════════════════════════════════════════
   사이트 전체에서 사용하는 정적 데이터
   API 연동 전까지 이 파일의 목(Mock) 데이터를 사용한다.
══════════════════════════════════════════ */

/** 네비게이션 메뉴 */
export const NAV_LINKS: NavLink[] = [
  { label: "협회", href: "/about" },
  { label: "대회", href: "/competitions" },
  { label: "선수", href: "/players" },
  { label: "랭킹", href: "/rankings" },
  { label: "미디어", href: "/media" },
];

/** 히어로 카운트다운 대상 이벤트 */
export const COUNTDOWN_EVENT: CountdownEvent = {
  name: "플렉스골프라운지 × KLD",
  date: "2025-06-29T09:00:00",
};

/** 티커 텍스트 목록 */
export const TICKER_ITEMS: TickerItem[] = [
  { text: "2025 시즌 3라운드" },
  { text: "아마추어 우승 — 김태훈 381m" },
  { text: "오픈 우승 — 박성민 395m" },
  { text: "우먼스 우승 — 이지수 312m" },
  { text: "마스터즈 우승 — 최병훈 368m" },
  { text: "NEXT: 플렉스골프라운지 × KLD — 06.29" },
];

/** 다음 대회 정보 */
export const NEXT_EVENT: NextEventData = {
  round: 4,
  season: "KLD 2025 정규 시즌",
  title: "플렉스골프라운지\n× KLD 장타대회",
  date: "2025년 6월 29일 (일)",
  dateNote: "시간 추후 공지 예정",
  location: "플렉스골프라운지",
  locationDetail: "서울 · 상세 주소 확인",
  format: "개인전 + 팀 대항전",
  formatNote: "팀전은 개인전 참가자만 신청 가능",
  divisions: ["아마추어", "마스터즈", "우먼스", "오픈"],
  applyLink: "/apply",
};

/** 통계 데이터 */
export const STATS: StatItem[] = [
  { value: "214", label: "2025 시즌 참가 선수" },
  { value: "8", label: "올해 개최 대회 수" },
  { value: "387", unit: "m", label: "시즌 최장 비거리 기록" },
  { value: "4", label: "디비전 / 리그" },
];

/** 랭킹 데이터 — 아마추어 디비전 */
export const RANKINGS_AMATEUR: RankingPlayer[] = [
  {
    rank: 1,
    change: "same",
    name: "김태훈",
    initials: "KT",
    region: "SEOUL",
    division: "아마추어",
    maxDistance: 381,
    participation: "3 / 3",
    points: "1,250",
  },
  {
    rank: 2,
    change: "up",
    changeAmount: 2,
    name: "이재호",
    initials: "LJ",
    region: "BUSAN",
    division: "아마추어",
    maxDistance: 373,
    participation: "3 / 3",
    points: "1,140",
  },
  {
    rank: 3,
    change: "down",
    changeAmount: 1,
    name: "박준서",
    initials: "PJ",
    region: "INCHEON",
    division: "아마추어",
    maxDistance: 369,
    participation: "2 / 3",
    points: "980",
  },
  {
    rank: 4,
    change: "up",
    changeAmount: 1,
    name: "최승우",
    initials: "CS",
    region: "DAEGU",
    division: "아마추어",
    maxDistance: 365,
    participation: "3 / 3",
    points: "870",
  },
  {
    rank: 5,
    change: "down",
    changeAmount: 2,
    name: "한민준",
    initials: "HM",
    region: "GWANGJU",
    division: "아마추어",
    maxDistance: 358,
    participation: "2 / 3",
    points: "760",
  },
];

/** 이달의 선수 카드 */
export const FEATURED_PLAYERS: FeaturedPlayer[] = [
  {
    id: "kim-taehun",
    division: "아마추어 · 1위",
    name: "김태훈",
    stats: [
      { label: "시즌 최장", value: "381m" },
      { label: "포인트", value: "1,250" },
    ],
    gradient: "from-[#1a0404] to-[#080303]",
  },
  {
    id: "park-sungmin",
    division: "오픈 · 우승자",
    name: "박성민",
    stats: [
      { label: "시즌 최장", value: "395m" },
      { label: "우승", value: "3회" },
    ],
    gradient: "from-[#150404] to-[#060202]",
  },
  {
    id: "lee-jisu",
    division: "우먼스 · 1위",
    name: "이지수",
    stats: [
      { label: "시즌 최장", value: "312m" },
      { label: "우승", value: "2회" },
    ],
    gradient: "from-[#180404] to-[#080303]",
  },
  {
    id: "choi-byunghun",
    division: "마스터즈 · 1위",
    name: "최병훈",
    stats: [
      { label: "시즌 최장", value: "368m" },
      { label: "포인트", value: "1,080" },
    ],
    gradient: "from-[#160404] to-[#070303]",
  },
];

/** 미디어 항목 */
export const MEDIA_ITEMS: MediaItem[] = [
  {
    type: "HIGHLIGHT",
    roundLabel: "3RD ROUND",
    title: "2025 시즌 3라운드\n대회 하이라이트 영상",
    featured: true,
    hasVideo: true,
  },
  {
    type: "PHOTO",
    title: "광주 쌍암점 대회 포토",
  },
  {
    type: "INTERVIEW",
    title: "챔피언 인터뷰",
    hasVideo: true,
  },
  {
    type: "PHOTO",
    title: "시즌 3 수상 갤러리",
  },
];

/** 공지사항 목록 */
export const NOTICES: NoticeItem[] = [
  {
    category: "대회공지",
    title: "2025 플렉스골프라운지 × KLD 장타대회 참가 신청 안내",
    date: "2025.05.28",
  },
  {
    category: "대회결과",
    title: "2025 시즌 3라운드 S SEVEN × FIRSTONE GOLF 대회 결과 발표",
    date: "2025.04.14",
  },
  {
    category: "규정안내",
    title: "2025 시즌 디비전 참가 자격 및 리그 규정 개정 안내",
    date: "2025.03.10",
  },
  {
    category: "시즌일정",
    title: "KLD 2025 정규 시즌 전체 대회 일정 및 장소 확정 안내",
    date: "2025.01.15",
  },
];

/** 푸터 링크 */
export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: "대회",
    links: [
      { label: "대회 일정", href: "/competitions" },
      { label: "대회 신청", href: "/apply" },
      { label: "대회 결과", href: "/results" },
      { label: "대회 규정", href: "/rules" },
      { label: "역대 대회", href: "/archive" },
    ],
  },
  {
    title: "선수 & 랭킹",
    links: [
      { label: "선수 프로필", href: "/players" },
      { label: "시즌 랭킹", href: "/rankings" },
      { label: "최장 비거리 기록", href: "/records" },
      { label: "명예의 전당", href: "/hall-of-fame" },
      { label: "선수 등록", href: "/register" },
    ],
  },
  {
    title: "협회",
    links: [
      { label: "KLD 소개", href: "/about" },
      { label: "운영진", href: "/team" },
      { label: "개인정보처리방침", href: "/privacy" },
      { label: "이용약관", href: "/terms" },
      { label: "문의하기", href: "/contact" },
    ],
  },
];
