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

/** 마이페이지 하위 내비게이션 항목 정의 */
const MENU_ITEMS = [
  { href: "/mypage", label: "대시보드" },
  { href: "/mypage/profile", label: "프로필 수정" },
  { href: "/mypage/registrations", label: "내 대회 신청 내역" },
  { href: "/mypage/records", label: "내 기록 & 랭킹" },
  { href: "/mypage/account", label: "회원정보 수정" },
  { href: "/mypage/password", label: "비밀번호 변경" },
] as const;

/**
 * 마이페이지 전용 사이드바(Desktop) / 상단 탭(Tablet) / 상단 카드 + 세로 리스트(Mobile)
 *
 * 반응형:
 * - 데스크톱(lg+): 좌측 세로 사이드바. 프로필 카드(상단) + 메뉴 리스트(하단)
 * - 태블릿(md~lg): 프로필 카드 + 가로 탭 바
 * - 모바일(<md): 프로필 카드 + 세로 메뉴 리스트
 *
 * 활성 상태는 usePathname() 으로 판정한다.
 * 메뉴 항목 중 아직 구현되지 않은 경로는 링크로 두되 클릭 시 404 페이지로 이동할 수 있다.
 * (추후 기능이 구현되면 자동으로 연결됨)
 */
export default function MyPageSidebar({
  name,
  initials,
  photoUrl,
  memberType,
}: MyPageSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col" aria-label="마이페이지 메뉴">
      {/* ════════════════════
          프로필 카드 (데스크톱 상단 / 태블릿·모바일 상단)
      ════════════════════ */}
      <div
        className="
          flex items-center gap-4
          p-4 md:p-5
          bg-white-kld border border-black/[0.08]
        "
      >
        <UserAvatar
          initials={initials}
          photoUrl={photoUrl}
          size={56}
          alt={`${name} 아바타`}
        />
        <div className="min-w-0 flex-1">
          <div className="font-ui text-[15px] md:text-[16px] font-bold text-[#080808] truncate">
            {name}
          </div>
          <div className="mt-1.5">
            <MembershipBadge tier={memberType} />
          </div>
        </div>
      </div>

      {/* ════════════════════
          메뉴 리스트
          - 데스크톱(lg+): 세로
          - 태블릿(md~lg): 가로 스크롤 탭
          - 모바일(<md): 세로
      ════════════════════ */}
      <nav
        className="
          mt-4
          flex flex-col
          md:flex-row md:overflow-x-auto md:scrollbar-none md:border md:border-black/[0.08] md:bg-white-kld
          lg:flex-col lg:overflow-visible lg:border-0 lg:bg-transparent lg:mt-4
        "
        aria-label="마이페이지 내비게이션"
      >
        {MENU_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            /* 하위 경로(/mypage/profile/edit 등) 도 active 로 인식하려면
               startsWith 를 사용하되, 대시보드는 정확 매칭이어야 한다. */
            (item.href !== "/mypage" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`
                font-ui text-[13px] font-semibold tracking-[0.14em] uppercase
                whitespace-nowrap
                px-4 py-3 md:py-3.5
                border-b border-black/[0.06] last:border-b-0
                md:border-b-0 md:border-r md:border-black/[0.06] md:last:border-r-0
                lg:border-r-0 lg:border-b lg:border-black/[0.06] lg:last:border-b-0
                transition-colors
                ${isActive
                  ? "bg-kld-red text-white-kld md:bg-kld-red"
                  : "bg-white-kld text-[#333] hover:bg-kld-red/10 hover:text-kld-red"}
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
