/**
 * 콘텐츠 모양.
 * 나중에 Payload CMS 로 옮길 때 이 구조를 컬렉션으로 나누면 된다.
 * players, events 는 2단계(선수, 대회)용 빈 칸이다. 이번 화면에서는 쓰지 않는다.
 */

export interface SnsLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  siteName: string;
  siteNameEn: string;
  slogan: string;
  oneLiner: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroImageUrl: string;
  logoUrl: string;
  faviconUrl: string;
  footerNote: string;
  disclaimer: string;
  sns: SnsLink[];
  updatedAt: string;
}

export interface ValueItem {
  number: string;
  title: string;
  body: string;
}

export interface HistoryItem {
  year: string;
  title: string;
  body: string;
  isExample: boolean;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  intro: string;
  missionTitle: string;
  missionBody: string;
  values: ValueItem[];
  history: HistoryItem[];
  updatedAt: string;
}

export interface Official {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  bio: string;
  photoUrl: string;
  sort: number;
  published: boolean;
  isExample: boolean;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  publishedAt: string;
  published: boolean;
  isExample: boolean;
}

export interface ContactSettings {
  email: string;
  phone: string;
  address: string;
  hours: string;
  note: string;
  isExample: boolean;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface LegalDoc {
  title: string;
  body: string;
  isDraft: boolean;
  updatedAt: string;
}

/** 2단계 선수 소개. 아직 화면이 없다. */
export interface FuturePlayer {
  id: string;
  name: string;
  nameEn: string;
  bio: string;
  photoUrl: string;
  published: boolean;
}

/** 2단계 대회. 참가 신청은 일부러 넣지 않았다. */
export interface FutureEvent {
  id: string;
  title: string;
  startsAt: string;
  location: string;
  summary: string;
  status: "draft" | "published" | "closed";
}

export interface SiteDocument {
  settings: SiteSettings;
  about: AboutContent;
  officials: Official[];
  news: NewsPost[];
  contact: ContactSettings;
  legal: {
    privacy: LegalDoc;
    terms: LegalDoc;
  };
  inquiries: Inquiry[];
  players: FuturePlayer[];
  events: FutureEvent[];
}

export type CollectionKey = keyof SiteDocument;

export type StoreMode = "supabase" | "file" | "seed";

export interface ContentStatus {
  mode: StoreMode;
  writable: boolean;
  detail: string;
}

export interface ActionResult {
  ok: boolean;
  message: string;
}
