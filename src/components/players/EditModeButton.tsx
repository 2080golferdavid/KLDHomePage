"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

/* ── Props 타입 ── */
interface EditModeButtonProps {
  /** 현재 보고 있는 프로필의 선수 id */
  profileId: string;
}

/**
 * 본인 편집 모드 버튼.
 * 로그인 사용자 id == 프로필 id 일 때만 렌더링.
 * 실제 편집 페이지 구현 전까지는 알림만 띄운다.
 */
export default function EditModeButton({ profileId }: EditModeButtonProps) {
  const user = useCurrentUser();

  if (!user || user.id !== profileId) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() =>
        alert("본인 편집 모드 — 편집 페이지는 아직 구현되지 않았습니다.")
      }
      className="btn btn-secondary"
      aria-label="본인 프로필 편집"
    >
      <span aria-hidden="true">✎</span>
      EDIT PROFILE · 본인 편집
    </button>
  );
}
