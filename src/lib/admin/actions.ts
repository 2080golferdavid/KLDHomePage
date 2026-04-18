import type { Division } from "@/types";

/* ══════════════════════════════════════════
   관리자(Admin) 액션 / 데이터 소스

   현재: 이 파일 내부의 모듈 수준 배열이 "가상 DB" 역할을 한다.
         같은 탭 세션 내에서만 상태가 유지되며, 새로고침 시 초기값으로 돌아간다.
   향후: Supabase 연동 시 각 함수 내부만 실제 호출로 교체한다.
         호출 시그니처(Promise<...>)는 유지하므로 UI 수정은 불필요.

   ⚠️ 권한:
   이 파일의 함수들은 관리자만 호출한다는 가정으로 작성되었다.
   실제 보안은 Supabase RLS 가 담당하며, 프론트엔드 체크는 UX 편의일 뿐이다.
══════════════════════════════════════════ */

/** 네트워크 지연 스텁 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

/* ── 타입 정의 ────────────────────────────────── */

export interface PendingMember {
  userId: string;
  email: string;
  name: string;
  /** 가입 신청 일시(ISO) */
  requestedAt: string;
  /** 회비 납부 방식 — 온라인 결제 확인용 */
  paymentMethod: "online" | "code" | null;
}

export interface PaymentCodeRow {
  id: string;
  code: string;
  createdAt: string;
  usedBy: string | null; // user id
  usedByName: string | null;
  usedAt: string | null;
}

export interface CompetitionOption {
  id: string;
  title: string;
  date: string;
  divisions: Division[];
}

export interface PlayerOption {
  id: string;
  name: string;
  initials: string;
  division: Division;
  region: string;
}

export interface CompetitionResultInput {
  competitionId: string;
  playerId: string;
  division: Division;
  distance: number;
  rank: number;
  points: number;
}

/* ── 가상 DB (세션 수준) ───────────────────────── */

/** 승인 대기 중인 정회원 신청 — 실제로는 users where member_type='full' and status='pending' */
let pendingMembers: PendingMember[] = [
  {
    userId: "u-pending-01",
    email: "youngkim@example.com",
    name: "김영준",
    requestedAt: "2026-04-15T08:20:00+09:00",
    paymentMethod: "online",
  },
  {
    userId: "u-pending-02",
    email: "minhoji@example.com",
    name: "지민호",
    requestedAt: "2026-04-16T11:05:00+09:00",
    paymentMethod: "code",
  },
  {
    userId: "u-pending-03",
    email: "hyunoh@example.com",
    name: "오현진",
    requestedAt: "2026-04-17T09:42:00+09:00",
    paymentMethod: "online",
  },
];

/** 발급된 인증코드 — 실제로는 payment_codes 테이블 */
let paymentCodes: PaymentCodeRow[] = [
  {
    id: "pc-01",
    code: "KLD-2026-SEED-0001",
    createdAt: "2026-03-01T00:00:00+09:00",
    usedBy: "kim-taehun",
    usedByName: "김태훈",
    usedAt: "2026-03-02T14:33:00+09:00",
  },
  {
    id: "pc-02",
    code: "KLD-2026-SEED-0002",
    createdAt: "2026-03-01T00:00:00+09:00",
    usedBy: null,
    usedByName: null,
    usedAt: null,
  },
  {
    id: "pc-03",
    code: "KLD-DEMO-2025",
    createdAt: "2026-03-15T00:00:00+09:00",
    usedBy: null,
    usedByName: null,
    usedAt: null,
  },
];

/** 관리자가 입력한 대회 결과(세션용 버퍼) — 실제로는 competition_results insert */
const submittedResults: CompetitionResultInput[] = [];

/* ── 읽기 함수(Getters) ────────────────────────── */

/**
 * 승인 대기 회원 목록.
 *
 * 실제 구현:
 *   const { data, error } = await supabase
 *     .from('users')
 *     .select('id, email, name, created_at')
 *     .eq('member_type', 'full')
 *     .eq('status', 'pending')
 *     .order('created_at', { ascending: true });
 */
export async function getPendingMembers(): Promise<PendingMember[]> {
  await delay(200);
  return [...pendingMembers];
}

