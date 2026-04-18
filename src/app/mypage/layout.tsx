"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MyPageSidebar from "@/components/mypage/MyPageSidebar";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";

/* ══════════════════════════════════════════
   마이페이지 공유 레이아웃(Shared Layout)

   모든 /mypage/* 하위 라우트가 이 레이아웃을 공유한다.

   역할:
   - 비로그인 사용자를 /auth/login 으로 리다이렉트(Route Guard)
   - 로그인된 사용자의 이름·사진·등급을 읽어 사이드바에 전달
   - 본문(children) 을 우측(데스크톱)/하단(모바일) 에 배치
══════════════════════════════════════════ */

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, userId, memberType, name, profile } = useCurrentUserProfile();

  /* 비로그인 감지 시 /auth/login 으로 replace.
     replace 를 쓰는 이유: 뒤로가기 스택에 /mypage 를 남기지 않기 위해. */
  useEffect(() => {
    if (!loading && !userId) {
      router.replace("/auth/login");
    }
  }, [loading, userId, router]);

  /* 로딩 중: 스켈레톤 화면 */
  if (loading) {
    return (
      <main className="pt-nav bg-dark min-h-screen">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-12">
          <div className="font-mono text-[11px] tracking-[0.22em] text-gray-mid uppercase">
            마이페이지를 불러오는 중...
          </div>
        </div>
      </main>
    );
  }

  /* 비로그인: 위 useEffect 에서 리다이렉트되지만, 그 직전 한 프레임 동안의 깜빡임 방지 */
  if (!userId) {
    return (
      <main className="pt-nav bg-dark min-h-screen">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-12">
          <div className="font-mono text-[11px] tracking-[0.22em] text-gray-mid uppercase">
            로그인 페이지로 이동 중...
          </div>
        </div>
      </main>
    );
  }

  /* 표시용 값 계산 — 선수 프로필이 없으면 id 기반 fallback. */
  const displayName = name ?? profile?.name ?? userId;
  const displayInitials =
    profile?.initials ??
    (name ? name.slice(0, 2).toUpperCase() : userId.slice(0, 2).toUpperCase());
  const displayPhoto = profile?.photoUrl;

  return (
    <main className="pt-nav bg-dark min-h-screen">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-8 md:py-12">
        <div
          className="
            grid gap-6 md:gap-8
            grid-cols-1 lg:grid-cols-[260px_1fr]
          "
        >
          <MyPageSidebar
            name={displayName}
            initials={displayInitials}
            photoUrl={displayPhoto}
            memberType={memberType}
          />
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </main>
  );
}
