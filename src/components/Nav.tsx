"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import UserAvatar from "@/components/UserAvatar";
import { BI_NAV } from "@/constants/homeData";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";
import { signOut } from "@/hooks/useCurrentUser";

/* ══════════════════════════════════════════
   사이트 상단 네비게이션(Nav)

   - 티커 아래에 고정되는 방송형 헤더.
   - 각 메뉴는 영문/한글 이중 라벨을 노출한다.
   - 로그인 상태면 아바타 드롭다운, 비로그인이면 로그인/회원가입 버튼이 보인다.
   - 1024px 이하에서는 햄버거 → 슬라이드 드로어.
   ══════════════════════════════════════════ */

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const { loading: authLoading, userId, role, profile } =
    useCurrentUserProfile();
  const isLoggedIn = Boolean(userId);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  /* 스크롤 상태에 따라 배경 투명도를 강화한다. */
  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((v) => !v), []);
  const closeProfile = useCallback(() => setIsProfileMenuOpen(false), []);

  /* 드로어 열린 상태에서 데스크톱으로 리사이즈되면 자동 닫기 */
  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 1023 && isMenuOpen) setIsMenuOpen(false);
    }
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [isMenuOpen]);

  /* 드로어 열려 있을 때 바디 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  /* 프로필 드롭다운: 외부 클릭/ESC 로 닫기 */
  useEffect(() => {
    if (!isProfileMenuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsProfileMenuOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [isProfileMenuOpen]);

  const handleSignOut = useCallback(() => {
    signOut();
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  }, [router]);

  /* 표시용 값 */
  const displayName =
    profile?.name ?? (role === "admin" ? "관리자" : userId ?? "");
  const displayInitials =
    profile?.initials ??
    (role === "admin" ? "AD" : (userId ?? "").slice(0, 2).toUpperCase() || "U");
  const displayPhoto = profile?.photoUrl;

  /* 현재 경로를 기준으로 활성 탭 판별. 홈(/)은 정확히 일치할 때만 활성. */
  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href) ?? false;
  }

  return (
    <>
      <header className={`nav ${isScrolled ? "is-scrolled" : ""}`} role="banner">
        <div className="wrap nav-inner">
          {/* 브랜드 로고 — LOGO3.png.
             소스 이미지는 상하 여백이 큰 1080x1350 이므로 `.brand-logo` 박스에서
             cover + scale 로 중앙 영역만 크롭해 노출한다. */}
          <Link href="/" className="brand" aria-label="KLD · Korea Long Drive 홈">
            <span className="brand-logo">
              <Image
                src="/images/LOGO3.png"
                alt="KLD · Korea Long Drive"
                fill
                sizes="168px"
                priority
              />
            </span>
            <span className="brand-aside">
              <span className="brand-sub">
                <em>ASSOCIATION</em> · 협회
              </span>
              <span className="brand-sub brand-sub-2">
                <em>한국장타협회</em>
              </span>
            </span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="nav-links" aria-label="Primary">
            {BI_NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? "is-active" : ""}`}
              >
                <span className="en">{item.en}</span>
                <span className="kr">{item.kr}</span>
              </Link>
            ))}
          </nav>

          {/* 오른쪽 영역 */}
          <div className="nav-right">
            <span className="live-pill" aria-label="현재 라이브 · LIVE now">
              <span className="dot" aria-hidden="true" />
              LIVE · R2
            </span>

            {authLoading ? (
              <span
                aria-hidden="true"
                style={{
                  width: 160,
                  height: 36,
                  background: "var(--kld-line)",
                }}
              />
            ) : isLoggedIn ? (
              <div ref={profileMenuRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={isProfileMenuOpen}
                  aria-label={`${displayName} 프로필 메뉴`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 8px",
                    border: "1px solid var(--kld-line-strong)",
                  }}
                >
                  <UserAvatar
                    initials={displayInitials}
                    photoUrl={displayPhoto}
                    alt={`${displayName} 아바타`}
                  />
                  <span
                    style={{
                      fontFamily: "var(--kld-font-sans)",
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#fff",
                      maxWidth: 120,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {displayName}
                  </span>
                </button>

                {isProfileMenuOpen ? (
                  <ProfileDropdown
                    displayName={displayName}
                    role={role}
                    onNavigate={closeProfile}
                    onSignOut={handleSignOut}
                  />
                ) : null}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-ghost">
                  LOG IN · 로그인
                </Link>
                <Link href="/apply" className="btn btn-primary">
                  대회 신청 · APPLY
                </Link>
              </>
            )}

            <button
              className="hamburger"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={isMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 드로어 */}
      <nav
        className={`mobile-drawer ${isMenuOpen ? "is-open" : ""}`}
        aria-label="모바일 메뉴"
      >
        {authLoading ? (
          <div
            aria-hidden="true"
            style={{
              height: 62,
              background: "var(--kld-line)",
              marginBottom: 16,
            }}
          />
        ) : isLoggedIn ? (
          <div className="m-status-card">
            <UserAvatar
              initials={displayInitials}
              photoUrl={displayPhoto}
              size={44}
              alt={`${displayName} 아바타`}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--kld-font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  color: "var(--kld-fg-3)",
                  textTransform: "uppercase",
                }}
              >
                {role === "admin" ? "Administrator · 관리자" : "Signed in · 로그인"}
              </div>
              <div
                style={{
                  fontFamily: "var(--kld-font-sans)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#fff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </div>
            </div>
          </div>
        ) : (
          <div className="m-auth-row">
            <Link href="/auth/login" onClick={closeMenu}>
              LOG IN · 로그인
            </Link>
            <Link
              href="/auth/register"
              onClick={closeMenu}
              className="is-primary"
            >
              JOIN · 회원가입
            </Link>
          </div>
        )}

        {BI_NAV.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="m-link"
            onClick={closeMenu}
          >
            <span>{item.en}</span>
            <span className="kr">{item.kr}</span>
          </Link>
        ))}

        {isLoggedIn ? (
          <>
            <Link
              href="/mypage/profile"
              className="m-link"
              onClick={closeMenu}
            >
              <span>MY PAGE</span>
              <span className="kr">마이페이지</span>
            </Link>
            {role === "admin" ? (
              <Link href="/admin" className="m-link" onClick={closeMenu}>
                <span>ADMIN</span>
                <span className="kr">관리자</span>
              </Link>
            ) : null}
          </>
        ) : null}

        <Link href="/apply" className="m-link is-cta" onClick={closeMenu}>
          <span>APPLY NOW</span>
          <span className="kr">대회 신청하기 →</span>
        </Link>

        {isLoggedIn ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="m-link"
            style={{ textAlign: "left", width: "100%", color: "var(--kld-red)" }}
          >
            <span>SIGN OUT</span>
            <span className="kr">로그아웃</span>
          </button>
        ) : null}
      </nav>
    </>
  );
}

/* ══════════════════════════════════════════
   프로필 드롭다운 — 로그인 상태 전용.
   ══════════════════════════════════════════ */
interface ProfileDropdownProps {
  displayName: string;
  role: string | null;
  onNavigate: () => void;
  onSignOut: () => void;
}

function ProfileDropdown({
  displayName,
  role,
  onNavigate,
  onSignOut,
}: ProfileDropdownProps) {
  return (
    <div
      role="menu"
      aria-label="프로필 메뉴"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        minWidth: 220,
        background: "var(--kld-surface-2)",
        border: "1px solid var(--kld-line-strong)",
        boxShadow: "var(--kld-shadow-overlay)",
        padding: "8px 0",
      }}
    >
      <div
        style={{
          padding: "8px 16px 10px",
          borderBottom: "1px solid var(--kld-line)",
          marginBottom: 4,
        }}
      >
        <div
          style={{
            fontFamily: "var(--kld-font-mono)",
            fontSize: 9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--kld-fg-3)",
          }}
        >
          Signed in as
        </div>
        <div
          style={{
            fontFamily: "var(--kld-font-sans)",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {displayName}
        </div>
      </div>

      <MenuItem href="/mypage/profile" onClick={onNavigate}>
        MY PAGE · 마이페이지
      </MenuItem>
      <MenuItem href="/mypage/profile" onClick={onNavigate}>
        EDIT PROFILE · 프로필 수정
      </MenuItem>
      {role === "admin" ? (
        <MenuItem href="/admin" onClick={onNavigate}>
          ADMIN · 관리자 콘솔
        </MenuItem>
      ) : null}

      <div
        style={{
          borderTop: "1px solid var(--kld-line)",
          margin: "6px 0",
        }}
        aria-hidden="true"
      />

      <button
        type="button"
        role="menuitem"
        onClick={onSignOut}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          padding: "10px 16px",
          fontFamily: "var(--kld-font-sans)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--kld-red)",
        }}
      >
        SIGN OUT · 로그아웃
      </button>
    </div>
  );
}

interface MenuItemProps {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}

function MenuItem({ href, onClick, children }: MenuItemProps) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      style={{
        display: "block",
        padding: "10px 16px",
        fontFamily: "var(--kld-font-sans)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--kld-fg-2)",
      }}
    >
      {children}
    </Link>
  );
}
