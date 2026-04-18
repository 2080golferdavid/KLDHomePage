import type { SignupFormData } from "@/types";

/* ══════════════════════════════════════════
   회원가입 Auth 액션 계층(Action Layer)

   이 파일은 회원가입 과정에서 Supabase 와 주고받는 모든 통신을
   한 곳에 모아둔 "어댑터(Adapter)" 다.
   컴포넌트/훅은 이 파일의 함수만 호출하고, 내부 구현이 바뀌어도
   호출부는 수정할 필요가 없다.

   ── 현재 상태 ──
   Supabase 라이브러리가 아직 설치되지 않았으므로 각 함수는
   setTimeout 을 사용한 "스텁(stub)" 구현이다.
   UI 플로우를 검증하는 용도로 사용한다.

   ── 실제 연결 ──
   1) `npm i @supabase/supabase-js` 설치
   2) `src/lib/supabase/client.ts` 에 createClient() 로 클라이언트 생성
   3) 아래 각 함수 내부의 "TODO" 주석 위치에 해당 코드 블록을 붙여넣기
      (스텁 블록은 제거한다)
══════════════════════════════════════════ */

/** 네트워크 지연을 흉내 내는 스텁 헬퍼 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ActionResult {
  success: boolean;
  /** 사용자에게 표시할 한국어 에러 메시지 */
  error?: string;
}

export interface SignUpResult extends ActionResult {
  /** auth.users.id — 성공했을 때만 채워진다. */
  userId?: string;
}

/**
 * Step 1 — 이메일/비밀번호로 회원가입.
 * 성공 시 userId 를 반환한다.
 *
 * 실제 구현:
 *   const { data, error } = await supabase.auth.signUp({ email, password });
 *   if (error) return { success: false, error: error.message };
 *   return { success: true, userId: data.user?.id };
 */
export async function signUpWithEmailPassword(
  email: string,
  password: string,
): Promise<SignUpResult> {
  // TODO: Supabase 연결 시 이 블록을 실제 호출로 교체한다.
  await delay(600);

  // 최소한의 입력 검증 — 서버 측 검증은 Supabase 가 담당하지만,
  // 스텁에서도 기본 피드백을 주기 위해 형식만 확인한다.
  if (!email.includes("@")) {
    return { success: false, error: "이메일 형식이 올바르지 않습니다." };
  }
  if (password.length < 8) {
    return {
      success: false,
      error: "비밀번호는 8자 이상이어야 합니다.",
    };
  }

  return {
    success: true,
    userId: `stub-${Math.random().toString(36).slice(2, 10)}`,
  };
}

/**
 * Step 1 — 카카오 소셜 로그인.
 * 성공 시 브라우저가 카카오 OAuth 페이지로 리다이렉트된다.
 *
 * 실제 구현:
 *   await supabase.auth.signInWithOAuth({
 *     provider: 'kakao',
 *     options: { redirectTo: `${window.location.origin}/auth/callback` },
 *   });
 *
 * ※ 사전 준비: Supabase 대시보드 → Authentication → Providers →
 *   Kakao 활성화 및 REST API 키 등록.
 */
export async function signInWithKakao(): Promise<ActionResult> {
  // TODO: Supabase 연결 시 교체.
  await delay(400);
  if (typeof window !== "undefined") {
    alert(
      "[스텁] 카카오 OAuth 로그인 — Supabase 연결 후 실제 리다이렉트가 동작합니다.",
    );
  }
  return { success: true };
}

/**
 * Step 4 — 회비 납부 "인증코드" 방식.
 * schema.sql 에 정의된 use_payment_code RPC 를 호출한다.
 *
 * 실제 구현:
 *   const { data, error } = await supabase.rpc('use_payment_code', { p_code: code });
 *   if (error) return { success: false, error: error.message };
 *   return { success: data === true, error: data ? undefined : '유효하지 않은 코드입니다.' };
 */
export async function redeemPaymentCode(
  code: string,
): Promise<ActionResult> {
  // TODO: Supabase 연결 시 교체.
  await delay(800);
  const trimmed = code.trim();
  if (trimmed.length === 0) {
    return { success: false, error: "인증코드를 입력해주세요." };
  }
  // 스텁: 데모용 유효 코드 "KLD-DEMO-2025" 및 사용자 요청 코드 "TEST001" 만 인정한다.
  const isValid =
    trimmed.toUpperCase() === "KLD-DEMO-2025" ||
    trimmed.toUpperCase() === "TEST001";

  if (!isValid) {
    return {
      success: false,
      error:
        "유효하지 않거나 이미 사용된 코드입니다. (테스트 코드: TEST001)",
    };
  }
  return { success: true };
}

/**
 * Step 4 — 온라인 결제.
 * 실제로는 PG 사(토스페이먼츠/아임포트 등) 의 결제창을 띄우고
 * 성공 webhook 으로 서버가 payment_codes 를 발행·사용 처리하거나,
 * users.member_type 을 'full' 로 직접 승격하는 플로우로 구현한다.
 *
 * 스텁에서는 2초 대기 후 "결제 성공" 으로 처리한다.
 */
export async function startOnlinePayment(): Promise<ActionResult> {
  // TODO: PG 연동 시 교체.
  await delay(2000);
  return { success: true };
}

/**
 * Step 5 — 선수 프로필 초기 저장.
 * public.players 테이블에 row 를 insert 한다.
 *
 * 실제 구현:
 *   const { error } = await supabase.from('players').insert({
 *     user_id: userId,
 *     region: profile.region,
 *     division: profile.division,
 *     bio: profile.bio,
 *     equipment: [],
 *   });
 *   // 이름/전화번호 등 공통 프로필은 public.users 업데이트:
 *   await supabase.from('users').update({ name: profile.name }).eq('id', userId);
 */
export async function savePlayerProfile(
  userId: string,
  profile: SignupFormData["profile"],
): Promise<ActionResult> {
  // TODO: Supabase 연결 시 교체.
  await delay(700);

  if (!profile.name.trim()) {
    return { success: false, error: "이름을 입력해주세요." };
  }
  if (!profile.division) {
    return { success: false, error: "디비전을 선택해주세요." };
  }

  // 디버깅을 위해 콘솔에 기록 — 실제 구현에서는 제거한다.
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.info("[스텁] 프로필 저장", { userId, profile });
  }
  return { success: true };
}
