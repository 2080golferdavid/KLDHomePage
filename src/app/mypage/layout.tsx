"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MyPageSidebar from "@/components/mypage/MyPageSidebar";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";

/**
 * 마이페이지 공유 레이아웃.
 * - 비로그인 사용자를 /auth/login 으로 replace.
 * - 로그인된 사용자의 이름·사진·등급을 사이드바에 전달.
 */
export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, userId, memberType, name, profile } = useCurrentUserProfile();

  useEffect(() => {
    if (!loading && !userId) {
      router.replace("/auth/login");
    }
  }, [loading, userId, router]);

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", paddingTop: 140, paddingBottom: 64 }}>
        <div className="wrap">
          <div className="kld-caption-mono">마이페이지를 불러오는 중...</div>
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main style={{ minHeight: "100vh", paddingTop: 140, paddingBottom: 64 }}>
        <div className="wrap">
          <div className="kld-caption-mono">로그인 페이지로 이동 중...</div>
        </div>
      </main>
    );
  }

  const displayName = name ?? profile?.name ?? userId;
  const displayInitials =
    profile?.initials ??
    (name ? name.slice(0, 2).toUpperCase() : userId.slice(0, 2).toUpperCase());
  const displayPhoto = profile?.photoUrl;

  return (
    <main style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <div className="wrap">
        <div
          className="mypage-grid"
          style={{
            display: "grid",
            gap: 28,
            gridTemplateColumns: "minmax(240px, 280px) 1fr",
          }}
        >
          <MyPageSidebar
            name={displayName}
            initials={displayInitials}
            photoUrl={displayPhoto}
            memberType={memberType}
          />
          <section style={{ minWidth: 0 }}>{children}</section>
        </div>
      </div>
    </main>
  );
}
