import type { MembershipTier, SignupStep } from "@/types";

interface SignupProgressProps {
  currentStep: SignupStep;
  membership: MembershipTier | null;
}

/**
 * 회원가입 진행 인디케이터.
 * - 일반회원(general): 1 · 2 · 5 단계만 표시
 * - 정회원(full) 또는 미선택: 1 ~ 5 전체 표시
 * - Step 6(완료) 에서는 전체 단계가 "done" 상태로 표시된다.
 */
export default function SignupProgress({
  currentStep,
  membership,
}: SignupProgressProps) {
  const steps =
    membership === "general"
      ? [
          { n: 1, en: "ACCOUNT", kr: "계정" },
          { n: 2, en: "TIER", kr: "회원 등급" },
          { n: 5, en: "PROFILE", kr: "프로필" },
        ]
      : [
          { n: 1, en: "ACCOUNT", kr: "계정" },
          { n: 2, en: "TIER", kr: "회원 등급" },
          { n: 3, en: "TERMS", kr: "약관" },
          { n: 4, en: "PAYMENT", kr: "회비" },
          { n: 5, en: "PROFILE", kr: "프로필" },
        ];

  return (
    <ol
      className="stepper"
      style={{
        gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
        marginBottom: 40,
      }}
      aria-label="회원가입 진행 단계"
    >
      {steps.map((s) => {
        const isDone = currentStep > s.n || currentStep === 6;
        const isActive = currentStep === s.n;
        const cls = isActive ? "is-active" : isDone ? "is-done" : "";

        return (
          <li
            key={s.n}
            className={`stepper-cell ${cls}`}
            aria-current={isActive ? "step" : undefined}
          >
            <div className="n">
              {isDone && !isActive ? "✓" : String(s.n).padStart(2, "0")}
            </div>
            <div className="t">
              {s.en}
              <br />
              <span style={{ fontFamily: "var(--kld-font-kr)" }}>{s.kr}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
