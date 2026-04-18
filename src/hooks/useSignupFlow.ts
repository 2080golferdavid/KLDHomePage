"use client";

import { useCallback, useState } from "react";
import type { SignupFormData, SignupStep } from "@/types";
import {
  redeemPaymentCode,
  savePlayerProfile,
  signUpWithEmailPassword,
  startOnlinePayment,
} from "@/lib/auth/signup";

/* ══════════════════════════════════════════
   회원가입 5단계 플로우의 상태와 전이 로직을 한 곳에 모은 커스텀 훅

   - 각 스텝 컴포넌트는 이 훅에서 반환하는 값만 사용하면 되며,
     Supabase 액션 호출은 훅 내부에서만 일어난다.
   - "일반회원" 선택 시 3, 4단계를 건너뛰고 5단계로 직행한다.
══════════════════════════════════════════ */

/** 폼의 초기값 — 상태 초기화/리셋에 재사용한다. */
const INITIAL_DATA: SignupFormData = {
  email: "",
  password: "",
  userId: null,
  membership: null,
  terms: {
    service: false,
    privacy: false,
    refund: false,
    marketing: false,
  },
  paymentMethod: null,
  paymentCode: "",
  paymentCompleted: false,
  profile: {
    name: "",
    phone: "",
    region: "",
    division: "",
    dominantHand: "오른손",
    bio: "",
  },
};

export interface UseSignupFlow {
  step: SignupStep;
  data: SignupFormData;
  loading: boolean;
  error: string | null;

  /* 데이터 업데이트 — 얕은 병합(shallow merge). */
  patchData: (patch: Partial<SignupFormData>) => void;

  /* 각 스텝의 제출 액션. 성공 시 내부에서 다음 스텝으로 전환한다. */
  submitStep1: (email: string, password: string) => Promise<void>;
  submitStep2: (membership: SignupFormData["membership"]) => void;
  submitStep3: (terms: SignupFormData["terms"]) => void;
  submitStep4Code: (code: string) => Promise<void>;
  submitStep4Online: () => Promise<void>;
  submitStep5: (profile: SignupFormData["profile"]) => Promise<void>;

  /* 공통 내비게이션 */
  goBack: () => void;
  reset: () => void;
}

export function useSignupFlow(): UseSignupFlow {
  const [step, setStep] = useState<SignupStep>(1);
  const [data, setData] = useState<SignupFormData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* 이전 상태를 기반으로 얕게 병합한다. nested 객체는 호출자가 전체를 넘겨야 한다. */
  const patchData = useCallback((patch: Partial<SignupFormData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  /* ── Step 1 : 이메일/비밀번호 가입 ── */
  const submitStep1 = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setLoading(true);
      const result = await signUpWithEmailPassword(email, password);
      setLoading(false);

      if (!result.success) {
        setError(result.error ?? "회원가입에 실패했습니다.");
        return;
      }
      setData((prev) => ({
        ...prev,
        email,
        password,
        userId: result.userId ?? null,
      }));
      setStep(2);
    },
    [],
  );

  /* ── Step 2 : 회원 등급 선택 ── */
  const submitStep2 = useCallback(
    (membership: SignupFormData["membership"]) => {
      setError(null);
      setData((prev) => ({ ...prev, membership }));

      // 일반회원은 3, 4 단계를 건너뛰고 곧장 프로필 입력으로.
      if (membership === "general") {
        setStep(5);
      } else {
        setStep(3);
      }
    },
    [],
  );

  /* ── Step 3 : 약관 동의 ── */
  const submitStep3 = useCallback((terms: SignupFormData["terms"]) => {
    setError(null);
    setData((prev) => ({ ...prev, terms }));
    setStep(4);
  }, []);

  /* ── Step 4-A : 인증코드 ── */
  const submitStep4Code = useCallback(async (code: string) => {
    setError(null);
    setLoading(true);
    const result = await redeemPaymentCode(code);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "코드 확인에 실패했습니다.");
      return;
    }
    setData((prev) => ({
      ...prev,
      paymentMethod: "code",
      paymentCode: code,
      paymentCompleted: true,
    }));
    setStep(5);
  }, []);

  /* ── Step 4-B : 온라인 결제 ── */
  const submitStep4Online = useCallback(async () => {
    setError(null);
    setLoading(true);
    const result = await startOnlinePayment();
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "결제에 실패했습니다. 다시 시도해주세요.");
      return;
    }
    setData((prev) => ({
      ...prev,
      paymentMethod: "online",
      paymentCompleted: true,
    }));
    setStep(5);
  }, []);

  /* ── Step 5 : 선수 프로필 저장 ── */
  const submitStep5 = useCallback(
    async (profile: SignupFormData["profile"]) => {
      setError(null);
      setLoading(true);

      /* userId 가 null 인 경우는 Step 1 이 스텁이더라도 채워지므로
         일반적으로 발생하지 않는다. 안전장치로 방어한다. */
      if (!data.userId) {
        setLoading(false);
        setError(
          "사용자 정보가 유실되었습니다. 처음부터 다시 진행해주세요.",
        );
        return;
      }

      const result = await savePlayerProfile(data.userId, profile);
      setLoading(false);

      if (!result.success) {
        setError(result.error ?? "프로필 저장에 실패했습니다.");
        return;
      }
      setData((prev) => ({ ...prev, profile }));
      setStep(6);
    },
    [data.userId],
  );

  /* ── 공통 ── */
  const goBack = useCallback(() => {
    setError(null);
    setStep((prev) => {
      // 완료 화면에서는 뒤로 가지 않는다.
      if (prev === 6) return prev;
      // 일반회원이 5단계에 있다면 바로 2단계로 돌아간다.
      if (prev === 5 && data.membership === "general") return 2;
      return Math.max(1, (prev - 1) as SignupStep) as SignupStep;
    });
  }, [data.membership]);

  const reset = useCallback(() => {
    setData(INITIAL_DATA);
    setError(null);
    setStep(1);
  }, []);

  return {
    step,
    data,
    loading,
    error,
    patchData,
    submitStep1,
    submitStep2,
    submitStep3,
    submitStep4Code,
    submitStep4Online,
    submitStep5,
    goBack,
    reset,
  };
}
