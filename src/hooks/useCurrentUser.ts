"use client";

import { useEffect, useState } from "react";

/* ══════════════════════════════════════════
   현재 로그인한 사용자를 추적하는 커스텀 훅(Hook)

   현재 구현:
   - 브라우저 localStorage 의 두 키를 읽어 로그인 상태를 흉내 낸다.
       kld:currentUserId    → 사용자 id (필수)
       kld:currentUserRole  → 역할 문자열 (선택, 예: 'admin')
   - 값이 없으면 `null`(비로그인) 을 반환한다.
   - 다른 탭/창에서 값이 바뀌면 storage 이벤트로 동기화된다.

   향후 교체:
   - 실제 인증 시스템(Supabase Auth, NextAuth 등) 연동 시
     내부 구현만 교체하면 되고, 호출 측 컴포넌트는 수정 불필요.

   테스트 방법:
   - 일반 사용자 로그인:
       localStorage.setItem('kld:currentUserId', 'kim-taehun')
   - 관리자 로그인:
       localStorage.setItem('kld:currentUserId', 'admin-seed')
       localStorage.setItem('kld:currentUserRole', 'admin')
══════════════════════════════════════════ */

const STORAGE_KEY_ID = "kld:currentUserId";
const STORAGE_KEY_ROLE = "kld:currentUserRole";

export interface CurrentUser {
  id: string;
  /** 로그인한 사용자의 역할. 'admin' 이면 관리자. null 이면 일반 사용자. */
  role: string | null;
}

export function useCurrentUser(): CurrentUser | null {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    /* 최초 마운트 시 localStorage 에서 로그인 상태를 읽는다.
       SSR 환경에서는 window 가 없으므로 useEffect 내부에서만 접근한다. */
    function read(): CurrentUser | null {
      const id = window.localStorage.getItem(STORAGE_KEY_ID);
      if (!id) return null;
      const role = window.localStorage.getItem(STORAGE_KEY_ROLE);
      return { id, role: role || null };
    }
    setUser(read());

    /* 다른 탭에서 로그인 상태가 변경되면 동기화한다. */
    function handleStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY_ID && event.key !== STORAGE_KEY_ROLE) {
        return;
      }
      setUser(read());
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return user;
}

/**
 * 관리자 여부를 반환하는 헬퍼 훅.
 *
 * ⚠️ 보안 주의 (학습자용 설명):
 * 이 훅은 현재 localStorage 에 저장된 role 을 읽어 판정한다. 실제 Supabase 연동 시에는
 * 두 곳 중 "반드시 app_metadata.role" 을 사용해야 한다.
 *
 *   - user_metadata : 사용자 본인이 API 로 수정 가능 → 권한 체크에 사용하면 안 됨
 *   - app_metadata  : 서버/관리자만 설정 가능       → 권한 체크에 안전
 *
 * Supabase 실제 연결 코드 예시:
 *
 *   const { data: { session } } = await supabase.auth.getSession();
 *   const meta = session?.user?.app_metadata ?? {};
 *   const userMeta = session?.user?.user_metadata ?? {};
 *   const isAdmin = meta.role === 'admin' || userMeta.role === 'admin';
 *
 * 본 구현은 요청에 따라 두 값 모두(app_metadata / user_metadata) 를 허용하지만,
 * 프론트엔드 체크는 "표시용" 일 뿐이며 실제 권한 차단은 RLS 가 담당한다.
 */
export function useIsAdmin(): boolean {
  const user = useCurrentUser();
  return user?.role === "admin";
}

/** 데모/테스트용 로그인 헬퍼 — 실제 Auth 플로우로 교체 예정. */
export function signInAs(userId: string, role: string | null = null): void {
  window.localStorage.setItem(STORAGE_KEY_ID, userId);
  if (role) {
    window.localStorage.setItem(STORAGE_KEY_ROLE, role);
  } else {
    window.localStorage.removeItem(STORAGE_KEY_ROLE);
  }
}

/** 데모/테스트용 로그아웃 헬퍼 */
export function signOut(): void {
  window.localStorage.removeItem(STORAGE_KEY_ID);
  window.localStorage.removeItem(STORAGE_KEY_ROLE);
}
