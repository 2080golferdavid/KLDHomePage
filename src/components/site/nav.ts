export const ABOUT_LABEL = "협회 소개";

export const ABOUT_NAV = [
  { href: "/about", label: "협회 소개" },
  { href: "/about/greeting", label: "회장 인사말" },
  { href: "/about/officials", label: "임원진" },
] as const;

export const PRIMARY_NAV = [
  { href: "/news", label: "협회 소식" },
  { href: "/contact", label: "연락·문의" },
] as const;

/** `/about` 는 소개 페이지만 켜고, 인사말·임원 주소는 따로 구분한다. */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/about") return pathname === "/about";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isAboutSection(pathname: string): boolean {
  return pathname === "/about" || pathname.startsWith("/about/");
}
