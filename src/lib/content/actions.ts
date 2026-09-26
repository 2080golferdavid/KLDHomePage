"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminConfigured,
  clearAdminSession,
  isAdminSession,
  startAdminSession,
  verifyPassword,
} from "@/lib/auth/session";
import { appendInquiry, getDocument, saveCollection } from "@/lib/content/repository";
import type {
  AboutContent,
  ActionResult,
  ContactSettings,
  LegalDoc,
  NewsPost,
  Official,
  SiteSettings,
  SnsLink,
} from "@/lib/content/types";
import { cleanHref, cleanMediaUrl, clip, slugify } from "@/lib/content/urls";

function denied(): ActionResult {
  return { ok: false, message: "로그인이 필요합니다." };
}

function failed(error: unknown): ActionResult {
  const message = error instanceof Error ? error.message : "저장하지 못했습니다.";
  return { ok: false, message };
}

function refresh() {
  revalidatePath("/", "layout");
}

export async function loginAdmin(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!adminConfigured()) {
    return {
      ok: false,
      message: "ADMIN_PASSWORD 와 ADMIN_SESSION_SECRET 을 .env.local 에 넣어 주세요.",
    };
  }
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { ok: false, message: "비밀번호가 맞지 않습니다." };
  }
  startAdminSession();
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  clearAdminSession();
  redirect("/admin/login");
}

export async function saveSettings(input: SiteSettings): Promise<ActionResult> {
  if (!isAdminSession()) return denied();
  try {
    const logoUrl = cleanMediaUrl(input.logoUrl);
    const faviconUrl = cleanMediaUrl(input.faviconUrl);
    const heroImageUrl = cleanMediaUrl(input.heroImageUrl);
    if (logoUrl === null || faviconUrl === null || heroImageUrl === null) {
      return { ok: false, message: "이미지 주소는 http(s), 사이트 경로, 또는 이미지 파일만 됩니다." };
    }
    const sns: SnsLink[] = [];
    for (const link of input.sns ?? []) {
      const href = cleanHref(link.href ?? "");
      const label = clip(link.label ?? "", 40);
      if (!label) continue;
      if (href === null) {
        return { ok: false, message: `SNS 주소가 올바르지 않습니다: ${label}` };
      }
      sns.push({ label, href });
    }
    const current = await getDocument();
    const next: SiteSettings = {
      ...current.settings,
      siteName: clip(input.siteName, 40) || current.settings.siteName,
      siteNameEn: clip(input.siteNameEn, 80),
      slogan: clip(input.slogan, 80),
      oneLiner: clip(input.oneLiner, 180),
      heroEyebrow: clip(input.heroEyebrow, 80),
      heroTitle: clip(input.heroTitle, 120),
      heroBody: clip(input.heroBody, 600),
      heroImageUrl,
      logoUrl,
      faviconUrl,
      footerNote: clip(input.footerNote, 200),
      disclaimer: clip(input.disclaimer, 300),
      sns,
      updatedAt: new Date().toISOString(),
    };
    await saveCollection("settings", next);
    refresh();
    return { ok: true, message: "사이트 설정을 저장했습니다. 공개 화면을 새로고침해 보세요." };
  } catch (error) {
    return failed(error);
  }
}

export async function saveAbout(input: AboutContent): Promise<ActionResult> {
  if (!isAdminSession()) return denied();
  try {
    const next: AboutContent = {
      eyebrow: clip(input.eyebrow, 80),
      title: clip(input.title, 120),
      intro: clip(input.intro, 800),
      missionTitle: clip(input.missionTitle, 80),
      missionBody: clip(input.missionBody, 1200),
      values: (input.values ?? [])
        .slice(0, 8)
        .map((value, index) => ({
          number: clip(value.number, 8) || String(index + 1).padStart(2, "0"),
          title: clip(value.title, 40),
          body: clip(value.body, 240),
        }))
        .filter((value) => value.title),
      history: (input.history ?? [])
        .slice(0, 20)
        .map((item) => ({
          year: clip(item.year, 12),
          title: clip(item.title, 80),
          body: clip(item.body, 400),
          isExample: Boolean(item.isExample),
        }))
        .filter((item) => item.title),
      updatedAt: new Date().toISOString(),
    };
    await saveCollection("about", next);
    refresh();
    return { ok: true, message: "소개 글을 저장했습니다." };
  } catch (error) {
    return failed(error);
  }
}

