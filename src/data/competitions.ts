import type { Competition } from "@/types";

/* ══════════════════════════════════════════
   대회(Competitions) 데이터 소스

   현재: 이 파일 내부의 하드코딩 배열을 반환한다.
   향후: Supabase 연동 시 아래 fetcher 함수 내부만
         `await supabase.from("competitions").select(...)` 로 교체한다.

   Fetcher가 async 시그니처를 유지하므로, 이 파일을 사용하는 컴포넌트
   (예: app/competitions/page.tsx)는 데이터 소스가 바뀌어도 수정이 필요 없다.
══════════════════════════════════════════ */

/** 전체 대회 목록(예정 + 지난). 아래 fetcher에서 status로 필터링한다. */
const COMPETITIONS: Competition[] = [
  /* ── 예정 대회(Upcoming) ── */
  {
    id: "2025-r04-flex",
    round: 4,
    season: "KLD 2025 정규 시즌",
    title: "플렉스골프라운지 × KLD 장타대회",
    date: "2025년 6월 29일 (일)",
    dateISO: "2025-06-29T09:00:00",
    dateNote: "시간 추후 공지",
    location: "플렉스골프라운지",
    locationDetail: "서울 · 상세 주소 확인",
    divisions: ["아마추어", "마스터즈", "우먼스", "오픈"],
    status: "upcoming",
    applyLink: "/apply?round=4",
  },
  {
    id: "2025-r05-suwon",
    round: 5,
    season: "KLD 2025 정규 시즌",
    title: "수원 광교 KLD 오픈",
    date: "2025년 8월 17일 (일)",
    dateISO: "2025-08-17T09:00:00",
    location: "광교 그린스퀘어",
    locationDetail: "경기 · 수원시",
    divisions: ["아마추어", "오픈"],
    status: "upcoming",
    applyLink: "/apply?round=5",
  },
  {
    id: "2025-r06-jeju",
    round: 6,
    season: "KLD 2025 정규 시즌",
    title: "제주 오션뷰 롱드라이브",
    date: "2025년 9월 14일 (일)",
    dateISO: "2025-09-14T09:00:00",
    location: "제주 오션필드",
    locationDetail: "제주 · 서귀포시",
    divisions: ["오픈", "마스터즈", "우먼스"],
    status: "upcoming",
    applyLink: "/apply?round=6",
  },
  {
    id: "2025-final-seoul",
    round: 8,
    season: "KLD 2025 챔피언십",
    title: "2025 KLD 챔피언십",
    date: "2025년 11월 9일 (일)",
    dateISO: "2025-11-09T09:00:00",
    dateNote: "시즌 랭킹 상위 선수만 참가",
    location: "서울 잠실 드라이빙레인지",
    locationDetail: "서울 · 송파구",
    divisions: ["아마추어", "마스터즈", "우먼스", "오픈"],
    status: "upcoming",
    applyLink: "/apply?round=8",
  },

  /* ── 지난 대회(Past) ── */
  {
    id: "2025-r03-sseven",
    round: 3,
    season: "KLD 2025 정규 시즌",
    title: "S SEVEN × FIRSTONE GOLF",
    date: "2025년 4월 13일 (일)",
    dateISO: "2025-04-13T09:00:00",
    location: "FIRSTONE GOLF",
    locationDetail: "인천 · 서구",
    divisions: ["아마추어", "마스터즈", "우먼스", "오픈"],
    status: "past",
    winners: [
      { division: "오픈", name: "박성민", distance: 395 },
      { division: "아마추어", name: "김태훈", distance: 381 },
      { division: "마스터즈", name: "최병훈", distance: 368 },
      { division: "우먼스", name: "이지수", distance: 312 },
    ],
    resultLink: "/results/2025-r03",
  },
  {
    id: "2025-r02-gwangju",
    round: 2,
    season: "KLD 2025 정규 시즌",
    title: "광주 쌍암점 KLD 오픈",
    date: "2025년 3월 16일 (일)",
    dateISO: "2025-03-16T09:00:00",
    location: "광주 쌍암 스튜디오",
    locationDetail: "광주 · 북구",
    divisions: ["아마추어", "오픈"],
    status: "past",
    winners: [
      { division: "오픈", name: "박성민", distance: 389 },
      { division: "아마추어", name: "이재호", distance: 373 },
    ],
    resultLink: "/results/2025-r02",
  },
  {
    id: "2025-r01-busan",
    round: 1,
    season: "KLD 2025 정규 시즌",
    title: "2025 시즌 개막전 — 부산",
    date: "2025년 2월 23일 (일)",
    dateISO: "2025-02-23T09:00:00",
    location: "부산 해운대 드라이빙레인지",
    locationDetail: "부산 · 해운대구",
    divisions: ["아마추어", "마스터즈", "우먼스", "오픈"],
    status: "past",
    winners: [
      { division: "오픈", name: "박성민", distance: 391 },
      { division: "아마추어", name: "박준서", distance: 369 },
    ],
    resultLink: "/results/2025-r01",
  },
  {
    id: "2024-final",
    round: 8,
    season: "KLD 2024 챔피언십",
    title: "2024 KLD 챔피언십",
    date: "2024년 11월 10일 (일)",
    dateISO: "2024-11-10T09:00:00",
    location: "서울 잠실 드라이빙레인지",
    locationDetail: "서울 · 송파구",
    divisions: ["아마추어", "마스터즈", "우먼스", "오픈"],
    status: "past",
    winners: [
      { division: "오픈", name: "박성민", distance: 402 },
    ],
    resultLink: "/results/2024-final",
  },
  {
    id: "2024-r07-daegu",
    round: 7,
    season: "KLD 2024 정규 시즌",
    title: "대구 롱드라이브 클래식",
    date: "2024년 10월 6일 (일)",
    dateISO: "2024-10-06T09:00:00",
    location: "대구 수성 골프아일랜드",
    locationDetail: "대구 · 수성구",
    divisions: ["아마추어", "오픈"],
    status: "past",
    winners: [
      { division: "오픈", name: "박성민", distance: 398 },
    ],
    resultLink: "/results/2024-r07",
  },
];

/* ── Fetcher ──
   Supabase 연동 시 함수 내부만 교체한다. 예:

   export async function getUpcomingCompetitions() {
     const { data, error } = await supabase
       .from("competitions")
       .select("*")
       .eq("status", "upcoming")
       .order("date_iso", { ascending: true });
     if (error) throw error;
     return data as Competition[];
   }
*/

/** 예정 대회 — 가까운 날짜가 위로 오도록 오름차순 정렬 */
export async function getUpcomingCompetitions(): Promise<Competition[]> {
  return COMPETITIONS
    .filter((c) => c.status === "upcoming")
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
}

/** 지난 대회 — 최근이 위로 오도록 내림차순 정렬 */
export async function getPastCompetitions(): Promise<Competition[]> {
  return COMPETITIONS
    .filter((c) => c.status === "past")
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO));
}

/** id로 단일 대회 조회 — 상세 페이지 구현 시 사용 */
export async function getCompetitionById(
  id: string,
): Promise<Competition | null> {
  return COMPETITIONS.find((c) => c.id === id) ?? null;
}
