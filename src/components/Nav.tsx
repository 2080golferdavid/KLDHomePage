"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/constants/siteData";

/**
 * 사이트 상단 네비게이션(Nav)
 * - 데스크탑(1024px 이상): 로고 + 메뉴 링크 + 대회 신청 버튼
 * - 태블릿/모바일(1023px 이하): 로고 + 햄버거 버튼 → 슬라이드 드로어(Drawer)
 * - 스크롤 시 배경을 불투명(Solid)으로 변경한다.
 * - 로고 좌측에는 KLD 빨간 테두리 배지(Badge)를 포함한다.
 */
export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  /* 스크롤 위치에 따라 네비게이션 배경을 변경한다. */
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 60);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* 메뉴 열림/닫힘 토글 */
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  /* 메뉴 링크 클릭 시 드로어를 닫는다. */
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  /* 데스크톱 크기로 리사이즈되면 모바일 메뉴를 닫는다. */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1023 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  /* 메뉴가 열려있을 때 body 스크롤을 막는다. */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

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

        {/* ── 데스크톱 메뉴 링크 (1024px 이상에서만 표시) ── */}
        <nav className="hidden lg:flex gap-8 ml-auto mr-10" aria-label="주 메뉴">
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

        {/* ── 데스크톱 CTA 버튼 ── */}
        <Link
          href="/apply"
          className="
            hidden lg:inline-flex
            font-ui text-[12px] font-bold
            tracking-[0.2em] uppercase text-white-kld
            bg-kld-red px-[22px] py-[10px]
            hover:bg-kld-red-light transition-colors shrink-0
          "
        >
          대회 신청
        </Link>

        {/* ── 모바일 햄버거 버튼 (1023px 이하에서 표시) ── */}
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

      {/* ── 모바일 네비게이션 드로어 ── */}
      <nav
        className={`
          fixed top-nav left-0 right-0 z-[190]
          bg-dark/[0.98] border-b border-kld-red/20
          backdrop-blur-xl
          flex flex-col px-5 py-6 gap-0
          transition-all duration-250
          ${isMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-3 opacity-0 pointer-events-none"}
          lg:hidden
        `}
        aria-label="모바일 메뉴"
      >
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
      </nav>
    </>
  );
}
