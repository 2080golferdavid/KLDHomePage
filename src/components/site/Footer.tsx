import Link from "next/link";
import CmsImage from "@/components/site/CmsImage";
import type { SiteSettings } from "@/lib/content/types";

const LINKS = [
  { href: "/about", label: "KLD 소개" },
  { href: "/officials", label: "임원진" },
  { href: "/news", label: "협회 소식" },
  { href: "/contact", label: "연락·문의" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
];

export default function Footer({ settings }: { settings: SiteSettings }) {
  const logoSrc = `/api/brand/logo?v=${encodeURIComponent(settings.updatedAt)}`;

  return (
    <footer className="mt-8 border-t border-kld-line bg-white">
      <div className="kld-shell flex flex-col gap-8 py-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm">
          <CmsImage src={logoSrc} alt="" className="h-8 w-auto object-contain" />
          <p className="mt-4 text-lg font-bold leading-snug text-kld-ink">{settings.slogan}</p>
          <p className="mt-2 text-sm leading-relaxed text-kld-muted">{settings.footerNote}</p>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
          <ul className="space-y-2 text-sm text-kld-ink/80">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-kld-navy">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {settings.sns.length > 0 && (
            <ul className="space-y-2 text-sm text-kld-ink/80">
              {settings.sns.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a href={link.href} className="hover:text-kld-navy" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="kld-shell border-t border-kld-line py-4 text-xs text-kld-muted">
        <p>© {new Date().getFullYear()} {settings.siteNameEn}</p>
      </div>
    </footer>
  );
}
