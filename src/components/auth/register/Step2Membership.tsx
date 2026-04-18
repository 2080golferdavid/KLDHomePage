"use client";

import { useState } from "react";
import type { MembershipTier } from "@/types";

/* ── Props ── */
interface Step2MembershipProps {
  onSubmit: (membership: MembershipTier) => void;
  onBack: () => void;
}

/**
 * Step 2 — 회원 등급 선택
 *
 * - 일반회원(general): 무료. 뉴스레터 구독과 기록 열람만 가능.
 * - 정회원(full): 유료. 대회 신청, 포인트 집계, 선수 프로필 공개 가능.
 *
 * 선택 후 "다음" 버튼을 눌러야 플로우가 진행된다.
 * (바로 전환하지 않는 이유: 설명을 충분히 읽도록 유도)
 */
export default function Step2Membership({
  onSubmit,
  onBack,
}: Step2MembershipProps) {
  const [selected, setSelected] = useState<MembershipTier | null>(null);

  return (
    <div>
      <div className="mb-8">
        <div className="font-mono text-[10px] tracking-[0.24em] text-kld-red uppercase mb-3">
          Step 02 · Membership
        </div>
        <h2 className="font-display text-[clamp(28px,3.5vw,40px)] leading-[1.05] tracking-[0.02em] text-white-kld mb-2">
          회원 등급 선택
        </h2>
        <p className="text-[14px] font-light leading-[1.7] text-gray-light">
          회원 등급에 따라 이용 가능한 기능이 다릅니다. 정회원은 대회 신청이
          가능하며, 연회비가 부과됩니다.
        </p>
      </div>

      {/* ── 카드 2개 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-6">
        <TierCard
          tier="general"
          title="일반회원"
          subtitle="Free"
          features={[
            "대회 일정 및 결과 열람",
            "선수 랭킹 조회",
            "뉴스레터 수신",
          ]}
          isSelected={selected === "general"}
          onSelect={() => setSelected("general")}
        />
        <TierCard
          tier="full"
          title="정회원"
          subtitle="Annual Fee"
          features={[
            "일반회원의 모든 기능",
            "대회 신청 및 참가",
            "시즌 포인트 집계",
            "공식 선수 프로필 공개",
          ]}
          isSelected={selected === "full"}
          onSelect={() => setSelected("full")}
          emphasized
        />
      </div>

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
          disabled={!selected}
          onClick={() => selected && onSubmit(selected)}
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

/* ── 내부 헬퍼: 등급 카드 ── */
interface TierCardProps {
  tier: MembershipTier;
  title: string;
  subtitle: string;
  features: string[];
  isSelected: boolean;
  onSelect: () => void;
  /** true 면 우선 추천(정회원)으로 강조 표시 */
  emphasized?: boolean;
}

function TierCard({
  tier,
  title,
  subtitle,
  features,
  isSelected,
  onSelect,
  emphasized,
}: TierCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={`
        group relative text-left
        flex flex-col
        p-6 md:p-7
        bg-dark-200 border transition-all
        ${isSelected
          ? "border-kld-red ring-1 ring-kld-red"
          : "border-kld-red/[0.15] hover:border-kld-red/50"}
      `}
    >
      {emphasized ? (
        <div className="absolute top-0 right-0 font-mono text-[9px] tracking-[0.2em] uppercase bg-kld-red text-white-kld px-2.5 py-1">
          Recommended
        </div>
      ) : null}

      <div className="font-mono text-[10px] tracking-[0.22em] text-kld-red uppercase mb-2">
        {subtitle}
      </div>
      <div className="font-display text-[32px] leading-none tracking-[0.02em] text-white-kld mb-5">
        {title}
      </div>

      <ul className="flex flex-col gap-2 mb-6">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-[13px] font-light text-gray-light"
          >
            <span
              className="text-kld-red mt-0.5 shrink-0"
              aria-hidden="true"
            >
              ▸
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div
        className={`
          mt-auto font-ui text-[11px] font-bold tracking-[0.2em] uppercase
          border px-3 py-2 text-center
          ${isSelected
            ? "bg-kld-red border-kld-red text-white-kld"
            : "border-white/10 text-gray-light group-hover:border-kld-red/60"}
        `}
        aria-hidden="true"
      >
        {isSelected ? `${tier === "full" ? "정회원" : "일반회원"} 선택됨` : "선택하기"}
      </div>
    </button>
  );
}
