"use client";

import { useEffect } from "react";

/* ── Props ── */
export interface ToastState {
  message: string;
  kind?: "success" | "error";
}

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
  /** 자동 닫힘 시간(ms). 기본 3000. */
  autoDismissMs?: number;
}

/**
 * 화면 하단 중앙에 잠깐 나타났다 사라지는 토스트(Toast) 알림.
 *
 * - 부모가 `toast` 상태를 보유하고, 토스트 표시를 원할 때 setter 로 설정한다.
 * - 자동 닫힘은 여기서 setTimeout 으로 처리하며, 메시지가 바뀌면 타이머가 리셋된다.
 */
export default function Toast({
  toast,
  onDismiss,
  autoDismissMs = 3000,
}: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => onDismiss(), autoDismissMs);
    return () => window.clearTimeout(id);
  }, [toast, onDismiss, autoDismissMs]);

  if (!toast) return null;

  const isError = toast.kind === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={`
        fixed left-1/2 -translate-x-1/2
        bottom-6 md:bottom-10
        z-[300]
        max-w-[90vw]
        px-5 py-3
        font-ui text-[13px] font-semibold tracking-[0.1em]
        border shadow-[0_8px_24px_rgba(0,0,0,0.4)]
        flex items-center gap-2.5
        ${isError
          ? "bg-[#1f0606] border-[#FF6060] text-[#FF9090]"
          : "bg-[#081a0c] border-[#5FD17A] text-[#A8E6B6]"}
      `}
    >
      <span aria-hidden="true">{isError ? "✕" : "✓"}</span>
      <span>{toast.message}</span>
    </div>
  );
}