export async function saveOfficials(input: Official[]): Promise<ActionResult> {
  if (!isAdminSession()) return denied();
  try {
    const next: Official[] = [];
    for (const person of input.slice(0, 40)) {
      const photoUrl = cleanMediaUrl(person.photoUrl ?? "");
      if (photoUrl === null) {
        return { ok: false, message: `${person.name || "임원"} 사진 주소가 올바르지 않습니다.` };
      }
      const name = clip(person.name ?? "", 40);
      if (!name) continue;
      next.push({
        id: clip(person.id || randomUUID(), 80),
        name,
        nameEn: clip(person.nameEn ?? "", 60),
        role: clip(person.role ?? "", 40),
        bio: clip(person.bio ?? "", 400),
        photoUrl,
        sort: Number.isFinite(Number(person.sort)) ? Number(person.sort) : next.length + 1,
        published: Boolean(person.published),
        isExample: Boolean(person.isExample),
      });
    }
    await saveCollection("officials", next);
    refresh();
    return { ok: true, message: "임원 목록을 저장했습니다." };
  } catch (error) {
    return failed(error);
  }
}

export async function saveNewsPost(input: NewsPost): Promise<ActionResult> {
  if (!isAdminSession()) return denied();
  try {
    const doc = await getDocument();
    const title = clip(input.title ?? "", 140);
    if (!title) return { ok: false, message: "제목을 입력해 주세요." };
    let slug = slugify(input.slug || title);
    const others = doc.news.filter((post) => post.id !== input.id);
    if (others.some((post) => post.slug === slug)) {
      slug = slugify(`${slug}-${input.id.slice(0, 4) || "2"}`);
    }
    const publishedAt = new Date(input.publishedAt);
    const next: NewsPost = {
      id: clip(input.id || randomUUID(), 80),
      slug,
      title,
      excerpt: clip(input.excerpt ?? "", 300),
      body: clip(input.body ?? "", 20000),
      category: clip(input.category ?? "", 20) || "안내",
      publishedAt: Number.isNaN(publishedAt.getTime())
        ? new Date().toISOString()
        : publishedAt.toISOString(),
      published: Boolean(input.published),
      isExample: Boolean(input.isExample),
    };
    const news = doc.news.some((post) => post.id === next.id)
      ? doc.news.map((post) => (post.id === next.id ? next : post))
      : [next, ...doc.news];
    await saveCollection("news", news);
    refresh();
    return { ok: true, message: "소식을 저장했습니다." };
  } catch (error) {
    return failed(error);
  }
}

export async function deleteNewsPost(id: string): Promise<void> {
  if (!isAdminSession()) redirect("/admin/login");
  const doc = await getDocument();
  await saveCollection(
    "news",
    doc.news.filter((post) => post.id !== id),
  );
  refresh();
  redirect("/admin/news");
}

export async function saveContact(input: ContactSettings): Promise<ActionResult> {
  if (!isAdminSession()) return denied();
  try {
    const next: ContactSettings = {
      email: clip(input.email, 120),
      phone: clip(input.phone, 40),
      address: clip(input.address, 160),
      hours: clip(input.hours, 80),
      note: clip(input.note, 400),
      isExample: Boolean(input.isExample),
      updatedAt: new Date().toISOString(),
    };
    await saveCollection("contact", next);
    refresh();
    return { ok: true, message: "연락처를 저장했습니다." };
  } catch (error) {
    return failed(error);
  }
}

export async function saveLegal(input: {
  privacy: LegalDoc;
  terms: LegalDoc;
}): Promise<ActionResult> {
  if (!isAdminSession()) return denied();
  try {
    const stamp = new Date().toISOString();
    await saveCollection("legal", {
      privacy: {
        title: clip(input.privacy.title, 40) || "개인정보처리방침",
        body: clip(input.privacy.body, 20000),
        isDraft: Boolean(input.privacy.isDraft),
        updatedAt: stamp,
      },
      terms: {
        title: clip(input.terms.title, 40) || "이용약관",
        body: clip(input.terms.body, 20000),
        isDraft: Boolean(input.terms.isDraft),
        updatedAt: stamp,
      },
    });
    refresh();
    return { ok: true, message: "법적 문서를 저장했습니다." };
  } catch (error) {
    return failed(error);
  }
}

export async function submitInquiry(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const trap = String(formData.get("company") ?? "");
  if (trap) return { ok: true, message: "문의가 접수되었습니다." };

  const name = clip(String(formData.get("name") ?? ""), 80);
  const email = clip(String(formData.get("email") ?? ""), 120);
  const message = clip(String(formData.get("message") ?? ""), 4000);
  if (name.length < 1 || !email.includes("@") || email.includes(" ") || message.length < 5) {
    return { ok: false, message: "이름, 이메일, 문의 내용(5자 이상)을 확인해 주세요." };
  }

  try {
    await appendInquiry({
      id: randomUUID(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    });
    return { ok: true, message: "문의가 접수되었습니다. 확인하는 대로 연락드리겠습니다." };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    return {
      ok: false,
      message: detail
        ? `지금은 사이트에 저장되지 않습니다. 메일로 직접 보내 주세요. (${detail})`
        : "지금은 사이트에 저장되지 않습니다. 메일로 직접 보내 주세요.",
    };
  }
}
