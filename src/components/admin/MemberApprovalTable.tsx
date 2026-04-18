"use client";

import { useCallback, useEffect, useState } from "react";
import {
  approveMember,
  getPendingMembers,
  rejectMember,
  type PendingMember,
} from "@/lib/admin/actions";

/**
 * 신규 회원 승인 테이블
 *
 * - pending 상태의 정회원 신청자 목록을 표시한다.
 * - 각 행에서 "승인" 또는 "반려" 를 클릭하면 해당 액션이 실행되고 목록이 갱신된다.
 */
export default function MemberApprovalTable() {
  const [members, setMembers] = useState<PendingMember[] | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  /** 목록 재로딩 — 액션 후 상태 동기화를 위해 분리 */
  const reload = useCallback(async () => {
    const data = await getPendingMembers();
    setMembers(data);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  /** 특정 id 에 대한 액션 실행 헬퍼 — approve/reject 모두 같은 패턴 */
  async function runAction(
    userId: string,
    fn: typeof approveMember,
    okMsg: string,
  ) {
    setPendingIds((prev) => new Set(prev).add(userId));
    const result = await fn(userId);
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });

    if (!result.success) {
      setFlash({ kind: "err", msg: result.error ?? "처리에 실패했습니다." });
      return;
    }
    setFlash({ kind: "ok", msg: okMsg });
    await reload();
  }

  return (
    <div>
      {/* ── 상단 메타 + 피드백 ── */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="font-mono text-[10px] tracking-[0.24em] text-gray-mid uppercase">
          {members === null
            ? "Loading..."
            : `Pending — ${String(members.length).padStart(2, "0")}`}
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

      {/* ── 테이블 ── */}
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse"
          aria-label="정회원 승인 대기 목록"
        >
          <thead>
            <tr className="border-b border-kld-red/25">
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th className="hidden md:table-cell">신청 일시</Th>
              <Th className="hidden md:table-cell">납부 방식</Th>
              <Th className="text-right">액션</Th>
            </tr>
          </thead>
          <tbody>
            {members === null ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-mid text-sm">
                  불러오는 중...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-gray-mid text-sm">
                  대기 중인 신청이 없습니다.
                </td>
              </tr>
            ) : (
              members.map((m) => {
                const isLoading = pendingIds.has(m.userId);
                return (
                  <tr
                    key={m.userId}
                    className="border-b border-white/[0.04] hover:bg-kld-red/[0.03] transition-colors"
                  >
                    <td className="px-3 py-4 text-sm text-white-kld font-medium">
                      {m.name}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-light font-light truncate max-w-[220px]">
                      {m.email}
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 font-mono text-[11px] text-gray-mid tracking-[0.08em]">
                      {formatDateTime(m.requestedAt)}
                    </td>
                    <td className="hidden md:table-cell px-3 py-4">
                      <span className="font-mono text-[10px] tracking-[0.18em] text-kld-red uppercase border border-kld-red/40 px-2 py-0.5">
                        {m.paymentMethod === "code" ? "Code" : "Online"}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            runAction(m.userId, approveMember, "승인되었습니다.")
                          }
                          className="
                            font-ui text-[11px] font-bold tracking-[0.18em] uppercase
                            text-white-kld bg-kld-red px-3.5 py-2
                            hover:bg-kld-red-light transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed
                          "
                        >
                          승인
                        </button>
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            runAction(m.userId, rejectMember, "반려되었습니다.")
                          }
                          className="
                            font-ui text-[11px] font-semibold tracking-[0.18em] uppercase
                            text-gray-light border border-white/10 px-3.5 py-2
                            hover:border-kld-red hover:text-kld-red transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed
                          "
                        >
                          반려
                        </button>
                      </div>
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

/** ISO 문자열을 "YY.MM.DD HH:mm" 로 간결 표시 */
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${String(d.getFullYear()).slice(2)}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
