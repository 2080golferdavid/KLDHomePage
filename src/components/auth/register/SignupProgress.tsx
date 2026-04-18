import type { MembershipTier, SignupStep } from "@/types";

/* ── Props ── */
interface SignupProgressProps {
  currentStep: SignupStep;
  /** 회원 등급에 따라 스텝 라벨/총 개수가 달라진다. */
  membership: MembershipTier | null;
}

/**
 * 회원가입 상단 진행 인디케이터(Progress Indicator)
 *
 * - 일반회원(general): 1 · 2 · 5 단계만 표시 (3, 4 는 건너뜀)
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
          { n: 1, label: "계정" },
          { n: 2, label: "회원 등급" },
          { n: 5, label: "프로필" },
        ]
      : [
          { n: 1, label: "계정" },
          { n: 2, label: "회원 등급" },
          { n: 3, label: "약관" },
          { n: 4, label: "회비" },
          { n: 5, label: "프로필" },
        ];

  return (
    <ol
      className="
        flex items-center gap-2 md:gap-3
        overflow-x-auto scrollbar-none
        mb-10 md:mb-14
      "
      aria-label="회원가입 진행 단계"
    >
      {steps.map((s, index) => {
        const isDone = currentStep > s.n || currentStep === 6;
        const isActive = currentStep === s.n;

        return (
          <li
            key={s.n}
            className="flex items-center gap-2 md:gap-3 shrink-0"
            aria-current={isActive ? "step" : undefined}
          >
            <div
              className={`
                flex items-center justify-center
                w-8 h-8 md:w-9 md:h-9
                font-display text-[14px] tracking-[0.04em]
                border transition-colors
                ${isActive
                  ? "border-kld-red bg-kld-red text-white-kld"
                  : isDone
                    ? "border-kld-red/60 text-kld-red"
                    : "border-white/10 text-gray-mid"}
              `}
            >
              {isDone && !isActive ? "✓" : s.n}
            </div>
            <div
              className={`
                font-mono text-[10px] md:text-[11px]
                tracking-[0.2em] uppercase whitespace-nowrap
                ${isActive
                  ? "text-white-kld"
                  : isDone
                    ? "text-gray-light"
                    : "text-gray-mid"}
              `}
            >
              {s.label}
            </div>

            {/* 단계 사이 구분선 — 마지막 단계에는 표시하지 않는다. */}
            {index < steps.length - 1 ? (
              <div
                className={`
                  hidden md:block w-8 h-px
                  ${isDone ? "bg-kld-red/60" : "bg-white/10"}
                `}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
