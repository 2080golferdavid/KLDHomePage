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
 * 회원가입(Register) 페이지 — 5단계 + 완료 화면.
 * 페이지 전체가 클라이언트 컴포넌트. 상태 공유는 useSignupFlow 훅이 담당.
 */
export default function RegisterPage() {
  const flow = useSignupFlow();

  return (
    <main style={{ minHeight: "100vh", paddingTop: 140, paddingBottom: 96 }}>
      <div className="wrap" style={{ maxWidth: 720 }}>
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 32,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="sec-eyebrow">JOIN KLD · 회원가입</div>
            <h1
              className="sec-title"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              REGISTER<span className="kr">KLD 계정 만들기</span>
            </h1>
          </div>
          {flow.step !== 6 ? (
            <Link
              href="/auth/login"
              className="btn btn-ghost"
              style={{ marginTop: 8 }}
            >
              이미 계정이 있으신가요? <span className="arrow">→</span>
            </Link>
          ) : null}
        </header>

        {flow.step !== 6 ? (
          <SignupProgress
            currentStep={flow.step}
            membership={flow.data.membership}
          />
        ) : null}

        {flow.step === 1 ? (
          <Step1Account
            loading={flow.loading}
            error={flow.error}
            initialEmail={flow.data.email}
            onSubmit={flow.submitStep1}
          />
        ) : null}

        {flow.step === 2 ? (
          <Step2Membership onSubmit={flow.submitStep2} onBack={flow.goBack} />
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
      </div>
    </main>
  );
}
