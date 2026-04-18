"use client";

import { useState } from "react";

/* ── Props ── */
interface Step4PaymentProps {
  loading: boolean;
  error: string | null;
  onPayOnline: () => void;
  onSubmitCode: (code: string) => void;
  onBack: () => void;
}

/**
 * Step 4 — 회비 납부 (정회원 전용)
 *
 * 두 가지 옵션을 탭처럼 제공:
 *  (A) 온라인 결제 — 버튼 클릭 시 PG 결제창 호출(현재 스텁)
 *  (B) 인증코드 입력 — 미리 발급받은 코드를 입력해 정회원으로 전환
 *
 * 두 방식 모두 성공하면 훅에서 paymentCompleted=true 가 저장되고
 * 다음 스텝(5)으로 전환된다.
 */
export default function Step4Payment({
  loading,
  error,
  onPayOnline,
  onSubmitCode,
  onBack,
}: Step4PaymentProps) {
  const [method, setMethod] = useState<"online" | "code">("online");
  const [code, setCode] = useState("");

  return (
    <div>
      <div className="mb-8">
        <div className="font-mono text-[10px] tracking-[0.24em] text-kld-red uppercase mb-3">
          Step 04 · Payment
        </div>
        <h2 className="font-display text-[clamp(28px,3.5vw,40px)] leading-[1.05] tracking-[0.02em] text-white-kld mb-2">
          회비 납부
        </h2>
        <p className="text-[14px] font-light leading-[1.7] text-gray-light">
          정회원 연회비는{" "}
          <strong className="text-white-kld font-semibold">100,000원</strong>
          입니다. 온라인 결제 또는 미리 발급받은 인증코드로 납부할 수 있습니다.
        </p>
      </div>

      {/* ── 방식 선택 탭 ── */}
      <div
        className="flex border border-kld-red/20 mb-6"
        role="tablist"
        aria-label="납부 방식 선택"
      >
        <button
          type="button"
          role="tab"
          aria-selected={method === "online"}
          onClick={() => setMethod("online")}
          className={`
            flex-1 font-ui text-[12px] font-semibold tracking-[0.14em] uppercase
            px-4 py-3 border-r border-kld-red/20 transition-colors
            ${method === "online"
              ? "bg-kld-red text-white-kld"
              : "text-gray-mid hover:text-white-kld"}
          `}
        >
          온라인 결제
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={method === "code"}
          onClick={() => setMethod("code")}
          className={`
            flex-1 font-ui text-[12px] font-semibold tracking-[0.14em] uppercase
            px-4 py-3 transition-colors
            ${method === "code"
              ? "bg-kld-red text-white-kld"
              : "text-gray-mid hover:text-white-kld"}
          `}
        >
          인증코드 입력
        </button>
      </div>

      {/* ── 패널: 온라인 결제 ── */}
      {method === "online" ? (
        <div
          className="
            flex flex-col p-6 md:p-7
            bg-dark-200 border border-kld-red/[0.15] mb-6
          "
          role="tabpanel"
          aria-label="온라인 결제"
        >
          <dl className="flex flex-col gap-3 mb-6">
            <div className="flex items-center justify-between">
              <dt className="font-mono text-[11px] tracking-[0.18em] text-gray-mid uppercase">
                항목
              </dt>
              <dd className="text-sm text-white-kld">KLD 2025 정회원 연회비</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-mono text-[11px] tracking-[0.18em] text-gray-mid uppercase">
                결제 금액
              </dt>
              <dd className="font-display text-[32px] leading-none text-kld-red">
                100,000<span className="font-mono text-[11px] text-gray-mid ml-1">KRW</span>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-mono text-[11px] tracking-[0.18em] text-gray-mid uppercase">
                결제 수단
              </dt>
              <dd className="text-sm text-gray-light">
                카드 / 계좌이체 / 간편결제
              </dd>
            </div>
          </dl>

          <button
            type="button"
            disabled={loading}
            onClick={onPayOnline}
            className="
              inline-flex items-center justify-center
              font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-white-kld
              bg-kld-red px-6 py-4
              hover:bg-kld-red-light transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "결제 진행 중..." : "결제창 열기 →"}
          </button>

          <p className="font-mono text-[11px] text-gray-mid mt-4 leading-[1.6]">
            ※ 결제 완료 후 자동으로 다음 단계로 이동합니다.
          </p>
        </div>
      ) : null}

      {/* ── 패널: 인증코드 ── */}
      {method === "code" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitCode(code);
          }}
          className="
            flex flex-col p-6 md:p-7
            bg-dark-200 border border-kld-red/[0.15] mb-6
          "
          role="tabpanel"
          aria-label="인증코드 입력"
        >
          <label htmlFor="payment-code" className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase mb-2">
            인증코드
          </label>
          <input
            id="payment-code"
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="예) KLD-DEMO-2025"
            className="
              w-full px-4 py-3.5
              bg-dark-300 border border-kld-red/20
              text-sm text-white-kld placeholder:text-gray-mid
              focus:outline-none focus:border-kld-red
              font-mono tracking-[0.1em] uppercase
              transition-colors
            "
          />
          <p className="font-mono text-[11px] text-gray-mid mt-3 leading-[1.6]">
            ※ 오프라인 납부 또는 운영팀에서 발급받은 1회성 코드를 입력하세요.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="
              mt-5 inline-flex items-center justify-center
              font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-white-kld
              bg-kld-red px-6 py-4
              hover:bg-kld-red-light transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "확인 중..." : "코드 확인 →"}
          </button>
        </form>
      ) : null}

      {/* ── 에러 ── */}
      {error ? (
        <div
          className="
            font-mono text-[11px] text-[#FF6060]
            border border-[#FF6060]/30 bg-[#FF6060]/[0.06]
            px-3 py-2.5 mb-6
          "
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {/* ── 내비게이션 ── */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="
            font-ui text-[12px] font-semibold tracking-[0.2em] uppercase text-gray-light
            border border-white/10 px-5 py-3
            hover:border-kld-red hover:text-white-kld transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          ← 이전
        </button>
      </div>
    </div>
  );
}
