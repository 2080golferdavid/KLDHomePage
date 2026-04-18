"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import { NAV_LINKS } from "@/constants/siteData";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";
import { signOut } from "@/hooks/useCurrentUser";

/* ══════════════════════════════════════════
   사이트 상단 네비게이션(Nav)

   구성:
   - 데스크탑(1024+): 로고 + 메뉴 링크 + [로그인/프로필] + 대회신청
   - 모바일(≤1023): 로고 + 햄버거 → 슬라이드 드로어
     드로어 상단에는 로그인 상태 카드(비로그인: 두 버튼 / 로그인: 사용자 카드)

   로그인 상태 감지:
   - useCurrentUserProfile() 훅이 현재 localStorage 스텁 기반으로 동작한다.
   - Supabase 연결 시 훅 내부만 `supabase.auth.getSession()` 또는
     `@supabase/auth-helpers-react` 의 `useUser` 로 교체하면 된다.
══════════════════════════════════════════ */

/**
 * Supabase 연결 후 훅을 교체할 때도 이 컴포넌트는 수정할 필요가 없다.
 */
export default function Nav() {
  const router = useRouter();
  const { loading: authLoading, userId, role, profile } =
    useCurrentUserProfile();
  const isLoggedIn = Boolean(userId);

  /* ── 상태 ── */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  /* 프로필 드롭다운 외부 클릭 감지용 ref */
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  /* ── 스크롤에 따른 배경 변경 ── */
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── 토글/닫기 ── */
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  const closeProfileMenu = useCallback(() => {
    setIsProfileMenuOpen(false);
  }, []);

  /* ── 리사이즈로 모바일/데스크탑 전환 시 메뉴 초기화 ── */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1023 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  /* ── 모바일 드로어 열려 있을 때 body 스크롤 잠금 ── */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  /* ── 프로필 드롭다운: 외부 클릭 / ESC 키로 닫기 ── */
  useEffect(() => {
    if (!isProfileMenuOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsProfileMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isProfileMenuOpen]);

  /* ── 로그아웃 ──
     Supabase 연결 시 signOut() 내부에서 `supabase.auth.signOut()` 을 호출하도록 교체.
     현재는 localStorage 초기화만 수행한다. */
  const handleSignOut = useCallback(() => {
    signOut();
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    /* 로그아웃 후 홈으로 이동. router.refresh() 를 함께 호출해 서버 컴포넌트도 재평가. */
    router.push("/");
    router.refresh();
  }, [router]);

  /* ── 표시용 이름/이니셜 계산 ──
     선수 프로필이 있으면 거기서, 없으면 role/userId 기반 fallback 사용. */
  const displayName = profile?.name ?? (role === "admin" ? "관리자" : userId ?? "");
  const displayInitials =
    profile?.initials ??
    (role === "admin"
      ? "AD"
      : (userId ?? "").slice(0, 2).toUpperCase() || "U");
  const displayPhoto = profile?.photoUrl;

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-[200] h-nav
          flex items-center
          px-5 md:px-8 lg:px-16
          border-b border-kld-red/[0.12]
          backdrop-blur-sm
          transition-colors duration-300
          ${isScrolled ? "bg-dark/[0.98]" : "bg-gradient-to-b from-dark/[0.97] to-transparent"}
        `}
        role="banner"
      >
        {/* ── 로고 ── */}
        <Link href="/" className="flex items-center gap-3" aria-label="KLD 홈">
          <div
            className="
              w-[30px] h-[30px] border-2 border-kld-red
              flex items-center justify-center
              font-mono text-[9px] text-kld-red shrink-0
            "
          >
            KLD
          </div>
          <span className="font-display text-[26px] tracking-[0.1em] text-white-kld">
            KOREA LONG DRIVE
          </span>
        </Link>

        {/* ── 데스크톱 메뉴 링크 ── */}
        <nav className="hidden lg:flex gap-8 ml-auto mr-8" aria-label="주 메뉴">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                font-ui text-[13px] font-semibold
                tracking-[0.18em] uppercase text-gray-light
                hover:text-kld-red transition-colors
              "
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ══════════════════════════════════════════
            데스크톱 — 로그인 상태별 UI
            ══════════════════════════════════════════ */}
        <div className="hidden lg:flex items-center gap-3">
          {/* 인증 로딩 중에는 스켈레톤을 보여줘 레이아웃 흔들림을 방지 */}
          {authLoading ? (
            <div
              className="w-[200px] h-8 bg-white/[0.04] animate-pulse"
              aria-hidden="true"
            />
          ) : isLoggedIn ? (
            /* ── 로그인 상태: 아바타 + 드롭다운 ── */
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
                aria-label={`${displayName} 프로필 메뉴 열기`}
                className="
                  flex items-center gap-2.5
                  px-2 py-1
                  hover:bg-kld-red/[0.06] transition-colors
                "
              >
                <UserAvatar
                  initials={displayInitials}
                  photoUrl={displayPhoto}
                  alt={`${displayName} 아바타`}
                />
                <span className="font-ui text-[13px] font-semibold tracking-[0.1em] text-white-kld max-w-[120px] truncate">
                  {displayName}
                </span>
                <span
                  className={`
                    font-mono text-[9px] text-gray-mid transition-transform
                    ${isProfileMenuOpen ? "rotate-180" : ""}
                  `}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>

              {/* 드롭다운 패널 */}
              {isProfileMenuOpen ? (
                <div
                  role="menu"
                  aria-label="프로필 메뉴"
                  className="
                    absolute right-0 top-[calc(100%+8px)]
                    min-w-[200px]
                    bg-dark-200 border border-kld-red/30
                    shadow-[0_12px_32px_rgba(0,0,0,0.5)]
                    py-2
                  "
                >
                  {/* 헤더 영역 — 이름/ID 요약 */}
                  <div className="px-4 pb-2 mb-1 border-b border-white/[0.06]">
                    <div className="font-mono text-[10px] tracking-[0.18em] text-gray-mid uppercase">
                      Signed in as
                    </div>
                    <div className="font-ui text-[13px] font-semibold text-white-kld truncate">
                      {displayName}
                    </div>
                  </div>

                  <DropdownLink href="/mypage/profile" onClick={closeProfileMenu}>
                    마이페이지
                  </DropdownLink>
                  <DropdownLink href="/mypage/profile" onClick={closeProfileMenu}>
                    프로필 수정
                  </DropdownLink>
                  {role === "admin" ? (
                    <DropdownLink href="/admin" onClick={closeProfileMenu}>
                      관리자 콘솔
                    </DropdownLink>
                  ) : null}

                  {/* 구분선 */}
                  <div className="my-1 border-t border-white/[0.06]" aria-hidden="true" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="
                      w-full text-left
                      font-ui text-[12px] font-semibold tracking-[0.14em] uppercase
                      text-kld-red
                      px-4 py-2.5
                      hover:bg-kld-red/10 transition-colors
                    "
                  >
                    로그아웃
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            /* ── 비로그인 상태: 로그인 링크 + 회원가입 아웃라인 버튼 ── */
            <>
              <Link
                href="/auth/login"
                className="
                  font-ui text-[12px] font-semibold tracking-[0.2em] uppercase text-gray-light
                  px-2 py-2
                  hover:text-kld-red transition-colors
                "
              >
                로그인
              </Link>
              <Link
                href="/auth/register"
                className="
                  font-ui text-[12px] font-bold tracking-[0.2em] uppercase text-kld-red
                  border border-kld-red px-4 py-[9px]
                  hover:bg-kld-red hover:text-white-kld transition-colors
                "
              >
                회원가입
              </Link>
            </>
          )}

          {/* 대회 신청 버튼 — 로그인 상태와 무관하게 항상 표시 */}
          <Link
            href="/apply"
            className="
              inline-flex
              font-ui text-[12px] font-bold
              tracking-[0.2em] uppercase text-white-kld
              bg-kld-red px-[22px] py-[10px]
              hover:bg-kld-red-light transition-colors shrink-0
              ml-1
            "
          >
            대회 신청
          </Link>
        </div>

        {/* ── 모바일 햄버거 버튼 ── */}
        <button
          className="lg:hidden flex flex-col justify-center gap-[5px] w-9 h-9 ml-auto p-1"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block w-full h-[2px] bg-white-kld rounded-sm transition-all duration-250
              ${isMenuOpen ? "translate-y-[7px] rotate-45" : ""}
            `}
          />
          <span
            className={`block w-full h-[2px] bg-white-kld rounded-sm transition-all duration-250
              ${isMenuOpen ? "opacity-0" : ""}
            `}
          />
          <span
            className={`block w-full h-[2px] bg-white-kld rounded-sm transition-all duration-250
              ${isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}
            `}
          />
        </button>
      </header>

      {/* ══════════════════════════════════════════
          모바일 네비게이션 드로어
          ══════════════════════════════════════════ */}
      <nav
        className={`
          fixed top-nav left-0 right-0 z-[190]
          bg-dark/[0.98] border-b border-kld-red/20
          backdrop-blur-xl
          flex flex-col px-5 py-6 gap-0
          transition-all duration-250
          ${isMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-3 opacity-0 pointer-events-none"}
          lg:hidden
          max-h-[calc(100vh-theme(spacing.nav))] overflow-y-auto
        `}
        aria-label="모바일 메뉴"
      >
        {/* ── 상단: 로그인 상태 카드 ── */}
        {authLoading ? (
          <div className="h-[72px] bg-white/[0.04] animate-pulse mb-5" aria-hidden="true" />
        ) : isLoggedIn ? (
          <div
            className="
              flex items-center gap-3 p-4 mb-5
              bg-dark-200 border border-kld-red/25
            "
          >
            <UserAvatar
              initials={displayInitials}
              photoUrl={displayPhoto}
              size={44}
              alt={`${displayName} 아바타`}
            />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[9px] tracking-[0.2em] text-gray-mid uppercase mb-0.5">
                {role === "admin" ? "Administrator" : "Signed in"}
              </div>
              <div className="font-ui text-[15px] font-semibold text-white-kld truncate">
                {displayName}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 mb-5">
            <Link
              href="/auth/login"
              onClick={closeMenu}
              className="
                inline-flex items-center justify-center
                font-ui text-[13px] font-semibold tracking-[0.2em] uppercase text-gray-light
                border border-white/10 px-4 py-3.5
                hover:border-kld-red hover:text-white-kld transition-colors
              "
            >
              로그인
            </Link>
            <Link
              href="/auth/register"
              onClick={closeMenu}
              className="
                inline-flex items-center justify-center
                font-ui text-[13px] font-bold tracking-[0.2em] uppercase text-kld-red
                border border-kld-red px-4 py-3.5
                hover:bg-kld-red hover:text-white-kld transition-colors
              "
            >
              회원가입
            </Link>
          </div>
        )}

        {/* ── 메인 메뉴 링크 ── */}
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMenu}
            className="
              font-ui text-lg font-semibold
              tracking-[0.14em] uppercase text-gray-light
              py-[14px] border-b border-white/[0.06]
              hover:text-kld-red transition-colors
            "
          >
            {link.label}
          </Link>
        ))}

        {/* ── 로그인 상태일 때만: 마이페이지 / 관리자 콘솔 ── */}
        {isLoggedIn ? (
          <>
            <Link
              href="/mypage/profile"
              onClick={closeMenu}
              className="
                font-ui text-lg font-semibold
                tracking-[0.14em] uppercase text-gray-light
                py-[14px] border-b border-white/[0.06]
                hover:text-kld-red transition-colors
              "
            >
              마이페이지
            </Link>
            {role === "admin" ? (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="
                  font-ui text-lg font-semibold
                  tracking-[0.14em] uppercase text-gray-light
                  py-[14px] border-b border-white/[0.06]
                  hover:text-kld-red transition-colors
                "
              >
                관리자 콘솔
              </Link>
            ) : null}
          </>
        ) : null}

        {/* ── 대회 신청 CTA ── */}
        <Link
          href="/apply"
          onClick={closeMenu}
          className="
            font-ui text-lg font-bold
            tracking-[0.14em] uppercase text-kld-red
            py-[14px]
          "
        >
          대회 신청하기
        </Link>

        {/* ── 로그인 상태일 때만: 로그아웃 버튼 ── */}
        {isLoggedIn ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="
              mt-3 inline-flex items-center justify-center
              font-ui text-[13px] font-bold tracking-[0.2em] uppercase
              text-gray-light
              border border-white/10 px-4 py-3
              hover:border-kld-red hover:text-kld-red transition-colors
            "
          >
            로그아웃
          </button>
        ) : null}
      </nav>
    </>
  );
}

/* ══════════════════════════════════════════
   내부 헬퍼: 드롭다운 메뉴 아이템
══════════════════════════════════════════ */
interface DropdownLinkProps {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}

function DropdownLink({ href, onClick, children }: DropdownLinkProps) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="
        block font-ui text-[12px] font-semibold tracking-[0.14em] uppercase
        text-gray-light
        px-4 py-2.5
        hover:bg-kld-red/10 hover:text-white-kld transition-colors
      "
    >
      {children}
    </Link>
  );
}
