"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getPaymentCodes,
  issuePaymentCode,
  revokePaymentCode,
  type PaymentCodeRow,
} from "@/lib/admin/actions";

/**
 * 인증코드 발급/관리 테이블
 *
 * - 상단: "코드 발급" 버튼 → issuePaymentCode 호출 → 테이블 최상단에 추가
 * - 테이블: 코드, 발급일, 사용자, 사용일, 상태, 폐기 버튼
 * - 이미 사용된 코드는 폐기 불가(감사 추적 목적)
 */
export default function PaymentCodesTable() {
  const [codes, setCodes] = useState<PaymentCodeRow[] | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const reload = useCallback(async () => {
    const data = await getPaymentCodes();
    setCodes(data);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  async function handleIssue() {
    setIssuing(true);
    const result = await issuePaymentCode();
    setIssuing(false);

    if (!result.success || !result.code) {
      setFlash({ kind: "err", msg: result.error ?? "발급에 실패했습니다." });
      return;
    }
    setFlash({
      kind: "ok",
      msg: `코드 발급 완료: ${result.code.code}`,
    });
    await reload();
  }

  async function handleRevoke(id: string) {
    setPendingIds((prev) => new Set(prev).add(id));
    const result = await revokePaymentCode(id);
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    if (!result.success) {
      setFlash({ kind: "err", msg: result.error ?? "폐기에 실패했습니다." });
      return;
    }
    setFlash({ kind: "ok", msg: "코드가 폐기되었습니다." });
    await reload();
  }

  /** 클립보드 복사 — 발급한 코드를 관리자에게 빠르게 전달할 수 있도록 */
  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setFlash({ kind: "ok", msg: `복사됨: ${code}` });
    } catch {
      setFlash({ kind: "err", msg: "클립보드 복사에 실패했습니다." });
    }
  }

  const unusedCount = codes?.filter((c) => !c.usedBy).length ?? 0;

  return (
    <div>
      {/* ── 상단: 요약 + 발급 버튼 + 피드백 ── */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="font-mono text-[10px] tracking-[0.24em] text-gray-mid uppercase">
            {codes === null
              ? "Loading..."
              : `Total — ${String(codes.length).padStart(2, "0")} · Unused — ${String(unusedCount).padStart(2, "0")}`}
          </div>
          {flash ? (
            <div
              role="status"
              className={`
                font-mono text-[11px] px-3 py-1.5 border
                ${flash.kind === "ok"
                  ? "text-[#5FD17A] border-[#5FD17A]/30 bg-[#5FD17A]/[0.06]"
                  : "text-[#FF6060] border-[#FF6060]/30 bg-[#FF6060]/[0.06]"}
              `}
            >
              {flash.msg}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleIssue}
          disabled={issuing}
          className="
            font-ui text-[12px] font-bold tracking-[0.2em] uppercase
            text-white-kld bg-kld-red px-5 py-3
            hover:bg-kld-red-light transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {issuing ? "발급 중..." : "+ 코드 발급"}
        </button>
      </div>

      {/* ── 테이블 ── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" aria-label="인증코드 목록">
          <thead>
            <tr className="border-b border-kld-red/25">
              <Th>코드</Th>
              <Th className="hidden md:table-cell">발급일</Th>
              <Th className="hidden md:table-cell">사용자</Th>
              <Th className="hidden md:table-cell">사용일</Th>
              <Th>상태</Th>
              <Th className="text-right">액션</Th>
            </tr>
          </thead>
          <tbody>
            {codes === null ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-gray-mid text-sm">
                  불러오는 중...
                </td>
              </tr>
            ) : codes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-gray-mid text-sm">
                  발급된 인증코드가 없습니다.
                </td>
              </tr>
            ) : (
              codes.map((c) => {
                const isLoading = pendingIds.has(c.id);
                const used = Boolean(c.usedBy);
                return (
                  <tr
                    key={c.id}
                    className="border-b border-white/[0.04] hover:bg-kld-red/[0.03] transition-colors"
                  >
                    {/* 코드 */}
                    <td className="px-3 py-4">
                      <button
                        type="button"
                        onClick={() => copyCode(c.code)}
                        className="
                          font-mono text-[12px] tracking-[0.08em]
                          text-white-kld
                          hover:text-kld-red transition-colors
                          text-left
                        "
                        title="클릭하면 복사됩니다"
                      >
                        {c.code}
                      </button>
                    </td>

                    {/* 발급일 */}
                    <td className="hidden md:table-cell px-3 py-4 font-mono text-[11px] text-gray-mid tracking-[0.08em]">
                      {formatDateTime(c.createdAt)}
                    </td>

                    {/* 사용자 */}
                    <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-light">
                      {c.usedByName ?? "—"}
                    </td>

                    {/* 사용일 */}
                    <td className="hidden md:table-cell px-3 py-4 font-mono text-[11px] text-gray-mid tracking-[0.08em]">
                      {c.usedAt ? formatDateTime(c.usedAt) : "—"}
                    </td>

                    {/* 상태 */}
                    <td className="px-3 py-4">
                      <span
                        className={`
                          font-mono text-[9px] tracking-[0.2em] uppercase
                          px-2 py-0.5 border
                          ${used
                            ? "text-gray-mid border-white/15"
                            : "text-kld-red border-kld-red/50"}
                        `}
                      >
                        {used ? "Used" : "Unused"}
                      </span>
                    </td>

                    {/* 액션 */}
                    <td className="px-3 py-4 text-right">
                      <button
                        type="button"
                        disabled={used || isLoading}
                        onClick={() => handleRevoke(c.id)}
                        className="
                          font-ui text-[11px] font-semibold tracking-[0.18em] uppercase
                          text-gray-light border border-white/10 px-3.5 py-2
                          hover:border-kld-red hover:text-kld-red transition-colors
                          disabled:opacity-40 disabled:cursor-not-allowed
                        "
                        aria-label={`${c.code} 폐기`}
                      >
                        폐기
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── 내부 헬퍼 ── */

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`
        font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase
        text-left px-3 py-3 font-normal whitespace-nowrap
        ${className}
      `}
    >
      {children}
    </th>
  );
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${String(d.getFullYear()).slice(2)}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
