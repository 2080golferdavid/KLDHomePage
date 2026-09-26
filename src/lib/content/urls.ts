/** 관리자 입력 주소가 스크립트나 이상한 경로가 되지 않게 걸러 낸다. */

const MAX_DATA_URL = 700_000;

export function cleanMediaUrl(value: string): string | null {
  const v = value.trim();
  if (!v) return "";
  if (v.length > MAX_DATA_URL) return null;
  if (v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") && !v.includes("..")) {
    if (v.startsWith("/api/brand")) return null;
    return v;
  }
  if (/^https?:\/\//i.test(v)) {
    try {
      const url = new URL(v);
      if (url.protocol !== "http:" && url.protocol !== "https:") return null;
      return url.toString();
    } catch {
      return null;
    }
  }
  if (/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/i.test(v)) {
    return v;
  }
  return null;
}

export function cleanHref(value: string): string | null {
  const v = value.trim();
  if (!v || v === "#") return "#";
  if (/^mailto:/i.test(v)) {
    if (/[\s<>]/.test(v) || /javascript/i.test(v)) return null;
    return v;
  }
  if (v.startsWith("/") && !v.startsWith("//") && !v.includes("..")) return v;
  if (/^https?:\/\//i.test(v)) {
    try {
      const url = new URL(v);
      if (url.protocol !== "http:" && url.protocol !== "https:") return null;
      return url.toString();
    } catch {
      return null;
    }
  }
  return null;
}

export function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export function slugify(input: string): string {
  const ascii = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return ascii || `post-${Date.now().toString(36)}`;
}
