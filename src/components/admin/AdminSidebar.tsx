"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/lib/content/actions";

const LINKS = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/settings", label: "사이트 설정" },
  { href: "/admin/about", label: "소개 문구" },
  { href: "/admin/greeting", label: "회장 인사말" },
  { href: "/admin/officials", label: "임원진" },
  { href: "/admin/news", label: "협회 소식" },
  { href: "/admin/contact", label: "연락처" },
  { href: "/admin/legal", label: "법적 문서" },
  { href: "/admin/inquiries", label: "문의함" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-6 lg:w-56 lg:self-start">
      <div className="rounded-[28px] bg-white p-3 shadow-card">
        <p className="px-3 pb-2 pt-3 text-[11px] font-semibold tracking-[0.16em] text-kld-muted">
          KLD ADMINISTRATION
        </p>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {LINKS.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-2xl px-3 py-2.5 text-sm font-semibold ${
                  active ? "bg-[#E7EEF6] text-kld-navy" : "text-kld-ink/80 hover:bg-kld-paper"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-3 space-y-2 border-t border-kld-line px-3 py-3">
          <Link href="/" className="block text-sm font-semibold text-kld-navy">
            공개 사이트 보기
          </Link>
          <form action={logoutAdmin}>
            <button type="submit" className="text-sm font-semibold text-kld-muted">
              로그아웃
            </button>
          </form>
          <p className="text-[11px] leading-relaxed text-kld-muted">공개 바닥글에는 이 메뉴가 없습니다.</p>
        </div>
      </div>
    </aside>
  );
}
