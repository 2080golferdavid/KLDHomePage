"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CmsImage from "@/components/site/CmsImage";
import type { SiteSettings } from "@/lib/content/types";

const NAV = [
  { href: "/about", label: "KLD 소개" },
  { href: "/officials", label: "임원진" },
  { href: "/news", label: "협회 소식" },
  { href: "/contact", label: "연락·문의" },
];

export default function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const logoSrc = `/api/brand/logo?v=${encodeURIComponent(settings.updatedAt)}`;

  return (
    <header className="kld-shell pt-4 sm:pt-6">
      <div className="flex items-center gap-4 rounded-[22px] bg-white px-4 py-3 shadow-card sm:px-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <CmsImage src={logoSrc} alt={`${settings.siteName} 로고`} className="h-9 w-auto max-w-[140px] object-contain" />
          <span className="hidden h-8 w-px bg-kld-line sm:block" />
          <span className="hidden min-w-0 leading-tight sm:block">
            <span className="block truncate text-sm font-bold text-kld-ink">{settings.siteName}</span>
            <span className="block truncate text-[10px] font-medium tracking-[0.14em] text-kld-muted">
              KOREA LONG DRIVE
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm font-semibold ${
                  active
                    ? "text-kld-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-kld-red"
                    : "text-kld-ink/70 hover:text-kld-ink"
                }`}
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
          onClick={() => setOpen((value) => !value)}
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
        <nav id="mobile-nav" className="mt-2 rounded-[22px] bg-white p-2 shadow-card lg:hidden">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
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
