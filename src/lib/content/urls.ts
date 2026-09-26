/** 관리자 입력 주소가 스크립트나 이상한 경로가 되지 않게 걸러 낸다. */

/** data URL 문자 수 한도. 로고를 내보낼 때도 이 한도를 넘기면 저장이 거절된다. */
export const MAX_DATA_URL_LENGTH = 700_000;

/** 그대로 저장하는 그림 파일 한도. 자른 로고도 이 크기 안에 맞춘다. */
export const MAX_MEDIA_FILE_BYTES = 450_000;

/** 로고 자르기 전에 받아 들이는 원본 한도. 저장본은 더 작게 압축한다. */
export const LOGO_SOURCE_MAX_BYTES = 8_000_000;

const IMAGE_DATA_URL = /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/i;

export function isImageDataUrl(value: string): boolean {
  return IMAGE_DATA_URL.test(value);
}

export function cleanMediaUrl(value: string): string | null {
  const v = value.trim();
  if (!v) return "";
  if (v.length > MAX_DATA_URL_LENGTH) return null;
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
  if (isImageDataUrl(v)) {
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