/**
 * 인증코드 전체 목록.
 *
 * 실제 구현:
 *   const { data, error } = await supabase
 *     .from('payment_codes')
 *     .select('id, code, created_at, used_by, used_at, users!used_by(name)')
 *     .order('created_at', { ascending: false });
 */
export async function getPaymentCodes(): Promise<PaymentCodeRow[]> {
  await delay(200);
  return [...paymentCodes].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

/* ── 쓰기 함수(Mutations) ─────────────────────── */

/**
 * 대기 중인 회원을 승인 → status='active' 로 전환.
 *
 * 실제 구현:
 *   const { error } = await supabase
 *     .from('users')
 *     .update({ status: 'active' })
 *     .eq('id', userId);
 */
export async function approveMember(userId: string): Promise<ActionResult> {
  await delay(400);
  const target = pendingMembers.find((m) => m.userId === userId);
  if (!target) return { success: false, error: "이미 처리되었거나 존재하지 않는 신청입니다." };
  pendingMembers = pendingMembers.filter((m) => m.userId !== userId);
  return { success: true };
}

/**
 * 대기 중인 회원을 반려 → 일반회원으로 강등하거나 삭제.
 *
 * 실제 구현(강등 방식):
 *   const { error } = await supabase
 *     .from('users')
 *     .update({ member_type: 'general', status: 'active' })
 *     .eq('id', userId);
 */
export async function rejectMember(userId: string): Promise<ActionResult> {
  await delay(400);
  const before = pendingMembers.length;
  pendingMembers = pendingMembers.filter((m) => m.userId !== userId);
  if (pendingMembers.length === before) {
    return { success: false, error: "이미 처리되었거나 존재하지 않는 신청입니다." };
  }
  return { success: true };
}

/**
 * 1회용 인증코드 발급.
 *
 * 실제 구현:
 *   const { data, error } = await supabase
 *     .from('payment_codes')
 *     .insert({ code: generateCode() })
 *     .select('*').single();
 */
export async function issuePaymentCode(): Promise<
  ActionResult & { code?: PaymentCodeRow }
> {
  await delay(500);
  const now = new Date();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  const newRow: PaymentCodeRow = {
    id: `pc-${Date.now()}`,
    code: `KLD-${now.getFullYear()}-${random}`,
    createdAt: now.toISOString(),
    usedBy: null,
    usedByName: null,
    usedAt: null,
  };
  paymentCodes = [newRow, ...paymentCodes];
  return { success: true, code: newRow };
}

/**
 * 미사용 인증코드 폐기(삭제).
 * 이미 사용된 코드는 감사 추적을 위해 삭제하지 않는다.
 *
 * 실제 구현:
 *   const { error } = await supabase
 *     .from('payment_codes')
 *     .delete()
 *     .eq('id', codeId)
 *     .is('used_by', null);
 */
export async function revokePaymentCode(
  codeId: string,
): Promise<ActionResult> {
  await delay(300);
  const target = paymentCodes.find((c) => c.id === codeId);
  if (!target) return { success: false, error: "코드를 찾을 수 없습니다." };
  if (target.usedBy) {
    return {
      success: false,
      error: "이미 사용된 코드는 폐기할 수 없습니다.",
    };
  }
  paymentCodes = paymentCodes.filter((c) => c.id !== codeId);
  return { success: true };
}

/**
 * 대회 결과 한 건 입력.
 *
 * 실제 구현:
 *   const { error } = await supabase
 *     .from('competition_results')
 *     .insert({
 *       competition_id: input.competitionId,
 *       player_id: input.playerId,
 *       division: input.division,
 *       distance: input.distance,
 *       rank: input.rank,
 *       points: input.points,
 *     });
 */
export async function submitCompetitionResult(
  input: CompetitionResultInput,
): Promise<ActionResult> {
  await delay(500);

  if (input.distance <= 0) {
    return { success: false, error: "비거리는 0보다 큰 값이어야 합니다." };
  }
  if (input.rank < 1) {
    return { success: false, error: "순위는 1 이상이어야 합니다." };
  }
  if (input.points < 0) {
    return { success: false, error: "포인트는 0 이상이어야 합니다." };
  }

  submittedResults.push(input);
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.info("[스텁] 대회 결과 저장", input);
  }
  return { success: true };
}
