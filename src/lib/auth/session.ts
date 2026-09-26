import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "kld_admin";
const WEEK = 60 * 60 * 24 * 7;

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

function sign(exp: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  return createHmac("sha256", secret).update(`kld-admin.${exp}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !input) return false;
  return safeEqual(input, expected);
}

export function isAdminSession(): boolean {
  if (!adminConfigured()) return false;
  const raw = cookies().get(COOKIE)?.value ?? "";
  const dot = raw.indexOf(".");
  if (dot <= 0) return false;
  const exp = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

export function startAdminSession(): void {
  const exp = String(Date.now() + WEEK * 1000);
  cookies().set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.ADMIN_COOKIE_SECURE === "true" || process.env.VERCEL === "1",
    path: "/",
    maxAge: WEEK,
  });
}

export function clearAdminSession(): void {
  cookies().set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.ADMIN_COOKIE_SECURE === "true" || process.env.VERCEL === "1",
    path: "/",
    maxAge: 0,
  });
}
