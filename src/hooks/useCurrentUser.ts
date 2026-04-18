"use client";

import { useEffect, useState } from "react";

/* ══════════════════════════════════════════
   현재 로그인한 사용자를 추적하는 커스텀 훅(Hook)

   현재 구현:
   - 브라우저 localStorage 의 4개 키를 읽어 로그인 상태를 흉내 낸다.
       kld:currentUserId        → 사용자 id (필수)
       kld:currentUserRole      → 역할 문자열 (선택, 예: 'admin')
       kld:currentMemberType    → 회원 등급 (선택, 'general' 또는 'full')
       kld:currentUserName      → 표시용 이름 (선택)
   - 값이 없으면 `null`(비로그인) 을 반환한다.
   - 다른 탭/창에서 값이 바뀌면 storage 이벤트로 동기화된다.

   향후 교체:
   - 실제 인증 시스템(Supabase Auth) 연동 시 내부 구현만 교체한다.
     세션에서 user_metadata/app_metadata 를 읽어 동일한 CurrentUser 로 매핑하면 된다.

   테스트 방법:
   - 일반회원:
       signInAs('kim-taehun', { memberType: 'general', name: '김태훈' })
   - 정회원:
       signInAs('kim-taehun', { memberType: 'full', name: '김태훈' })
   - 관리자:
       signInAs('admin-seed', { role: 'admin', memberType: 'full', name: '관리자' })
══════════════════════════════════════════ */

const STORAGE_KEY_ID = "kld:currentUserId";
const STORAGE_KEY_ROLE = "kld:currentUserRole";
const STORAGE_KEY_MEMBER = "kld:currentMemberType";
const STORAGE_KEY_NAME = "kld:currentUserName";

export type MemberTier = "general" | "full";

export interface CurrentUser {
  id: string;
  /** 'admin' 이면 관리자. null 이면 일반 사용자. */
  role: string | null;
  /** 회원 등급. 값 없으면 'general' 로 취급한다. */
  memberType: MemberTier;
  /** 표시용 이름. 없으면 null(호출자가 fallback 처리). */
  name: string | null;
}

/** localStorage 에서 현재 사용자를 읽는 순수 함수 */
function readFromStorage(): CurrentUser | null {
  const id = window.localStorage.getItem(STORAGE_KEY_ID);
  if (!id) return null;
  const role = window.localStorage.getItem(STORAGE_KEY_ROLE);
  const memberRaw = window.localStorage.getItem(STORAGE_KEY_MEMBER);
  const name = window.localStorage.getItem(STORAGE_KEY_NAME);
  return {
    id,
    role: role || null,
    memberType: memberRaw === "full" ? "full" : "general",
    name: name || null,
  };
}

export function useCurrentUser(): CurrentUser | null {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    setUser(readFromStorage());

    /* 다른 탭에서 로그인 상태가 변경되면 동기화한다.
       감시 키가 여러 개이므로 관심 있는 키만 필터링한다. */
    function handleStorage(event: StorageEvent) {
      if (
        event.key !== STORAGE_KEY_ID &&
        event.key !== STORAGE_KEY_ROLE &&
        event.key !== STORAGE_KEY_MEMBER &&
        event.key !== STORAGE_KEY_NAME
      ) {
        return;
      }
      setUser(readFromStorage());
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return user;
}

/** 관리자 여부 — app_metadata/user_metadata.role === 'admin' */
export function useIsAdmin(): boolean {
  const user = useCurrentUser();
  return user?.role === "admin";
}

/* ══════════════════════════════════════════
   데모/테스트 헬퍼 — 실제 Auth 플로우로 교체 예정
══════════════════════════════════════════ */

export interface SignInOptions {
  role?: string | null;
  memberType?: MemberTier;
  name?: string | null;
}

/** 로그인 시뮬레이션 — localStorage 에 세션 정보를 기록한다. */
export function signInAs(userId: string, options: SignInOptions = {}): void {
  window.localStorage.setItem(STORAGE_KEY_ID, userId);

  if (options.role) {
    window.localStorage.setItem(STORAGE_KEY_ROLE, options.role);
  } else {
    window.localStorage.removeItem(STORAGE_KEY_ROLE);
  }

  if (options.memberType) {
    window.localStorage.setItem(STORAGE_KEY_MEMBER, options.memberType);
  } else {
    window.localStorage.removeItem(STORAGE_KEY_MEMBER);
  }

  if (options.name) {
    window.localStorage.setItem(STORAGE_KEY_NAME, options.name);
  } else {
    window.localStorage.removeItem(STORAGE_KEY_NAME);
  }
}

/** 로그아웃 — 모든 세션 키 제거 */
export function signOut(): void {
  window.localStorage.removeItem(STORAGE_KEY_ID);
  window.localStorage.removeItem(STORAGE_KEY_ROLE);
  window.localStorage.removeItem(STORAGE_KEY_MEMBER);
  window.localStorage.removeItem(STORAGE_KEY_NAME);
}
