"use client";

import Link from "next/link";
import SignupProgress from "@/components/auth/register/SignupProgress";
import Step1Account from "@/components/auth/register/Step1Account";
import Step2Membership from "@/components/auth/register/Step2Membership";
import Step3Terms from "@/components/auth/register/Step3Terms";
import Step4Payment from "@/components/auth/register/Step4Payment";
import Step5Profile from "@/components/auth/register/Step5Profile";
import StepDone from "@/components/auth/register/StepDone";
import { useSignupFlow } from "@/hooks/useSignupFlow";

/**
 * 회원가입(Register) 페이지 — 5단계 + 완료 화면
 *
 * 페이지 전체를 클라이언트 컴포넌트(Client Component)로 구성한다.
 *  - 모든 스텝이 사용자 입력에 따라 진행되므로 SSR 이점이 작고,
 *    상태 공유(useSignupFlow 훅)가 한 트리 안에서 이루어져야 한다.
 *  - SEO 상 중요한 페이지가 아니므로 이 선택이 합리적이다.
 *
 * 각 스텝은 독립 파일로 분리되어 있으며, 훅이 반환한 액션과 데이터를
 * 필요한 만큼만 props 로 전달한다(컴포넌트 간 결합도를 낮춘다).
 */
export default function RegisterPage() {
  const flow = useSignupFlow();

  return (
    <main className="pt-nav bg-dark min-h-screen">
      <section
        className="
          mx-auto w-full max-w-[640px]
          px-5 md:px-8
          pt-14 md:pt-20 pb-24
        "
      >
        {/* ── 상단 헤더: 가입 타이틀 + 로그인 링크 ── */}
        <header className="flex items-start justify-between gap-4 mb-10">
          <div>
            <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-2">
              KLD Register
            </div>
            <h1 className="font-display text-[clamp(34px,4.5vw,56px)] leading-[1] tracking-[0.02em] text-white-kld">
              회원가입
            </h1>
          </div>
          {flow.step !== 6 ? (
            <Link
              href="/auth/login"
              className="
                font-mono text-[10px] tracking-[0.2em] uppercase
                text-gray-mid hover:text-kld-red transition-colors
                whitespace-nowrap pt-2
              "
            >
              이미 계정이 있나요?
            </Link>
          ) : null}
        </header>

        {/* ── 진행 바 — 완료 화면에서는 숨긴다. ── */}
        {flow.step !== 6 ? (
          <SignupProgress
            currentStep={flow.step}
            membership={flow.data.membership}
          />
        ) : null}

        {/* ════════════════════
            스텝 전환
        ════════════════════ */}
        {flow.step === 1 ? (
          <Step1Account
            loading={flow.loading}
            error={flow.error}
            initialEmail={flow.data.email}
            onSubmit={flow.submitStep1}
          />
        ) : null}

        {flow.step === 2 ? (
          <Step2Membership
            onSubmit={flow.submitStep2}
            onBack={flow.goBack}
          />
        ) : null}

        {flow.step === 3 ? (
          <Step3Terms
            initialTerms={flow.data.terms}
            onSubmit={flow.submitStep3}
            onBack={flow.goBack}
          />
        ) : null}

        {flow.step === 4 ? (
          <Step4Payment
            loading={flow.loading}
            error={flow.error}
            onPayOnline={flow.submitStep4Online}
            onSubmitCode={flow.submitStep4Code}
            onBack={flow.goBack}
          />
        ) : null}

        {flow.step === 5 ? (
          <Step5Profile
            loading={flow.loading}
            error={flow.error}
            initialProfile={flow.data.profile}
            onSubmit={flow.submitStep5}
            onBack={flow.goBack}
          />
        ) : null}

        {flow.step === 6 ? <StepDone data={flow.data} /> : null}
      </section>
    </main>
  );
}
