"use client";

import Link from "next/link";
import type { SignupFormData } from "@/types";

/* ── Props ── */
interface StepDoneProps {
  data: SignupFormData;
}

/**
 * 회원가입 완료 화면 (Step 6 가상 단계)
 * - 가입된 계정 정보를 요약 표시
 * - 홈/선수 목록/대회 일정으로 이어가는 CTA 버튼
 */
export default function StepDone({ data }: StepDoneProps) {
  const membershipLabel =
    data.membership === "full" ? "정회원" : "일반회원";

  return (
    <div className="flex flex-col items-center text-center py-6">
      {/* ── 대형 체크 ── */}
      <div
        className="
          w-[84px] h-[84px] mb-7
          border-2 border-kld-green
          flex items-center justify-center
          font-display text-[48px] text-kld-green
        "
        aria-hidden="true"
      >
        ✓
      </div>

      <div className="font-mono text-[10px] tracking-[0.26em] text-kld-green uppercase mb-3">
        Welcome to KLD
      </div>
      <h2 className="font-display text-[clamp(32px,4vw,52px)] leading-[1.02] tracking-[0.02em] text-white-kld mb-4">
        가입이 완료되었습니다
      </h2>
      <p className="text-[14px] font-light leading-[1.75] text-gray-light max-w-[480px] mb-8">
        {data.profile.name
          ? `${data.profile.name} 선수님,`
          : "환영합니다,"}{" "}
        KLD {membershipLabel}으로 등록되었습니다.
        {data.membership === "full"
          ? " 지금 바로 예정된 대회에 참가 신청을 진행하실 수 있습니다."
          : " 선수 목록과 대회 일정을 자유롭게 둘러보세요."}
      </p>

      {/* ── 요약 정보 ── */}
      <dl className="w-full max-w-[440px] grid grid-cols-2 gap-4 mb-9 text-left">
        <SummaryItem label="이메일" value={data.email} />
        <SummaryItem label="등급" value={membershipLabel} />
        {data.profile.division ? (
          <SummaryItem label="디비전" value={data.profile.division} />
        ) : null}
        {data.profile.region ? (
          <SummaryItem label="지역" value={data.profile.region} />
        ) : null}
      </dl>

      {/* ── CTA ── */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[440px]">
        <Link
          href={data.membership === "full" ? "/competitions" : "/players"}
          className="
            flex-1 inline-flex items-center justify-center
            font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-kld-black
            bg-kld-green px-6 py-4
            hover:bg-kld-green-600 transition-colors
          "
        >
          {data.membership === "full" ? "대회 둘러보기" : "선수 둘러보기"} →
        </Link>
        <Link
          href="/"
          className="
            flex-1 inline-flex items-center justify-center
            font-ui text-[13px] font-semibold tracking-[0.22em] uppercase text-gray-light
            border border-white/10 px-6 py-4
            hover:border-kld-green hover:text-white-kld transition-colors
          "
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}

/* ── 내부 헬퍼: 요약 항목 ── */
interface SummaryItemProps {
  label: string;
  value: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-dark-200 border border-kld-green/[0.12]">
      <dt className="font-mono text-[9px] tracking-[0.22em] text-gray-mid uppercase">
        {label}
      </dt>
      <dd className="text-sm text-white-kld font-medium truncate">{value}</dd>
    </div>
  );
}
