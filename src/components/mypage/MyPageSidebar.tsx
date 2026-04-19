"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MembershipBadge from "@/components/mypage/MembershipBadge";
import UserAvatar from "@/components/UserAvatar";
import type { MemberTier } from "@/hooks/useCurrentUser";

/* ── Props ── */
interface MyPageSidebarProps {
  name: string;
  initials: string;
  photoUrl?: string;
  memberType: MemberTier;
}

/** 마이페이지 하위 내비게이션 */
const MENU_ITEMS = [
  { href: "/mypage", en: "DASHBOARD", kr: "대시보드" },
  { href: "/mypage/profile", en: "PROFILE", kr: "프로필 수정" },
  { href: "/mypage/registrations", en: "ENTRIES", kr: "대회 신청 내역" },
  { href: "/mypage/records", en: "RECORDS", kr: "내 기록 & 랭킹" },
  { href: "/mypage/account", en: "ACCOUNT", kr: "회원정보 수정" },
  { href: "/mypage/password", en: "PASSWORD", kr: "비밀번호 변경" },
] as const;

/**
 * 마이페이지 사이드바.
 * 데스크톱(lg+): 좌측 세로 카드 + 세로 메뉴.
 * 작은 화면: 프로필 카드 + 가로 스크롤 탭.
 */
export default function MyPageSidebar({
  name,
  initials,
  photoUrl,
  memberType,
}: MyPageSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
      aria-label="마이페이지 메뉴"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "18px",
          background: "var(--kld-surface-1)",
          border: "1px solid var(--kld-line-strong)",
          borderTop: "2px solid var(--accent)",
        }}
      >
        <UserAvatar
          initials={initials}
          photoUrl={photoUrl}
          size={52}
          alt={`${name} 아바타`}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--kld-font-sans)",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </div>
          <div style={{ marginTop: 6 }}>
            <MembershipBadge tier={memberType} />
          </div>
        </div>
      </div>

      <nav
        className="mypage-nav"
        aria-label="마이페이지 내비게이션"
      >
        {MENU_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/mypage" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`mypage-nav-link ${isActive ? "is-active" : ""}`}
            >
              <span className="en">{item.en}</span>
              <span className="kr">{item.kr}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
