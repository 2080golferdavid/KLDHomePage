"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CmsImage from "@/components/site/CmsImage";
import { HEADER_LOGO_CLASS } from "@/components/site/logoStyle";
import { ABOUT_LABEL, ABOUT_NAV, PRIMARY_NAV, isAboutSection, isNavActive } from "@/components/site/nav";
import type { SiteSettings } from "@/lib/content/types";

function linkClass(active: boolean) {
  return `relative py-2 text-sm font-semibold ${
    active
      ? "text-kld-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-kld-red"
      : "text-kld-ink/70 hover:text-kld-ink"
  }`;
}

export default function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const menuId = useId();
  const aboutRef = useRef<HTMLDivElement>(null);
  const hoverOpen = useRef(false);
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutMobile, setAboutMobile] = useState(false);
  const aboutActive = isAboutSection(pathname);

  useEffect(() => {
    setOpen(false);
    setAboutOpen(false);
    setAboutMobile(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setAboutOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!aboutOpen) return;
    function onPointer(event: MouseEvent) {
      if (!aboutRef.current?.contains(event.target as Node)) setAboutOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [aboutOpen]);

  const logoSrc = `/api/brand/logo?v=${encodeURIComponent(settings.updatedAt)}`;

  return (
    <header className="kld-shell pt-4 sm:pt-6">
      <div className="flex items-center gap-4 rounded-[22px] bg-white px-4 py-3 shadow-card sm:px-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <CmsImage src={logoSrc} alt={`${settings.siteName} 로고`} className={HEADER_LOGO_CLASS} />
          <span className="hidden h-9 w-px bg-kld-line sm:block" />
          <span className="hidden min-w-0 leading-tight sm:block">
            <span className="block truncate text-sm font-bold text-kld-ink">{settings.siteName}</span>
            <span className="block truncate text-[10px] font-medium tracking-[0.14em] text-kld-muted">
              KOREA LONG DRIVE
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="주요 메뉴">
          <div
            ref={aboutRef}
            className="relative"
            onMouseEnter={() => {
              hoverOpen.current = true;
              setAboutOpen(true);
            }}
            onMouseLeave={() => {
              hoverOpen.current = false;
              setAboutOpen(false);
            }}
            onBlur={(event) => {
              if (!aboutRef.current?.contains(event.relatedTarget as Node | null)) {
                setAboutOpen(false);
              }
            }}
          >
            <button
              type="button"
              className={`${linkClass(aboutActive)} inline-flex items-center gap-1`}
              aria-expanded={aboutOpen}
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={() => {
                if (hoverOpen.current) return;
                setAboutOpen((value) => !value);
              }}
            >
              {ABOUT_LABEL}
              <svg
                viewBox="0 0 20 20"
                className={`h-4 w-4 transition ${aboutOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path
                  d="M5 7.5 10 12.5 15 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {aboutOpen && (
              <div id={menuId} className="absolute left-0 top-full z-30 pt-3">
                <div className="w-48 rounded-2xl bg-white p-2 shadow-card ring-1 ring-kld-line">
                  {ABOUT_NAV.map((item) => {
                    const active = isNavActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-xl px-3 py-2.5 text-sm font-semibold ${
                          active ? "bg-kld-paper text-kld-navy" : "text-kld-ink/80 hover:bg-kld-paper hover:text-kld-ink"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {PRIMARY_NAV.map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={linkClass(active)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-kld-line lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() =>
            setOpen((value) => {
              const next = !value;
              if (next && aboutActive) setAboutMobile(true);
              return next;
            })
          }
        >
          <span className="sr-only">메뉴</span>
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-4 bg-kld-navy" />
            <span className="block h-0.5 w-4 bg-kld-navy" />
            <span className="block h-0.5 w-4 bg-kld-navy" />
          </span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="mt-2 rounded-[22px] bg-white p-2 shadow-card lg:hidden" aria-label="주요 메뉴">
          <button
            type="button"
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
              aboutActive ? "bg-kld-paper text-kld-navy" : "text-kld-ink"
            }`}
            aria-expanded={aboutMobile}
            aria-controls="mobile-about"
            onClick={() => setAboutMobile((value) => !value)}
          >
            {ABOUT_LABEL}
            <span aria-hidden="true">{aboutMobile ? "−" : "+"}</span>
          </button>
          {aboutMobile && (
            <div id="mobile-about" className="pb-1 pl-3">
              {ABOUT_NAV.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-2xl px-4 py-2.5 text-sm font-semibold ${
                      active ? "bg-kld-paper text-kld-navy" : "text-kld-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
          {PRIMARY_NAV.map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-2xl px-4 py-3 text-sm font-semibold ${
                  active ? "bg-kld-paper text-kld-navy" : "text-kld-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
