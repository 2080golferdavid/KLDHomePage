"use client";

import { useState } from "react";
import type { Division, SignupFormData } from "@/types";

/* ── Props ── */
interface Step5ProfileProps {
  loading: boolean;
  error: string | null;
  initialProfile: SignupFormData["profile"];
  onSubmit: (profile: SignupFormData["profile"]) => void;
  onBack: () => void;
}

/** 디비전 옵션 — DB enum 과 값 일치 */
const DIVISION_OPTIONS: Division[] = [
  "아마추어",
  "마스터즈",
  "우먼스",
  "오픈",
];

const HAND_OPTIONS: SignupFormData["profile"]["dominantHand"][] = [
  "오른손",
  "왼손",
];

/**
 * Step 5 — 선수 프로필 초기 입력
 *
 * 필수 입력:
 *  - 이름, 연락처, 지역, 디비전
 * 선택 입력:
 *  - 자기소개(bio), 주 사용 손
 *
 * 제출 시 훅에서 public.players insert + public.users name 업데이트를 수행한다.
 */
export default function Step5Profile({
  loading,
  error,
  initialProfile,
  onSubmit,
  onBack,
}: Step5ProfileProps) {
  const [profile, setProfile] =
    useState<SignupFormData["profile"]>(initialProfile);

  function update<K extends keyof SignupFormData["profile"]>(
    key: K,
    value: SignupFormData["profile"][K],
  ) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  const canSubmit =
    profile.name.trim().length > 0 &&
    profile.phone.trim().length > 0 &&
    profile.region.trim().length > 0 &&
    profile.division !== "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(profile);
  }

  return (
    <div>
      <div className="mb-8">
        <div className="font-mono text-[10px] tracking-[0.24em] text-kld-green uppercase mb-3">
          Step 05 · Profile
        </div>
        <h2 className="font-display text-[clamp(28px,3.5vw,40px)] leading-[1.05] tracking-[0.02em] text-white-kld mb-2">
          선수 프로필 입력
        </h2>
        <p className="text-[14px] font-light leading-[1.7] text-gray-light">
          선수 페이지에 노출될 기본 프로필입니다. 이후 본인 편집 모드에서
          사진·장비·소개를 추가로 업데이트할 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 이름 + 연락처 (2열 on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="이름" htmlFor="profile-name" required>
            <input
              id="profile-name"
              type="text"
              required
              value={profile.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="홍길동"
              className="input-kld"
            />
          </Field>
          <Field label="연락처" htmlFor="profile-phone" required>
            <input
              id="profile-phone"
              type="tel"
              required
              inputMode="tel"
              value={profile.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="010-0000-0000"
              className="input-kld"
            />
          </Field>
        </div>

        {/* 지역 + 디비전 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="활동 지역" htmlFor="profile-region" required>
            <input
              id="profile-region"
              type="text"
              required
              value={profile.region}
              onChange={(e) => update("region", e.target.value)}
              placeholder="예) SEOUL"
              className="input-kld"
            />
          </Field>
          <Field label="디비전" htmlFor="profile-division" required>
            <select
              id="profile-division"
              required
              value={profile.division}
              onChange={(e) =>
                update("division", e.target.value as Division | "")
              }
              className="input-kld"
            >
              <option value="">디비전 선택</option>
              {DIVISION_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* 주 사용 손 — 세그먼트 버튼 */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase">
            주 사용 손
          </span>
          <div
            className="flex border border-kld-green/20"
            role="radiogroup"
            aria-label="주 사용 손"
          >
            {HAND_OPTIONS.map((opt) => {
              const active = profile.dominantHand === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => update("dominantHand", opt)}
                  className={`
                    flex-1 font-ui text-[12px] font-semibold tracking-[0.14em]
                    px-4 py-3 border-r border-kld-green/20 last:border-r-0
                    transition-colors
                    ${active
                      ? "bg-kld-green text-kld-black"
                      : "text-gray-mid hover:text-white-kld"}
                  `}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* 자기소개 */}
        <Field label="자기소개 (선택)" htmlFor="profile-bio">
          <textarea
            id="profile-bio"
            rows={4}
            value={profile.bio}
            onChange={(e) => update("bio", e.target.value)}
            placeholder="간단한 소개, 주특기, 목표 등을 자유롭게 작성해주세요."
            className="input-kld resize-none"
          />
        </Field>

        {/* 에러 */}
        {error ? (
          <div
            className="
              font-mono text-[11px] text-[#FF6060]
              border border-[#FF6060]/30 bg-[#FF6060]/[0.06]
              px-3 py-2.5
            "
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {/* 내비게이션 */}
        <div className="flex items-center justify-between gap-3 mt-3">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="
              font-ui text-[12px] font-semibold tracking-[0.2em] uppercase text-gray-light
              border border-white/10 px-5 py-3
              hover:border-kld-green hover:text-white-kld transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            ← 이전
          </button>
          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="
              inline-flex items-center justify-center
              font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-kld-black
              bg-kld-green px-6 py-4
              hover:bg-kld-green-600 transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {loading ? "저장 중..." : "가입 완료 →"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .input-kld {
          width: 100%;
          padding: 0.875rem 1rem;
          background: #1a1a1a;
          border: 1px solid rgba(196, 30, 30, 0.2);
          color: #f5f5f5;
          font-size: 14px;
          transition: border-color 150ms;
        }
        .input-kld::placeholder {
          color: #888888;
        }
        .input-kld:focus {
          outline: none;
          border-color: #c41e1e;
        }
      `}</style>
    </div>
  );
}

/* ── 내부 헬퍼: Label + 입력 슬롯 ── */
interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, htmlFor, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase flex items-center gap-2"
      >
        {label}
        {required ? (
          <span className="text-kld-green" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
    </div>
  );
}
