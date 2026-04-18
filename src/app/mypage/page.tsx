"use client";

import DashboardContent from "@/components/mypage/DashboardContent";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";

/**
 * 마이페이지 대시보드 — /mypage
 *
 * layout.tsx 에서 로그인 가드를 처리하므로 여기서는 로그인된 상태만 고려한다.
 * useCurrentUserProfile 을 다시 호출해도 훅 자체는 가볍게 동작하며,
 * 같은 세션 내에서는 캐시된 player 데이터가 즉시 반환된다.
 */
export default function MyPageDashboard() {
  const { memberType, name, profile, userId } = useCurrentUserProfile();

  /* layout.tsx 가 userId 없을 때를 처리하지만, 방어적으로 한 번 더 확인. */
  if (!userId) return null;

  const displayName = name ?? profile?.name ?? userId;

  return (
    <DashboardContent
      name={displayName}
      memberType={memberType}
      profile={profile}
    />
  );
}
