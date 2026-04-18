import type { PlayerProfile } from "@/types";

/* ══════════════════════════════════════════
   선수(Players) 데이터 소스

   현재: 이 파일 내부 하드코딩 배열을 반환한다.
   향후: Supabase 연동 시 아래 fetcher 내부만
         `await supabase.from("players").select(...)` 로 교체한다.

   Fetcher가 async 시그니처를 유지하므로, 이 파일을 사용하는 페이지는
   데이터 소스가 바뀌어도 수정 없이 동작한다.
══════════════════════════════════════════ */

/** 전체 선수 목록 — 목록 페이지와 상세 페이지 공용 */
const PLAYERS: PlayerProfile[] = [
  {
    id: "kim-taehun",
    name: "김태훈",
    initials: "KT",
    division: "아마추어",
    region: "SEOUL",
    bio: "2021년 KLD 데뷔. 3시즌 연속 아마추어 디비전 상위권을 유지하고 있으며, 2025 시즌 개막 이후 최장 비거리 381m를 기록했다.",
    dominantHand: "오른손",
    heightCm: 181,
    weightKg: 84,
    careerStart: "2021",
    seasonStats: {
      maxDistance: 381,
      rank: 1,
      points: "1,250",
      participationCount: 3,
    },
    equipment: [
      {
        category: "드라이버",
        brand: "Callaway",
        model: "Paradym Ai Smoke MAX",
        note: "9.0° / Hzrdus Smoke Black 6.0 TX",
      },
      { category: "샤프트", brand: "Project X", model: "Hzrdus Smoke Black TX" },
      { category: "볼", brand: "Titleist", model: "Pro V1x" },
      { category: "글러브", brand: "FootJoy", model: "Pure Touch Limited" },
    ],
    results: [
      {
        competitionId: "2025-r03-sseven",
        competitionTitle: "S SEVEN × FIRSTONE GOLF",
        date: "2025.04.13",
        division: "아마추어",
        placement: 1,
        distance: 381,
      },
      {
        competitionId: "2025-r02-gwangju",
        competitionTitle: "광주 쌍암점 KLD 오픈",
        date: "2025.03.16",
        division: "아마추어",
        placement: 2,
        distance: 367,
      },
      {
        competitionId: "2025-r01-busan",
        competitionTitle: "2025 시즌 개막전 — 부산",
        date: "2025.02.23",
        division: "아마추어",
        placement: 3,
        distance: 361,
      },
    ],
    social: { instagram: "@kt_longdrive" },
  },
  {
    id: "park-sungmin",
    name: "박성민",
    initials: "PS",
    division: "오픈",
    region: "SEOUL",
    bio: "KLD 오픈 디비전의 대표 선수. 2024 챔피언십 우승자이며 시즌 최장 395m 기록 보유자. 팬들로부터 '장타의 교본'이라는 별명으로 불린다.",
    dominantHand: "오른손",
    heightCm: 188,
    weightKg: 92,
    careerStart: "2019",
    seasonStats: {
      maxDistance: 395,
      rank: 1,
      points: "1,320",
      participationCount: 3,
    },
    equipment: [
      {
        category: "드라이버",
        brand: "TaylorMade",
        model: "Qi10 LS",
        note: "8.0° / 48인치 장척",
      },
      { category: "샤프트", brand: "Fujikura", model: "Ventus Black 7X" },
      { category: "볼", brand: "Titleist", model: "Pro V1x Left Dot" },
      { category: "글러브", brand: "Titleist", model: "Players" },
    ],
    results: [
      {
        competitionId: "2025-r03-sseven",
        competitionTitle: "S SEVEN × FIRSTONE GOLF",
        date: "2025.04.13",
        division: "오픈",
        placement: 1,
        distance: 395,
      },
      {
        competitionId: "2025-r02-gwangju",
        competitionTitle: "광주 쌍암점 KLD 오픈",
        date: "2025.03.16",
        division: "오픈",
        placement: 1,
        distance: 389,
      },
      {
        competitionId: "2025-r01-busan",
        competitionTitle: "2025 시즌 개막전 — 부산",
        date: "2025.02.23",
        division: "오픈",
        placement: 1,
        distance: 391,
      },
      {
        competitionId: "2024-final",
        competitionTitle: "2024 KLD 챔피언십",
        date: "2024.11.10",
        division: "오픈",
        placement: 1,
        distance: 402,
      },
    ],
    social: { instagram: "@psm_bomber", youtube: "PSM Long Drive" },
  },
  {
    id: "lee-jisu",
    name: "이지수",
    initials: "LJ",
    division: "우먼스",
    region: "SEOUL",
    bio: "우먼스 디비전 1위. 2024 시즌 2회 우승 경력을 바탕으로 2025 시즌 개막전부터 안정된 기록을 이어가고 있다.",
    dominantHand: "오른손",
    heightCm: 169,
    weightKg: 58,
    careerStart: "2022",
    seasonStats: {
      maxDistance: 312,
      rank: 1,
      points: "1,120",
      participationCount: 3,
    },
    equipment: [
      {
        category: "드라이버",
        brand: "PING",
        model: "G430 MAX 10K",
        note: "10.5° / 스텔스 스텔락",
      },
      { category: "샤프트", brand: "Mitsubishi", model: "Diamana S+ Limited 60TX" },
      { category: "볼", brand: "Titleist", model: "Pro V1" },
    ],
    results: [
      {
        competitionId: "2025-r03-sseven",
        competitionTitle: "S SEVEN × FIRSTONE GOLF",
        date: "2025.04.13",
        division: "우먼스",
        placement: 1,
        distance: 312,
      },
      {
        competitionId: "2025-r01-busan",
        competitionTitle: "2025 시즌 개막전 — 부산",
        date: "2025.02.23",
        division: "우먼스",
        placement: 1,
        distance: 306,
      },
    ],
    social: { instagram: "@lee_jisoo_ld" },
  },
  {
    id: "choi-byunghun",
    name: "최병훈",
    initials: "CB",
    division: "마스터즈",
    region: "SEOUL",
    bio: "마스터즈 디비전 1위. 40대 후반에 시작한 장타 커리어로 '늦깎이 챔피언'으로 불린다. 안정된 스윙 템포가 강점.",
    dominantHand: "오른손",
    heightCm: 178,
    weightKg: 80,
    careerStart: "2020",
    seasonStats: {
      maxDistance: 368,
      rank: 1,
      points: "1,080",
      participationCount: 3,
    },
    equipment: [
      { category: "드라이버", brand: "TaylorMade", model: "Stealth 2 Plus" },
      { category: "샤프트", brand: "Graphite Design", model: "Tour AD DI-7X" },
      { category: "볼", brand: "Bridgestone", model: "Tour B XS" },
    ],
    results: [
      {
        competitionId: "2025-r03-sseven",
        competitionTitle: "S SEVEN × FIRSTONE GOLF",
        date: "2025.04.13",
        division: "마스터즈",
        placement: 1,
        distance: 368,
      },
      {
        competitionId: "2025-r01-busan",
        competitionTitle: "2025 시즌 개막전 — 부산",
        date: "2025.02.23",
        division: "마스터즈",
        placement: 2,
        distance: 355,
      },
    ],
  },
  {
    id: "lee-jaeho",
    name: "이재호",
    initials: "LJ",
    division: "아마추어",
    region: "BUSAN",
    bio: "부산 해운대를 거점으로 활동하는 떠오르는 신예. 2025 시즌 랭킹 2위로 도약하며 아마추어 디비전 경쟁을 이끌고 있다.",
    dominantHand: "오른손",
    heightCm: 176,
    weightKg: 76,
    careerStart: "2023",
    seasonStats: {
      maxDistance: 373,
      rank: 2,
      points: "1,140",
      participationCount: 3,
    },
    equipment: [
      { category: "드라이버", brand: "TaylorMade", model: "Qi10 Max" },
      { category: "샤프트", brand: "Fujikura", model: "Ventus Blue 6S" },
      { category: "볼", brand: "Titleist", model: "Pro V1" },
    ],
    results: [
      {
        competitionId: "2025-r03-sseven",
        competitionTitle: "S SEVEN × FIRSTONE GOLF",
        date: "2025.04.13",
        division: "아마추어",
        placement: 2,
        distance: 373,
      },
      {
        competitionId: "2025-r02-gwangju",
        competitionTitle: "광주 쌍암점 KLD 오픈",
        date: "2025.03.16",
        division: "아마추어",
        placement: 1,
        distance: 371,
      },
    ],
  },
  {
    id: "park-junseo",
    name: "박준서",
    initials: "PJ",
    division: "아마추어",
    region: "INCHEON",
    bio: "2024 시즌 아마추어 디비전 신인왕. 안정된 페이드 볼로 코스에 상관없이 비슷한 비거리를 내는 것이 특징.",
    dominantHand: "오른손",
    heightCm: 179,
    weightKg: 79,
    careerStart: "2023",
    seasonStats: {
      maxDistance: 369,
      rank: 3,
      points: "980",
      participationCount: 2,
    },
    equipment: [
      { category: "드라이버", brand: "Callaway", model: "Paradym Triple Diamond" },
      { category: "샤프트", brand: "Mitsubishi", model: "Tensei AV Raw Blue 65TX" },
      { category: "볼", brand: "Callaway", model: "Chrome Soft X" },
    ],
    results: [
      {
        competitionId: "2025-r01-busan",
        competitionTitle: "2025 시즌 개막전 — 부산",
        date: "2025.02.23",
        division: "아마추어",
        placement: 1,
        distance: 369,
      },
    ],
  },
  {
    id: "kim-seoyeon",
    name: "김서연",
    initials: "KS",
    division: "우먼스",
    region: "BUSAN",
    bio: "우먼스 디비전 2위. 부산 출신으로 일관된 거리와 방향성 모두에서 호평받는다. 롱드라이브 유튜브 채널도 운영 중.",
    dominantHand: "오른손",
    heightCm: 166,
    weightKg: 56,
    careerStart: "2022",
    seasonStats: {
      maxDistance: 305,
      rank: 2,
      points: "1,010",
      participationCount: 3,
    },
    equipment: [
      { category: "드라이버", brand: "PING", model: "G430 LST" },
      { category: "샤프트", brand: "Fujikura", model: "Speeder NX Blue 60S" },
      { category: "볼", brand: "Titleist", model: "Pro V1" },
    ],
    results: [
      {
        competitionId: "2025-r03-sseven",
        competitionTitle: "S SEVEN × FIRSTONE GOLF",
        date: "2025.04.13",
        division: "우먼스",
        placement: 2,
        distance: 305,
      },
    ],
    social: { youtube: "@KimSeoyeonGolf" },
  },
  {
    id: "kang-dongseok",
    name: "강동석",
    initials: "KD",
    division: "마스터즈",
    region: "INCHEON",
    bio: "마스터즈 디비전 2위. 전직 프로 출신으로 다양한 클럽 피팅 경험과 장타 기술을 후배들에게 공유하고 있다.",
    dominantHand: "오른손",
    heightCm: 182,
    weightKg: 88,
    careerStart: "2018",
    seasonStats: {
      maxDistance: 362,
      rank: 2,
      points: "950",
      participationCount: 3,
    },
    equipment: [
      { category: "드라이버", brand: "Titleist", model: "TSR4" },
      { category: "샤프트", brand: "Graphite Design", model: "Tour AD XC-7X" },
      { category: "볼", brand: "Titleist", model: "Pro V1x" },
    ],
    results: [
      {
        competitionId: "2025-r03-sseven",
        competitionTitle: "S SEVEN × FIRSTONE GOLF",
        date: "2025.04.13",
        division: "마스터즈",
        placement: 2,
        distance: 362,
      },
    ],
  },
];

/* ── Fetcher ──
   Supabase 연동 시 함수 내부만 교체한다. 예:

   export async function getAllPlayers() {
     const { data, error } = await supabase
       .from("players")
       .select("*")
       .order("season_max_distance", { ascending: false });
     if (error) throw error;
     return data as PlayerProfile[];
   }
*/

/** 전체 선수 목록. 시즌 최장 비거리가 긴 순서로 정렬해 반환한다. */
export async function getAllPlayers(): Promise<PlayerProfile[]> {
  return [...PLAYERS].sort(
    (a, b) => b.seasonStats.maxDistance - a.seasonStats.maxDistance,
  );
}

/** id로 단일 선수 프로필 조회 — 상세 페이지에서 사용 */
export async function getPlayerById(
  id: string,
): Promise<PlayerProfile | null> {
  return PLAYERS.find((p) => p.id === id) ?? null;
}

/**
 * 존재하는 모든 선수 id 목록 반환.
 * Next.js `generateStaticParams`에서 정적 경로 프리렌더링에 사용한다.
 */
export async function getAllPlayerIds(): Promise<string[]> {
  return PLAYERS.map((p) => p.id);
}
