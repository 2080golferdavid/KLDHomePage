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

/** 대회 상태(Status) — 예정/지난 */
export type CompetitionStatus = "upcoming" | "past";

/** 지난 대회의 디비전별 우승자 */
export interface CompetitionWinner {
  division: Division;
  name: string;
  distance: number; // 미터(m) 단위
}

/**
 * 대회(Competition) — 예정/지난 대회 공용 타입
 * 예정 대회는 `applyLink`, 지난 대회는 `winners`/`resultLink`를 채운다.
 */
export interface Competition {
  id: string;
  round: number;
  season: string;
  title: string;
  /** 화면 표시용 날짜 문자열 (예: "2025년 6월 29일 (일)") */
  date: string;
  /** 정렬/비교용 ISO 8601 문자열 */
  dateISO: string;
  dateNote?: string;
  location: string;
  locationDetail?: string;
  divisions: Division[];
  status: CompetitionStatus;
  /** 예정 대회에만 존재 — 신청 페이지 경로 */
  applyLink?: string;
  /** 지난 대회에만 존재 — 디비전별 우승자 */
  winners?: CompetitionWinner[];
  /** 지난 대회 결과 상세 페이지 경로 */
  resultLink?: string;
}

/** 선수(Player) 장비 항목 — 드라이버/볼/샤프트 등 */
export interface PlayerEquipment {
  category: string;
  brand: string;
  model: string;
  note?: string;
}

/** 선수(Player) 대회 출전 기록 */
export interface PlayerCompetitionResult {
  competitionId: string;
  competitionTitle: string;
  date: string;
  division: Division;
  /** 1 = 우승, 2 = 준우승 ... 참가만 한 경우 큰 숫자를 사용한다. */
  placement: number;
  /** 해당 대회에서 기록한 최장 비거리(m) */
  distance: number;
}

/**
 * 선수 프로필(PlayerProfile) — 목록 카드와 상세 페이지 공용
 * 목록 카드는 일부 필드만 사용하고, 상세 페이지는 전체 필드를 사용한다.
 */
export interface PlayerProfile {
  /** URL slug (예: "kim-taehun") — 라우트 [id]에 해당 */
  id: string;
  name: string;
  initials: string;
  division: Division;
  region: string;
  /** 소속(팀/클럽명). 없으면 undefined. */
  affiliation?: string;
  /** 간단한 자기소개 문장(2~3줄 분량) */
  bio: string;
  /** 프로필 사진 URL. 비어 있으면 그래디언트 + 이니셜을 사용한다. */
  photoUrl?: string;
  heightCm?: number;
  weightKg?: number;
  dominantHand: "오른손" | "왼손";
  /** 선수 활동 시작 연도 (예: "2020") */
  careerStart: string;
  seasonStats: {
    maxDistance: number;
    rank: number;
    points: string;
    participationCount: number;
  };
  equipment: PlayerEquipment[];
  results: PlayerCompetitionResult[];
  social?: {
    instagram?: string;
    youtube?: string;
  };
}

/* ══════════════════════════════════════════
   회원가입(Signup) 플로우 관련 타입
══════════════════════════════════════════ */

/** 회원 등급 — DB 의 member_type enum 과 값 일치 */
export type MembershipTier = "general" | "full";

/** 정회원 회비 납부 방식 */
export type PaymentMethod = "online" | "code";

/** 회원가입 5단계 + 완료 화면을 위한 단계 식별자 */
export type SignupStep = 1 | 2 | 3 | 4 | 5 | 6;

/** 회원가입 전 과정에서 누적되는 폼 데이터 */
export interface SignupFormData {
  /** Step 1 — 이메일/비밀번호 */
  email: string;
  password: string;
  /** Step 1 을 통과하면 Supabase 로부터 받은 사용자 id 를 저장한다. */
  userId: string | null;

  /** Step 2 — 회원 등급 선택 */
  membership: MembershipTier | null;

  /** Step 3 — 약관 동의(정회원 전용) */
  terms: {
    service: boolean;   // 필수
    privacy: boolean;   // 필수
    refund: boolean;    // 필수
    marketing: boolean; // 선택
  };

  /** Step 4 — 회비 납부(정회원 전용) */
  paymentMethod: PaymentMethod | null;
  paymentCode: string;
  paymentCompleted: boolean;

  /** Step 5 — 선수 프로필 초기 입력 */
  profile: {
    name: string;
    phone: string;
    region: string;
    division: Division | "";
    dominantHand: "오른손" | "왼손";
    bio: string;
  };
}
