import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createSeed } from "@/lib/content/seed";
import type {
  CollectionKey,
  ContentStatus,
  Inquiry,
  SiteDocument,
  StoreMode,
} from "@/lib/content/types";

const FILE_PATH = path.join(process.cwd(), ".data", "site-content.json");

const COLLECTION_KEYS: CollectionKey[] = [
  "settings",
  "about",
  "officials",
  "news",
  "contact",
  "legal",
  "inquiries",
  "players",
  "events",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 파일이나 DB 가 비어 있어도 기본 글로 사이트가 채워지게 합친다. */
export function mergeDocument(input: unknown): SiteDocument {
  const seed = createSeed();
  if (!isRecord(input)) return seed;

  const about = isRecord(input.about) ? input.about : {};
  const legal = isRecord(input.legal) ? input.legal : {};

  return {
    settings: { ...seed.settings, ...(isRecord(input.settings) ? input.settings : {}) },
    about: {
      ...seed.about,
      ...about,
      values: Array.isArray(about.values) ? about.values : seed.about.values,
      history: Array.isArray(about.history) ? about.history : seed.about.history,
    },
    officials: Array.isArray(input.officials) ? input.officials : seed.officials,
    news: Array.isArray(input.news) ? input.news : seed.news,
    contact: { ...seed.contact, ...(isRecord(input.contact) ? input.contact : {}) },
    legal: {
      privacy: {
        ...seed.legal.privacy,
        ...(isRecord(legal.privacy) ? legal.privacy : {}),
      },
      terms: {
        ...seed.legal.terms,
        ...(isRecord(legal.terms) ? legal.terms : {}),
      },
    },
    inquiries: Array.isArray(input.inquiries) ? input.inquiries : [],
    players: Array.isArray(input.players) ? input.players : [],
    events: Array.isArray(input.events) ? input.events : [],
  } as SiteDocument;
}

function supabaseEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return { url, key };
}

export function resolveStoreMode(): StoreMode {
  const forced = process.env.CONTENT_STORE?.trim();
  if (forced === "seed" || forced === "file" || forced === "supabase") {
    if (forced === "supabase" && !supabaseEnv()) return "seed";
    return forced;
  }
  if (supabaseEnv()) return "supabase";
  if (process.env.VERCEL) return "seed";
  return "file";
}

function supabase(): SupabaseClient {
  const env = supabaseEnv();
  if (!env) {
    throw new Error("Supabase 주소와 서비스 롤 키가 없습니다.");
  }
  return createClient(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let writeQueue: Promise<void> = Promise.resolve();

function enqueue(task: () => Promise<void>): Promise<void> {
  const run = writeQueue.then(task, task);
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readFileDocument(): Promise<SiteDocument> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    return mergeDocument(JSON.parse(raw) as unknown);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return createSeed();
    if (error instanceof SyntaxError) return createSeed();
    throw error;
  }
}

async function writeFileDocument(doc: SiteDocument): Promise<void> {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  const temp = `${FILE_PATH}.tmp`;
  await fs.writeFile(temp, JSON.stringify(doc, null, 2), "utf8");
  await fs.rename(temp, FILE_PATH);
}

async function readSupabaseDocument(): Promise<SiteDocument> {
  const { data, error } = await supabase().from("cms_collections").select("key, data");
  if (error) {
    throw new Error(error.message);
  }
  const partial: Record<string, unknown> = {};
  for (const row of data ?? []) {
    if (typeof row.key === "string" && COLLECTION_KEYS.includes(row.key as CollectionKey)) {
      partial[row.key] = row.data;
    }
  }
  return mergeDocument(partial);
}

async function writeSupabaseKey(key: CollectionKey, value: unknown): Promise<void> {
  const { error } = await supabase().from("cms_collections").upsert({ key, data: value });
  if (error) throw new Error(error.message);
}

export function getContentStatus(): ContentStatus {
  const mode = resolveStoreMode();
  if (mode === "supabase") {
    return {
      mode,
      writable: true,
      detail: "Supabase 표 cms_collections 에 저장됩니다. SQL을 한 번 실행해야 합니다.",
    };
  }
  if (mode === "file") {
    return {
      mode,
      writable: true,
      detail: "이 컴퓨터의 .data/site-content.json 파일에 저장됩니다. 배포 서버에는 남지 않습니다.",
    };
  }
  return {
    mode,
    writable: false,
    detail: "지금은 기본 글만 보여 줍니다. 저장하려면 Supabase를 연결하세요.",
  };
}

async function readDocument(): Promise<SiteDocument> {
  const mode = resolveStoreMode();
  if (mode === "supabase") return readSupabaseDocument();
  if (mode === "file") return readFileDocument();
  return createSeed();
}

async function updateKey<K extends CollectionKey>(key: K, value: SiteDocument[K]): Promise<void> {
  const status = getContentStatus();
  if (!status.writable) {
    throw new Error("저장소가 읽기 전용입니다. Supabase 환경 변수를 설정해 주세요.");
  }
  if (status.mode === "supabase") {
    await writeSupabaseKey(key, value);
    return;
  }
  await enqueue(async () => {
    const doc = await readFileDocument();
    doc[key] = value;
    await writeFileDocument(doc);
  });
}

export async function saveCollection<K extends CollectionKey>(
  key: K,
  value: SiteDocument[K],
): Promise<void> {
  await updateKey(key, value);
}

export async function appendInquiry(inquiry: Inquiry): Promise<void> {
  const status = getContentStatus();
  if (!status.writable) {
    throw new Error("저장소가 읽기 전용입니다. Supabase 환경 변수를 설정해 주세요.");
  }
  if (status.mode === "supabase") {
    const doc = await readSupabaseDocument();
    await writeSupabaseKey("inquiries", [inquiry, ...doc.inquiries].slice(0, 200));
    return;
  }
  await enqueue(async () => {
    const doc = await readFileDocument();
    doc.inquiries = [inquiry, ...doc.inquiries].slice(0, 200);
    await writeFileDocument(doc);
  });
}

export async function pingStore(): Promise<string | null> {
  if (resolveStoreMode() !== "supabase") return null;
  try {
    await readSupabaseDocument();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Supabase에 연결하지 못했습니다.";
  }
}

/** 한 요청 안에서는 같은 글을 다시 읽지 않는다. 요청마다 새로 읽는다. */
export const getDocument = cache(async (): Promise<SiteDocument> => {
  noStore();
  try {
    return await readDocument();
  } catch (error) {
    console.error("[kld] content read failed", error);
    return createSeed();
  }
});
