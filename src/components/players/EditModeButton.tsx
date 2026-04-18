"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

/* ── Props 타입 ── */
interface EditModeButtonProps {
  /** 현재 보고 있는 프로필의 선수 id */
  profileId: string;
}

/**
 * "본인 편집 모드" 버튼
 *
 * 표시 조건:
 * - 현재 로그인한 사용자의 id 가 프로필의 id 와 일치할 때만 렌더링한다.
 * - 비로그인이거나 다른 선수 프로필을 보고 있으면 아무것도 렌더링하지 않는다.
 *
 * 현재 구현은 UI 스텁(stub)이며, 클릭 시 알림만 표시한다.
 * 실제 편집 페이지(/players/[id]/edit)가 만들어지면 이 버튼을 Link 로 바꾸면 된다.
 */
export default function EditModeButton({ profileId }: EditModeButtonProps) {
  const user = useCurrentUser();

  /* 비로그인이거나 본인 프로필이 아닌 경우 버튼을 숨긴다.
     SSR 초기 HTML 에는 포함되지 않도록 클라이언트 사이드에서 판단한다. */
  if (!user || user.id !== profileId) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => {
        /* TODO: 실제 편집 페이지(/players/[id]/edit) 연결 시
           이 버튼을 Link 컴포넌트로 교체한다. */
        alert("본인 편집 모드 — 편집 페이지는 아직 구현되지 않았습니다.");
      }}
      className="
        inline-flex items-center gap-2
        font-ui text-[11px] font-bold tracking-[0.22em] uppercase
        text-kld-red
        border border-kld-red px-4 py-2.5
        bg-kld-red/[0.08]
        hover:bg-kld-red hover:text-white-kld transition-colors
      "
      aria-label="본인 프로필 편집 모드"
    >
      <span aria-hidden="true">✎</span>
      본인 편집 모드
    </button>
  );
}
