"use client";

import { useState } from "react";
import type { SignupFormData } from "@/types";

/* ── Props ── */
interface Step3TermsProps {
  initialTerms: SignupFormData["terms"];
  onSubmit: (terms: SignupFormData["terms"]) => void;
  onBack: () => void;
}

/** 약관 항목 정의 — 필수/선택 구분과 표시 라벨을 한곳에 둔다. */
const TERM_ITEMS = [
  {
    key: "service" as const,
    required: true,
    label: "서비스 이용약관",
    summary:
      "KLD 의 대회 참가, 기록 관리, 계정 사용에 관한 기본 약관입니다.",
  },
  {
    key: "privacy" as const,
    required: true,
    label: "개인정보 수집·이용 동의",
    summary:
      "이름, 연락처, 경기 기록 등을 대회 운영 목적으로 수집·보관합니다.",
  },
  {
    key: "refund" as const,
    required: true,
    label: "환불 및 취소 규정",
    summary:
      "회비 및 대회 참가비 환불 정책에 동의합니다. (대회 7일 전까지 전액 환불)",
  },
  {
    key: "marketing" as const,
    required: false,
    label: "마케팅 정보 수신 동의 (선택)",
    summary:
      "대회 소식, 선수 콘텐츠 등을 이메일·SMS 로 받습니다. 언제든 해지 가능합니다.",
  },
];

/**
 * Step 3 — 약관 동의 (정회원 전용)
 *
 * - 필수 3종(서비스/개인정보/환불) 동의 시에만 "다음" 버튼이 활성화된다.
 * - "모두 동의" 체크박스로 일괄 토글할 수 있다.
 */
export default function Step3Terms({
  initialTerms,
  onSubmit,
  onBack,
}: Step3TermsProps) {
  const [terms, setTerms] = useState<SignupFormData["terms"]>(initialTerms);

  const allChecked =
    terms.service && terms.privacy && terms.refund && terms.marketing;

  const requiredChecked =
    terms.service && terms.privacy && terms.refund;

  function toggle(key: keyof SignupFormData["terms"]) {
    setTerms((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleAll() {
    const next = !allChecked;
    setTerms({
      service: next,
      privacy: next,
      refund: next,
      marketing: next,
    });
  }

  return (
    <div>
      <div className="mb-8">
        <div className="font-mono text-[10px] tracking-[0.24em] text-kld-red uppercase mb-3">
          Step 03 · Terms
        </div>
        <h2 className="font-display text-[clamp(28px,3.5vw,40px)] leading-[1.05] tracking-[0.02em] text-white-kld mb-2">
          약관 동의
        </h2>
        <p className="text-[14px] font-light leading-[1.7] text-gray-light">
          정회원 가입을 위해 아래 약관을 확인하고 동의해주세요.
          필수 항목 3가지에 모두 동의해야 다음 단계로 이동할 수 있습니다.
        </p>
      </div>

      {/* ── 모두 동의 ── */}
      <label
        className="
          flex items-center gap-3 cursor-pointer
          p-4 mb-2
          border border-kld-red/30 bg-kld-red/[0.04]
          hover:border-kld-red/60 transition-colors
        "
      >
        <input
          type="checkbox"
          checked={allChecked}
          onChange={toggleAll}
          className="sr-only peer"
        />
        <span
          className="
            w-5 h-5 border border-kld-red/40
            flex items-center justify-center shrink-0
            peer-checked:bg-kld-red peer-checked:border-kld-red
          "
          aria-hidden="true"
        >
          {allChecked ? (
            <span className="text-white-kld text-[12px] leading-none">✓</span>
          ) : null}
        </span>
        <span className="font-ui text-sm font-semibold tracking-[0.08em] uppercase text-white-kld">
          모두 동의합니다
        </span>
      </label>

      {/* ── 개별 약관 ── */}
      <ul className="flex flex-col divide-y divide-white/[0.06] border-y border-white/[0.06] mb-6">
        {TERM_ITEMS.map((item) => (
          <li key={item.key}>
            <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors">
              <input
                type="checkbox"
                checked={terms[item.key]}
                onChange={() => toggle(item.key)}
                className="sr-only peer"
              />
              <span
                className="
                  w-5 h-5 mt-0.5 border border-white/20
                  flex items-center justify-center shrink-0
                  peer-checked:bg-kld-red peer-checked:border-kld-red
                "
                aria-hidden="true"
              >
                {terms[item.key] ? (
                  <span className="text-white-kld text-[12px] leading-none">
                    ✓
                  </span>
                ) : null}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-ui text-sm font-semibold text-white-kld">
                    {item.label}
                  </span>
                  <span
                    className={`
                      font-mono text-[9px] tracking-[0.2em] uppercase
                      px-1.5 py-0.5 border
                      ${item.required
                        ? "text-kld-red border-kld-red/50"
                        : "text-gray-mid border-white/15"}
                    `}
                  >
                    {item.required ? "필수" : "선택"}
                  </span>
                </div>
                <div className="font-light text-[12px] text-gray-light leading-[1.6]">
                  {item.summary}
                </div>
              </div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="
                  font-mono text-[10px] tracking-[0.18em] uppercase
                  text-gray-mid hover:text-kld-red transition-colors
                  shrink-0 mt-1
                "
              >
                전문 보기
              </a>
            </label>
          </li>
        ))}
      </ul>

      {/* ── 내비게이션 ── */}
      <div className="flex items-center justify-between gap-3 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="
            font-ui text-[12px] font-semibold tracking-[0.2em] uppercase text-gray-light
            border border-white/10 px-5 py-3
            hover:border-kld-red hover:text-white-kld transition-colors
          "
        >
          ← 이전
        </button>
        <button
          type="button"
          disabled={!requiredChecked}
          onClick={() => onSubmit(terms)}
          className="
            inline-flex items-center justify-center
            font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-white-kld
            bg-kld-red px-6 py-4
            hover:bg-kld-red-light transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
