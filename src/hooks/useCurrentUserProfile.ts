"use client";

import { useEffect, useState } from "react";
import { useCurrentUser, type MemberTier } from "@/hooks/useCurrentUser";
import { getPlayerById } from "@/data/players";
import type { PlayerProfile } from "@/types";

/* ══════════════════════════════════════════
   로그인한 사용자 + 표시용 프로필 통합 훅.

   - Nav 의 아바타/이름 표시, 마이페이지의 프로필 카드 등에 재사용.
   - Player 레코드가 아직 없는 사용자(관리자·가입 직후 등)는 profile=null.
     UI 측은 user.name, user.id 등으로 fallback.

   Supabase 연결 시:
   - 본 훅 내부만 `supabase.from('users').select(...)` +
     `supabase.from('players').select(...)` 등으로 교체하면 된다.
══════════════════════════════════════════ */

export interface CurrentUserProfile {
  /** 로그인 여부가 확정되기 전에는 loading=true */
  loading: boolean;
  /** 비로그인이면 null */
  userId: string | null;
  role: string | null;
  memberType: MemberTier;
  /** 이름 우선순위: user.name → profile.name → null */
  name: string | null;
  /** 선수 프로필. 없으면 null */
  profile: PlayerProfile | null;
}

export function useCurrentUserProfile(): CurrentUserProfile {
  const user = useCurrentUser();

  /* useCurrentUser 는 마운트 직후 한 번은 null 을 반환한다.
     "아직 로그인 상태를 모른다" 단계를 구분하기 위한 플래그. */
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    setCheckedAuth(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    let cancelled = false;
    setLoadingProfile(true);
    getPlayerById(user.id).then((p) => {
      if (cancelled) return;
      setProfile(p);
      setLoadingProfile(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return {
    loading: !checkedAuth || loadingProfile,
    userId: user?.id ?? null,
    role: user?.role ?? null,
    memberType: user?.memberType ?? "general",
    name: user?.name ?? profile?.name ?? null,
    profile,
  };
}
