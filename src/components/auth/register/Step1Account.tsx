"use client";

import { useState } from "react";
import { signInWithKakao } from "@/lib/auth/signup";

/* ── Props ── */
interface Step1AccountProps {
  loading: boolean;
  error: string | null;
  initialEmail: string;
  onSubmit: (email: string, password: string) => void;
}

/**
 * Step 1 — 이메일/비밀번호 회원가입 + 카카오 소셜 로그인
 *
 * - 상단: 이메일 + 비밀번호 + 비밀번호 확인 입력 → "가입하기" 버튼
 * - 하단: 카카오 소셜 로그인 버튼 (즉시 OAuth 리다이렉트)
 */
export default function Step1Account({
  loading,
  error,
  initialEmail,
  onSubmit,
}: Step1AccountProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  /* 로컬 검증 에러 — 서버 에러(error prop)와 별도로 관리한다. */
  const [localError, setLocalError] = useState<string | null>(null);
  const [kakaoLoading, setKakaoLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(null);

    if (password !== passwordConfirm) {
      setLocalError("비밀번호가 일치하지 않습니다.");
      return;
    }
    onSubmit(email, password);
  }

  async function handleKakao() {
    setKakaoLoading(true);
    await signInWithKakao();
    setKakaoLoading(false);
  }

  return (
    <div>
      {/* ── 헤더 ── */}
      <div className="mb-8">
        <div className="font-mono text-[10px] tracking-[0.24em] text-kld-red uppercase mb-3">
          Step 01 · Account
        </div>
        <h2 className="font-display text-[clamp(28px,3.5vw,40px)] leading-[1.05] tracking-[0.02em] text-white-kld mb-2">
          계정 만들기
        </h2>
        <p className="text-[14px] font-light leading-[1.7] text-gray-light">
          이메일과 비밀번호로 가입하거나, 카카오로 빠르게 시작할 수 있습니다.
        </p>
      </div>

      {/* ── 이메일/비밀번호 폼 ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="이메일" htmlFor="signup-email">
          <input
            id="signup-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="input-kld"
          />
        </Field>

        <Field
          label="비밀번호"
          htmlFor="signup-password"
          hint="8자 이상"
        >
          <input
            id="signup-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-kld"
          />
        </Field>

        <Field label="비밀번호 확인" htmlFor="signup-password-confirm">
          <input
            id="signup-password-confirm"
            type="password"
            required
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="••••••••"
            className="input-kld"
          />
        </Field>

        {/* 에러 메시지 */}
        {(localError || error) ? (
          <div
            className="
              font-mono text-[11px] text-[#FF6060]
              border border-[#FF6060]/30 bg-[#FF6060]/[0.06]
              px-3 py-2.5
            "
            role="alert"
          >
            {localError || error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="
            mt-2 inline-flex items-center justify-center
            font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-white-kld
            bg-kld-red px-6 py-4
            hover:bg-kld-red-light transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? "가입 중..." : "가입하기 →"}
        </button>
      </form>

      {/* ── 구분선 ── */}
      <div
        className="flex items-center gap-3 my-7"
        aria-hidden="true"
      >
        <div className="flex-1 h-px bg-white/10" />
        <div className="font-mono text-[10px] tracking-[0.22em] text-gray-mid uppercase">
          OR
        </div>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* ── 카카오 로그인 버튼 ──
          실제 브랜드 컬러(카카오 노란색 #FEE500)를 사용한다.
          텍스트는 카카오 가이드라인에 맞춰 검정 계열로. */}
      <button
        type="button"
        onClick={handleKakao}
        disabled={kakaoLoading}
        className="
          w-full inline-flex items-center justify-center gap-2
          font-ui text-[13px] font-bold tracking-[0.14em]
          bg-[#FEE500] text-[#191600]
          px-6 py-4
          hover:bg-[#FADA0A] transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <span aria-hidden="true" className="text-lg leading-none">
          💬
        </span>
        {kakaoLoading ? "이동 중..." : "카카오로 계속하기"}
      </button>

      {/* ── 로컬 스타일 ──
          공통 input 스타일을 중복 선언하지 않기 위해 인라인 <style jsx global> 대신
          Tailwind 유틸리티로 className 에 바로 작성하는 것이 이 프로젝트 컨벤션이지만,
          form 필드가 반복되므로 className 을 상수로 관리해도 좋다. */}
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
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase flex items-center gap-2"
      >
        {label}
        {hint ? (
          <span className="normal-case tracking-normal text-[10px] text-gray-kld">
            {hint}
          </span>
        ) : null}
      </label>
      {children}
    </div>
  );
}
